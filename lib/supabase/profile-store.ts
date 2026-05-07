import type { SupabaseClient } from "@supabase/supabase-js";

import type { BodyProfile, MeasurementHistoryItem, ProductAnalysisResult, ProductMeasurement } from "@/lib/types";

type HistoryInsert = {
  owner_id: string;
  title: string;
  brand: string | null;
  source_url: string;
  category: string;
  size_label: string;
  measurement_payload: ProductMeasurement;
};

export async function loadBodyProfile(supabase: SupabaseClient, ownerId: string) {
  const { data, error } = await supabase
    .from("body_profiles")
    .select("profile_payload")
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data?.profile_payload as BodyProfile | null) ?? null;
}

export async function saveBodyProfile(
  supabase: SupabaseClient,
  ownerId: string,
  profile: BodyProfile
) {
  const { error } = await supabase.from("body_profiles").upsert(
    {
      owner_id: ownerId,
      profile_payload: profile,
      updated_at: new Date().toISOString()
    },
    { onConflict: "owner_id" }
  );

  if (error) {
    throw new Error(error.message);
  }
}

export async function loadHistory(supabase: SupabaseClient, ownerId: string) {
  const { data, error } = await supabase
    .from("measurement_histories")
    .select("id,title,brand,source_url,category,size_label,measurement_payload,created_at")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    throw new Error(error.message);
  }

  return (
    (data ?? []) as Array<{
      id: string;
      title: string;
      brand: string | null;
      source_url: string;
      category: string;
      size_label: string;
      measurement_payload: ProductMeasurement | null;
      created_at: string;
    }>
  ).map(
    (entry): MeasurementHistoryItem => ({
      id: String(entry.id),
      title: String(entry.title),
      brand: entry.brand ? String(entry.brand) : "",
      sourceUrl: String(entry.source_url),
      category: String(entry.category) === "pants" ? "pants" : "tops",
      garmentType: entry.measurement_payload?.garmentType ?? "unknown",
      sizeLabel: String(entry.size_label),
      savedAt: String(entry.created_at),
      measurement: entry.measurement_payload ?? undefined
    })
  );
}

export async function saveHistoryItem(
  supabase: SupabaseClient,
  ownerId: string,
  result: ProductAnalysisResult,
  measurement: ProductMeasurement
) {
  const payload: HistoryInsert = {
    owner_id: ownerId,
    title: result.title,
    brand: result.brand || null,
    source_url: result.sourceUrl,
    category: result.category,
    size_label: measurement.sizeLabel,
    measurement_payload: measurement
  };

  const { error } = await supabase.from("measurement_histories").insert(payload);

  if (error) {
    throw new Error(error.message);
  }
}
