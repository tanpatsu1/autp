"use client";

import type { User } from "@supabase/supabase-js";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  deleteSavedUrl,
  fetchSavedUrls,
  saveSavedUrl,
  toggleSavedUrlFavorite,
  type ViewSavedUrl
} from "@/lib/supabase/saved-urls";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import styles from "./saved-url-manager.module.css";

type ViewMode = "cards" | "list";

type UrlForm = {
  url: string;
  title: string;
  category: string;
  tags: string;
  memo: string;
  isFavorite: boolean;
};

type SavedUrlManagerProps = {
  isSupabaseConfigured: boolean;
};

const storageKey = "autp.savedUrls.v1";

const emptyForm: UrlForm = {
  url: "",
  title: "",
  category: "",
  tags: "",
  memo: "",
  isFavorite: false
};

export function SavedUrlManager({ isSupabaseConfigured }: SavedUrlManagerProps) {
  const [items, setItems] = useState<ViewSavedUrl[]>([]);
  const [form, setForm] = useState<UrlForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [error, setError] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);

  useEffect(() => {
    if (supabase) {
      let isMounted = true;

      supabase.auth.getUser().then(({ data }) => {
        if (isMounted) {
          setUser(data.user);
        }
      });

      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => {
        isMounted = false;
        data.subscription.unsubscribe();
      };
    }

    const timeoutId = window.setTimeout(() => {
      const stored = window.localStorage.getItem(storageKey);

      if (stored) {
        try {
          setItems(JSON.parse(stored) as ViewSavedUrl[]);
        } catch {
          setItems([]);
        }
      }

      setHasLoaded(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [supabase]);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    if (!user) {
      const timeoutId = window.setTimeout(() => {
        setItems([]);
        setHasLoaded(true);
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }

    let isMounted = true;

    fetchSavedUrls(supabase, user.id)
      .then((savedUrls) => {
        if (isMounted) {
          setItems(savedUrls);
          setHasLoaded(true);
        }
      })
      .catch((loadError: Error) => {
        if (isMounted) {
          setError(loadError.message);
          setHasLoaded(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [supabase, user]);

  useEffect(() => {
    if (!supabase && hasLoaded) {
      window.localStorage.setItem(storageKey, JSON.stringify(items));
    }
  }, [hasLoaded, items, supabase]);

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return items
      .filter((item) => {
        if (!keyword) {
          return true;
        }

        return [
          item.url,
          item.title,
          item.category,
          item.memo,
          item.tags.join(" ")
        ]
          .join(" ")
          .toLowerCase()
          .includes(keyword);
      })
      .sort((first, second) => {
        if (first.isFavorite !== second.isFavorite) {
          return first.isFavorite ? -1 : 1;
        }

        return second.updatedAt.localeCompare(first.updatedAt);
      });
  }, [items, search]);

  const categoryCount = new Set(items.map((item) => item.category).filter(Boolean)).size;
  const tagCount = new Set(items.flatMap((item) => item.tags)).size;
  const favoriteCount = items.filter((item) => item.isFavorite).length;
  const isEditing = Boolean(editingId);

  function updateForm(field: keyof UrlForm, value: string | boolean) {
    setError("");
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedUrl = parseUrl(form.url);

    if (!parsedUrl) {
      setError("Enter a valid URL.");
      return;
    }

    const now = new Date().toISOString();
    const title = form.title.trim() || fallbackTitle(parsedUrl);
    const nextItem: ViewSavedUrl = {
      id: editingId ?? crypto.randomUUID(),
      url: parsedUrl,
      title,
      category: form.category.trim(),
      tags: parseTags(form.tags),
      memo: form.memo.trim(),
      isFavorite: form.isFavorite,
      captureSource: "manual_form",
      organizationState: getOrganizationState(form),
      createdAt: editingId
        ? items.find((item) => item.id === editingId)?.createdAt ?? now
        : now,
      updatedAt: now
    };

    if (supabase && user) {
      try {
        setIsSaving(true);
        await saveSavedUrl(
          supabase,
          user.id,
          {
            url: nextItem.url,
            title: nextItem.title,
            category: nextItem.category,
            tags: nextItem.tags,
            memo: nextItem.memo,
            isFavorite: nextItem.isFavorite
          },
          editingId ?? undefined
        );
        setItems(await fetchSavedUrls(supabase, user.id));
        resetForm();
      } catch (saveError) {
        setError(saveError instanceof Error ? saveError.message : "Unable to save URL.");
      } finally {
        setIsSaving(false);
      }
      return;
    }

    if (supabase && !user) {
      setError("Sign in before saving private URLs.");
      return;
    }

    setItems((current) => {
      if (!editingId) {
        return [nextItem, ...current];
      }

      return current.map((item) => (item.id === editingId ? nextItem : item));
    });

    resetForm();
  }

  function startEdit(item: ViewSavedUrl) {
    setEditingId(item.id);
    setForm({
      url: item.url,
      title: item.title,
      category: item.category,
      tags: item.tags.join(", "),
      memo: item.memo,
      isFavorite: item.isFavorite
    });
    setError("");
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  async function toggleFavorite(targetItem: ViewSavedUrl) {
    if (supabase && user) {
      try {
        await toggleSavedUrlFavorite(supabase, user.id, targetItem);
        setItems(await fetchSavedUrls(supabase, user.id));
      } catch (favoriteError) {
        setError(
          favoriteError instanceof Error
            ? favoriteError.message
            : "Unable to update favorite."
        );
      }
      return;
    }

    const now = new Date().toISOString();

    setItems((current) =>
      current.map((currentItem) =>
        currentItem.id === targetItem.id
          ? {
              ...currentItem,
              isFavorite: !currentItem.isFavorite,
              updatedAt: now
            }
          : currentItem
      )
    );
  }

  async function deleteItem(id: string) {
    if (supabase && user) {
      try {
        await deleteSavedUrl(supabase, user.id, id);
        setItems(await fetchSavedUrls(supabase, user.id));
      } catch (deleteError) {
        setError(
          deleteError instanceof Error ? deleteError.message : "Unable to delete URL."
        );
      }

      if (editingId === id) {
        resetForm();
      }
      return;
    }

    setItems((current) => current.filter((item) => item.id !== id));

    if (editingId === id) {
      resetForm();
    }
  }

  async function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      return;
    }

    const email = authEmail.trim();

    if (!email) {
      setAuthMessage("Enter an email address.");
      return;
    }

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin
      }
    });

    setAuthMessage(
      authError ? authError.message : "Check your email for a sign-in link."
    );
  }

  async function handleSignOut() {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setAuthMessage("");
    resetForm();
  }

  return (
    <main className={styles.shell}>
      <section className={styles.toolbar} aria-label="Saved URL workspace">
        <div>
          <p className={styles.eyebrow}>autp</p>
          <h1 className={styles.title}>Saved URLs</h1>
        </div>
        <div className={styles.modeBadge}>
          {supabase && user
            ? "Supabase persistence"
            : isSupabaseConfigured
              ? "Sign in required"
              : "Local demo mode"}
        </div>
      </section>

      {supabase ? (
        <section className={styles.authPanel} aria-label="Authentication">
          {user ? (
            <>
              <span>{user.email ?? "Signed in"}</span>
              <button type="button" onClick={handleSignOut}>
                Sign out
              </button>
            </>
          ) : (
            <form onSubmit={handleAuthSubmit}>
              <label className={styles.authField}>
                <span>Email</span>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(event) => setAuthEmail(event.target.value)}
                  placeholder="you@example.com"
                />
              </label>
              <button type="submit">Send link</button>
            </form>
          )}
          {authMessage ? <p>{authMessage}</p> : null}
        </section>
      ) : null}

      <section className={styles.metrics} aria-label="Saved URL summary">
        <Metric label="Saved" value={items.length} />
        <Metric label="Favorites" value={favoriteCount} />
        <Metric label="Categories" value={categoryCount} />
        <Metric label="Tags" value={tagCount} />
      </section>

      <section className={styles.workspace}>
        <form className={styles.formPanel} onSubmit={handleSubmit}>
          <div className={styles.panelHeader}>
            <h2>{isEditing ? "Edit URL" : "Add URL"}</h2>
            {isEditing ? (
              <button className={styles.subtleButton} type="button" onClick={resetForm}>
                Cancel
              </button>
            ) : null}
          </div>

          <label className={styles.field}>
            <span>URL</span>
            <input
              type="text"
              value={form.url}
              onChange={(event) => updateForm("url", event.target.value)}
              placeholder="https://example.com"
            />
          </label>

          <label className={styles.field}>
            <span>Title</span>
            <input
              type="text"
              value={form.title}
              onChange={(event) => updateForm("title", event.target.value)}
              placeholder="Readable title"
            />
          </label>

          <div className={styles.fieldGrid}>
            <label className={styles.field}>
              <span>Category</span>
              <input
                type="text"
                value={form.category}
                onChange={(event) => updateForm("category", event.target.value)}
                placeholder="Research"
              />
            </label>

            <label className={styles.field}>
              <span>Tags</span>
              <input
                type="text"
                value={form.tags}
                onChange={(event) => updateForm("tags", event.target.value)}
                placeholder="docs, product"
              />
            </label>
          </div>

          <label className={styles.field}>
            <span>Memo</span>
            <textarea
              value={form.memo}
              onChange={(event) => updateForm("memo", event.target.value)}
              placeholder="Private note"
              rows={5}
            />
          </label>

          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={form.isFavorite}
              onChange={(event) => updateForm("isFavorite", event.target.checked)}
            />
            <span>Favorite</span>
          </label>

          {error ? <p className={styles.error}>{error}</p> : null}

          <button className={styles.primaryButton} type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : isEditing ? "Save changes" : "Save URL"}
          </button>
        </form>

        <section className={styles.resultsPanel}>
          <div className={styles.resultsControls}>
            <label className={styles.searchField}>
              <span>Search</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="URL, title, category, tag, memo"
              />
            </label>

            <div className={styles.segmented} aria-label="Display mode">
              <button
                aria-pressed={viewMode === "cards"}
                className={viewMode === "cards" ? styles.segmentActive : ""}
                type="button"
                onClick={() => setViewMode("cards")}
              >
                Cards
              </button>
              <button
                aria-pressed={viewMode === "list"}
                className={viewMode === "list" ? styles.segmentActive : ""}
                type="button"
                onClick={() => setViewMode("list")}
              >
                List
              </button>
            </div>
          </div>

          <div className={styles.resultMeta}>
            <span>{filteredItems.length} shown</span>
            {search.trim() ? <button type="button" onClick={() => setSearch("")}>Clear</button> : null}
          </div>

          {filteredItems.length ? (
            <div className={viewMode === "cards" ? styles.cardGrid : styles.listStack}>
              {filteredItems.map((item) => (
                <SavedUrlItem
                  key={item.id}
                  item={item}
                  mode={viewMode}
                  onDelete={deleteItem}
                  onEdit={startEdit}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <h2>No saved URLs found</h2>
              <p>
                Save a URL or adjust the search to see matching private records here.
              </p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className={styles.metric}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SavedUrlItem({
  item,
  mode,
  onDelete,
  onEdit,
  onToggleFavorite
}: {
  item: ViewSavedUrl;
  mode: ViewMode;
  onDelete: (id: string) => void;
  onEdit: (item: ViewSavedUrl) => void;
  onToggleFavorite: (item: ViewSavedUrl) => void;
}) {
  return (
    <article className={mode === "cards" ? styles.card : styles.listRow}>
      <div className={styles.itemMain}>
        <div className={styles.itemHeader}>
          <button
            aria-label={item.isFavorite ? "Remove favorite" : "Mark favorite"}
            className={item.isFavorite ? styles.favoriteActive : styles.favoriteButton}
            type="button"
            onClick={() => onToggleFavorite(item)}
          >
            Fav
          </button>
          <div>
            <h2>{item.title}</h2>
            <a href={item.url} rel="noreferrer" target="_blank">
              {item.url}
            </a>
          </div>
        </div>

        <div className={styles.metaLine}>
          {item.category ? <span>{item.category}</span> : null}
          <span>Updated {formatDate(item.updatedAt)}</span>
        </div>

        {item.memo ? <p className={styles.memo}>{item.memo}</p> : null}

        {item.tags.length ? (
          <div className={styles.tags}>
            {item.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        ) : null}
      </div>

      <div className={styles.itemActions}>
        <button type="button" onClick={() => onEdit(item)}>
          Edit
        </button>
        <button type="button" onClick={() => onDelete(item.id)}>
          Delete
        </button>
      </div>
    </article>
  );
}

function parseUrl(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const withProtocol = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);
    return parsed.toString();
  } catch {
    return null;
  }
}

function fallbackTitle(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function parseTags(value: string) {
  const seen = new Set<string>();

  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => {
      if (!tag) {
        return false;
      }

      const normalized = tag.toLowerCase();

      if (seen.has(normalized)) {
        return false;
      }

      seen.add(normalized);
      return true;
    });
}

function getOrganizationState(form: UrlForm): "needs_review" | "organized" {
  return form.category.trim() || form.tags.trim() || form.memo.trim()
    ? "organized"
    : "needs_review";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}
