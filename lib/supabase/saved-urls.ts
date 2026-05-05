import type { SupabaseClient } from "@supabase/supabase-js";

export type ViewSavedUrl = {
  id: string;
  url: string;
  title: string;
  category: string;
  tags: string[];
  memo: string;
  isFavorite: boolean;
  captureSource: string;
  organizationState: "needs_review" | "organized";
  createdAt: string;
  updatedAt: string;
};

export type SavedUrlInput = {
  url: string;
  title: string;
  category: string;
  tags: string[];
  memo: string;
  isFavorite: boolean;
  captureSource: string;
};

type CategoryRelation = {
  id: string;
  name: string;
};

type TagRelation = {
  id: string;
  name: string;
};

type SavedUrlTagRelation = {
  tags: TagRelation | TagRelation[] | null;
};

type SavedUrlQueryRow = {
  id: string;
  url: string;
  title: string;
  memo: string | null;
  is_favorite: boolean;
  capture_source: string | null;
  organization_state: "needs_review" | "organized" | null;
  created_at: string;
  updated_at: string;
  categories: CategoryRelation | CategoryRelation[] | null;
  saved_url_tags: SavedUrlTagRelation[] | null;
};

export async function fetchSavedUrls(
  supabase: SupabaseClient,
  ownerId: string
): Promise<ViewSavedUrl[]> {
  const { data, error } = await supabase
    .from("saved_urls")
    .select(
      "id,url,title,memo,is_favorite,capture_source,organization_state,created_at,updated_at,categories(id,name),saved_url_tags(tags(id,name))"
    )
    .eq("owner_id", ownerId)
    .order("updated_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as SavedUrlQueryRow[]).map(mapSavedUrlRow);
}

export async function saveSavedUrl(
  supabase: SupabaseClient,
  ownerId: string,
  input: SavedUrlInput,
  editingId?: string
) {
  const categoryId = await upsertCategory(supabase, ownerId, input.category);
  const tagIds = await upsertTags(supabase, ownerId, input.tags);
  const organizationState = getOrganizationState(input);
  const now = new Date().toISOString();
  const row = {
    owner_id: ownerId,
    url: input.url,
    display_url: input.url,
    title: input.title,
    category_id: categoryId,
    memo: input.memo || null,
    is_favorite: input.isFavorite,
    capture_source: input.captureSource,
    organization_state: organizationState,
    updated_at: now
  };

  const mutation = editingId
    ? supabase
        .from("saved_urls")
        .update(row)
        .eq("id", editingId)
        .eq("owner_id", ownerId)
        .select("id")
        .single()
    : supabase
        .from("saved_urls")
        .insert(row)
        .select("id")
        .single();

  const { data, error } = await mutation;

  if (error) {
    throw new Error(error.message);
  }

  const savedUrlId = (data as { id: string }).id;
  await replaceTagLinks(supabase, ownerId, savedUrlId, tagIds);
}

export async function toggleSavedUrlFavorite(
  supabase: SupabaseClient,
  ownerId: string,
  item: ViewSavedUrl
) {
  const { error } = await supabase
    .from("saved_urls")
    .update({
      is_favorite: !item.isFavorite,
      updated_at: new Date().toISOString()
    })
    .eq("id", item.id)
    .eq("owner_id", ownerId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteSavedUrl(
  supabase: SupabaseClient,
  ownerId: string,
  id: string
) {
  const { error } = await supabase
    .from("saved_urls")
    .delete()
    .eq("id", id)
    .eq("owner_id", ownerId);

  if (error) {
    throw new Error(error.message);
  }
}

async function upsertCategory(
  supabase: SupabaseClient,
  ownerId: string,
  categoryName: string
) {
  const name = categoryName.trim();

  if (!name) {
    return null;
  }

  const { data, error } = await supabase
    .from("categories")
    .upsert(
      {
        owner_id: ownerId,
        name,
        normalized_name: normalizeLabel(name),
        updated_at: new Date().toISOString()
      },
      { onConflict: "owner_id,normalized_name" }
    )
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return (data as { id: string }).id;
}

async function upsertTags(
  supabase: SupabaseClient,
  ownerId: string,
  tags: string[]
) {
  const tagIds: string[] = [];

  for (const tag of tags) {
    const name = tag.trim();

    if (!name) {
      continue;
    }

    const { data, error } = await supabase
      .from("tags")
      .upsert(
        {
          owner_id: ownerId,
          name,
          normalized_name: normalizeLabel(name),
          updated_at: new Date().toISOString()
        },
        { onConflict: "owner_id,normalized_name" }
      )
      .select("id")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    tagIds.push((data as { id: string }).id);
  }

  return tagIds;
}

async function replaceTagLinks(
  supabase: SupabaseClient,
  ownerId: string,
  savedUrlId: string,
  tagIds: string[]
) {
  const { error: deleteError } = await supabase
    .from("saved_url_tags")
    .delete()
    .eq("owner_id", ownerId)
    .eq("saved_url_id", savedUrlId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  if (!tagIds.length) {
    return;
  }

  const { error: insertError } = await supabase.from("saved_url_tags").insert(
    tagIds.map((tagId) => ({
      owner_id: ownerId,
      saved_url_id: savedUrlId,
      tag_id: tagId
    }))
  );

  if (insertError) {
    throw new Error(insertError.message);
  }
}

function mapSavedUrlRow(row: SavedUrlQueryRow): ViewSavedUrl {
  const category = Array.isArray(row.categories)
    ? row.categories[0]?.name ?? ""
    : row.categories?.name ?? "";

  return {
    id: row.id,
    url: row.url,
    title: row.title,
    category,
    tags: (row.saved_url_tags ?? [])
      .flatMap((link) => link.tags ?? [])
      .map((tag) => tag.name)
      .filter(Boolean),
    memo: row.memo ?? "",
    isFavorite: row.is_favorite,
    captureSource: row.capture_source ?? "manual_form",
    organizationState: row.organization_state ?? "needs_review",
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function getOrganizationState(input: SavedUrlInput): "needs_review" | "organized" {
  return input.category || input.tags.length || input.memo ? "organized" : "needs_review";
}

function normalizeLabel(value: string) {
  return value.trim().toLowerCase();
}
