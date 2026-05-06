"use client";

import { startTransition, useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";

import { AvatarStage } from "@/components/avatar-stage";
import { describeFit } from "@/lib/fit";
import { createBrowserSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { loadBodyProfile, loadHistory, saveBodyProfile, saveHistoryItem } from "@/lib/supabase/profile-store";
import {
  BODY_PROFILE_DEFAULTS,
  PANTS_FIELDS,
  TOPS_FIELDS,
  type BodyProfile,
  type GarmentCategory,
  type MeasurementField,
  type MeasurementHistoryItem,
  type ProductAnalysisResult,
  type ProductMeasurement
} from "@/lib/types";
import { clamp, cn, toNumber, uid } from "@/lib/utils";

import styles from "./fit-studio.module.css";

const localProfileKey = "autp-body-profile";
const localHistoryKey = "autp-history";

export function FitStudio() {
  const [profile, setProfile] = useState<BodyProfile>(() => readLocalProfile());
  const [productUrl, setProductUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ProductAnalysisResult | null>(null);
  const [selectedSizeLabel, setSelectedSizeLabel] = useState("");
  const [manualOverrides, setManualOverrides] = useState<Partial<Record<MeasurementField, string>>>({});
  const [error, setError] = useState("");
  const [history, setHistory] = useState<MeasurementHistoryItem[]>(() => readLocalHistory());
  const [supabase] = useState<SupabaseClient | null>(() =>
    typeof window === "undefined" ? null : createBrowserSupabaseClient()
  );
  const [session, setSession] = useState<Session | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authMessage, setAuthMessage] = useState("");

  useEffect(() => {
    if (!supabase) {
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      startTransition(() => {
        setSession(nextSession);
      });
    });

    return () => data.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    globalThis.localStorage?.setItem(localProfileKey, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    globalThis.localStorage?.setItem(localHistoryKey, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (!supabase || !session?.user.id) {
      return;
    }

    loadBodyProfile(supabase, session.user.id)
      .then((cloudProfile) => {
        if (cloudProfile) {
          setProfile(cloudProfile);
        }
      })
      .catch(() => undefined);

    loadHistory(supabase, session.user.id)
      .then((entries) => {
        if (entries.length) {
          setHistory(entries);
        }
      })
      .catch(() => undefined);
  }, [session?.user.id, supabase]);

  const selectedMeasurement = useMemo(() => {
    if (!analysis) {
      return null;
    }

    const base =
      analysis.measurements.find((item) => item.sizeLabel === selectedSizeLabel) ??
      analysis.measurements[0] ??
      null;

    if (!base) {
      return null;
    }

    return applyOverrides(base, manualOverrides);
  }, [analysis, manualOverrides, selectedSizeLabel]);

  const fitResult = useMemo(() => {
    return selectedMeasurement ? describeFit(profile, selectedMeasurement) : null;
  }, [profile, selectedMeasurement]);

  const completionRatio = useMemo(() => {
    if (!selectedMeasurement) {
      return 0;
    }

    const expected = selectedMeasurement.category === "pants" ? PANTS_FIELDS : TOPS_FIELDS;
    const done = expected.filter((field) => readField(selectedMeasurement, field) != null).length;
    return Math.round((done / expected.length) * 100);
  }, [selectedMeasurement]);

  async function handleAnalyze() {
    if (!productUrl.trim()) {
      setError("商品URLを入力してください。");
      return;
    }

    setAnalyzing(true);
    setError("");
    setAuthMessage("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url: productUrl.trim() })
      });

      const payload = (await response.json()) as { result?: ProductAnalysisResult; error?: string };

      if (!response.ok || !payload.result) {
        throw new Error(payload.error || "解析に失敗しました。");
      }

      setAnalysis(payload.result);
      setSelectedSizeLabel(payload.result.measurements[0]?.sizeLabel ?? "");
      setManualOverrides({});

      const selected = payload.result.measurements[0];
      if (selected) {
        const nextHistoryItem: MeasurementHistoryItem = {
          id: uid("local"),
          title: payload.result.title,
          brand: payload.result.brand,
          sourceUrl: payload.result.sourceUrl,
          category: payload.result.category,
          sizeLabel: selected.sizeLabel,
          savedAt: new Date().toISOString()
        };

        setHistory((current) => [nextHistoryItem, ...current].slice(0, 6));

        if (supabase && session?.user.id) {
          await saveHistoryItem(supabase, session.user.id, payload.result, selected);
        }
      }
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "解析に失敗しました。");
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleMagicLinkSignIn() {
    if (!supabase) {
      setAuthMessage("Supabase設定が未完了です。");
      return;
    }

    setAuthMessage("");

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: authEmail,
      options: {
        emailRedirectTo: globalThis.location.href
      }
    });

    if (signInError) {
      setAuthMessage(signInError.message);
      return;
    }

    setAuthMessage("Magic link を送信しました。メールからログインしてください。");
  }

  async function handleProfileSave() {
    if (!supabase || !session?.user.id) {
      setAuthMessage("未ログインのため、現在はローカル保存のみです。");
      return;
    }

    await saveBodyProfile(supabase, session.user.id, profile);
    setAuthMessage("プロフィールをクラウド保存しました。");
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>AUTP / 3D Size Preview</p>
          <h1>服のサイズ感を、買う前に立体で見る。</h1>
          <p className={styles.heroText}>
            URLから寸法を自動取得し、自分の採寸プロフィールに重ねて丈感とゆとりを可視化します。
            MVPはトップスとパンツに絞り、見た目よりサイズ判断を先に強くします。
          </p>
          <div className={styles.heroStats}>
            <Stat label="Category" value="Tops / Pants" />
            <Stat label="Extractor" value="Rule + LLM Fallback" />
            <Stat label="Preview" value="Lightweight 3D Silhouette" />
          </div>
        </div>
        <div className={styles.heroPane}>
          {selectedMeasurement && fitResult ? (
            <AvatarStage
              profile={profile}
              measurement={selectedMeasurement}
              visualization={fitResult.visualization}
              scores={fitResult.scores}
            />
          ) : (
            <div className={styles.emptyStage}>
              <span>3D FIT DEMO</span>
              <strong>商品を解析すると、ここにサイズ感が表示されます。</strong>
            </div>
          )}
        </div>
      </section>

      <section className={styles.grid}>
        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <span>01</span>
            <div>
              <h2>体型プロフィール</h2>
              <p>詳細採寸をベースに、自分に近いアバターを作ります。</p>
            </div>
          </div>
          <div className={styles.formGrid}>
            <NumberField label="身長" value={profile.height} onChange={(value) => patchProfile(setProfile, "height", value)} />
            <NumberField label="体重" value={profile.weight} onChange={(value) => patchProfile(setProfile, "weight", value)} />
            <NumberField label="肩幅" value={profile.shoulder} onChange={(value) => patchProfile(setProfile, "shoulder", value)} />
            <NumberField label="胸囲" value={profile.chest} onChange={(value) => patchProfile(setProfile, "chest", value)} />
            <NumberField label="ウエスト" value={profile.waist} onChange={(value) => patchProfile(setProfile, "waist", value)} />
            <NumberField label="ヒップ" value={profile.hip} onChange={(value) => patchProfile(setProfile, "hip", value)} />
            <NumberField label="股下" value={profile.inseam} onChange={(value) => patchProfile(setProfile, "inseam", value)} />
            <NumberField label="腕長傾向" value={profile.armLengthBias} onChange={(value) => patchProfile(setProfile, "armLengthBias", value)} />
            <NumberField label="太もも傾向" value={profile.thighBias} onChange={(value) => patchProfile(setProfile, "thighBias", value)} />
            <label className={styles.field}>
              <span>好みのフィット</span>
              <select
                value={profile.fitPreference}
                onChange={(event) =>
                  setProfile((current) => ({
                    ...current,
                    fitPreference: event.target.value as BodyProfile["fitPreference"]
                  }))
                }
              >
                <option value="slim">細め</option>
                <option value="regular">標準</option>
                <option value="relaxed">ゆるめ</option>
              </select>
            </label>
          </div>
          <div className={styles.actionRow}>
            <button className={styles.primaryButton} type="button" onClick={handleProfileSave}>
              プロフィールを保存
            </button>
            <span className={styles.inlineNote}>
              {session?.user.email ? `ログイン中: ${session.user.email}` : "未ログイン時はローカル保存"}
            </span>
          </div>
        </article>

        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <span>02</span>
            <div>
              <h2>商品解析</h2>
              <p>URLから寸法を取得し、不足項目だけ補完入力に落とします。</p>
            </div>
          </div>
          <label className={styles.field}>
            <span>商品URL</span>
            <input
              type="url"
              placeholder="https://example.com/product"
              value={productUrl}
              onChange={(event) => setProductUrl(event.target.value)}
            />
          </label>
          <div className={styles.actionRow}>
            <button className={styles.primaryButton} type="button" disabled={analyzing} onClick={handleAnalyze}>
              {analyzing ? "解析中..." : "サイズを取得する"}
            </button>
            <span className={styles.inlineNote}>
              商品名検索は将来拡張。MVPはURL優先。
            </span>
          </div>
          {error ? <p className={styles.errorText}>{error}</p> : null}
          {analysis ? (
            <div className={styles.analysisCard}>
              <div className={styles.analysisHeader}>
                <div>
                  <strong>{analysis.title}</strong>
                  <p>{analysis.brand || "ブランド未取得"}</p>
                </div>
                <div className={styles.analysisMeta}>
                  <span>{analysis.category === "tops" ? "TOPS" : "PANTS"}</span>
                  <span>{analysis.usedLlmFallback ? "LLM fallback used" : "Rule-based hit"}</span>
                </div>
              </div>
              <p className={styles.summaryText}>{analysis.summary}</p>
              <div className={styles.chipRow}>
                {analysis.measurements.map((entry) => (
                  <button
                    key={entry.sizeLabel}
                    type="button"
                    className={cn(
                      styles.sizeChip,
                      entry.sizeLabel === selectedMeasurement?.sizeLabel && styles.sizeChipActive
                    )}
                    onClick={() => setSelectedSizeLabel(entry.sizeLabel)}
                  >
                    {entry.sizeLabel}
                  </button>
                ))}
              </div>
              {selectedMeasurement ? (
                <>
                  <div className={styles.measurementGrid}>
                    {visibleFields(selectedMeasurement.category).map((field) => (
                      <label className={styles.measurementField} key={field}>
                        <span>{fieldLabel(field)}</span>
                        <input
                          value={manualOverrides[field] ?? displayValue(selectedMeasurement, field)}
                          onChange={(event) =>
                            setManualOverrides((current) => ({
                              ...current,
                              [field]: event.target.value
                            }))
                          }
                        />
                        <small>{selectedMeasurement.sourceSnippet[field] ?? "手入力可"}</small>
                      </label>
                    ))}
                  </div>
                  <div className={styles.progressCard}>
                    <span>取得完了率</span>
                    <strong>{completionRatio}%</strong>
                    <div className={styles.progressBar}>
                      <div style={{ width: `${completionRatio}%` }} />
                    </div>
                    <p>
                      不足:{" "}
                      {selectedMeasurement.missingFields.length
                        ? selectedMeasurement.missingFields.map(fieldLabel).join(" / ")
                        : "なし"}
                    </p>
                  </div>
                </>
              ) : null}
            </div>
          ) : null}
        </article>

        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <span>03</span>
            <div>
              <h2>3Dサイズ確認</h2>
              <p>主要寸法と素材カテゴリから、丈感・ゆとり・落ち感を簡易表示します。</p>
            </div>
          </div>
          {selectedMeasurement && fitResult ? (
            <>
              <AvatarStage
                profile={profile}
                measurement={selectedMeasurement}
                visualization={fitResult.visualization}
                scores={fitResult.scores}
              />
              <div className={styles.fitGrid}>
                {fitResult.scores.map((score) => (
                  <div key={score.label} className={styles.fitCard}>
                    <span>{score.label}</span>
                    <strong>{score.detail}</strong>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className={styles.inlineNote}>商品解析後に3D確認が有効になります。</p>
          )}
        </article>

        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <span>04</span>
            <div>
              <h2>ログインと履歴</h2>
              <p>ゲストでも使えます。ログインするとプロフィールと最近の商品履歴を保存します。</p>
            </div>
          </div>
          <div className={styles.authCard}>
            <span className={styles.inlineNote}>
              {isSupabaseConfigured
                ? "Supabase設定あり。Magic link ログインを使えます。"
                : "Supabase未設定。現在はローカル保存のみです。"}
            </span>
            <div className={styles.authRow}>
              <input
                type="email"
                placeholder="you@example.com"
                value={authEmail}
                onChange={(event) => setAuthEmail(event.target.value)}
              />
              <button
                className={styles.secondaryButton}
                type="button"
                disabled={!isSupabaseConfigured}
                onClick={handleMagicLinkSignIn}
              >
                Magic link
              </button>
            </div>
            {authMessage ? <p className={styles.inlineNote}>{authMessage}</p> : null}
          </div>
          <div className={styles.historyList}>
            {history.length ? (
              history.map((entry) => (
                <div key={entry.id} className={styles.historyCard}>
                  <div>
                    <strong>{entry.title}</strong>
                    <p>{entry.brand || "brand n/a"}</p>
                  </div>
                  <div className={styles.historyMeta}>
                    <span>{entry.category}</span>
                    <span>{entry.sizeLabel}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.inlineNote}>まだ履歴はありません。</p>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.statCard}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input type="number" value={value} onChange={(event) => onChange(toNumber(event.target.value))} />
    </label>
  );
}

function patchProfile(
  setProfile: Dispatch<SetStateAction<BodyProfile>>,
  field: keyof BodyProfile,
  value: number
) {
  setProfile((current) => ({
    ...current,
    [field]: value
  }));
}

function visibleFields(category: GarmentCategory) {
  return category === "pants" ? PANTS_FIELDS : TOPS_FIELDS;
}

function fieldLabel(field: MeasurementField) {
  switch (field) {
    case "body_length":
      return "着丈";
    case "body_width":
      return "身幅";
    case "shoulder_width":
      return "肩幅";
    case "sleeve_length":
      return "袖丈";
    case "waist":
      return "ウエスト";
    case "rise":
      return "股上";
    case "inseam":
      return "股下";
    case "thigh_width":
      return "わたり";
    case "hem_width":
      return "裾幅";
  }
}

function displayValue(measurement: ProductMeasurement, field: MeasurementField) {
  const value = readField(measurement, field);
  return value == null ? "" : String(value);
}

function applyOverrides(
  measurement: ProductMeasurement,
  overrides: Partial<Record<MeasurementField, string>>
): ProductMeasurement {
  const next: ProductMeasurement = structuredClone(measurement);

  for (const [field, value] of Object.entries(overrides) as Array<[MeasurementField, string]>) {
    if (!value.trim()) {
      continue;
    }

    const parsed = Number.parseFloat(value);
    if (!Number.isFinite(parsed)) {
      continue;
    }

    writeField(next, field, clamp(parsed, 0, 300));
  }

  next.missingFields = visibleFields(next.category).filter((field) => readField(next, field) == null);
  return next;
}

function readField(measurement: ProductMeasurement, field: MeasurementField) {
  switch (field) {
    case "body_length":
      return measurement.bodyLength;
    case "body_width":
      return measurement.bodyWidth;
    case "shoulder_width":
      return measurement.shoulderWidth;
    case "sleeve_length":
      return measurement.sleeveLength;
    case "waist":
      return measurement.waist;
    case "rise":
      return measurement.rise;
    case "inseam":
      return measurement.inseam;
    case "thigh_width":
      return measurement.thighWidth;
    case "hem_width":
      return measurement.hemWidth;
  }
}

function writeField(measurement: ProductMeasurement, field: MeasurementField, value: number) {
  switch (field) {
    case "body_length":
      measurement.bodyLength = value;
      break;
    case "body_width":
      measurement.bodyWidth = value;
      break;
    case "shoulder_width":
      measurement.shoulderWidth = value;
      break;
    case "sleeve_length":
      measurement.sleeveLength = value;
      break;
    case "waist":
      measurement.waist = value;
      break;
    case "rise":
      measurement.rise = value;
      break;
    case "inseam":
      measurement.inseam = value;
      break;
    case "thigh_width":
      measurement.thighWidth = value;
      break;
    case "hem_width":
      measurement.hemWidth = value;
      break;
  }
}

function readLocalProfile() {
  if (typeof window === "undefined") {
    return BODY_PROFILE_DEFAULTS;
  }

  const storedProfile = globalThis.localStorage.getItem(localProfileKey);
  return storedProfile ? (JSON.parse(storedProfile) as BodyProfile) : BODY_PROFILE_DEFAULTS;
}

function readLocalHistory() {
  if (typeof window === "undefined") {
    return [];
  }

  const storedHistory = globalThis.localStorage.getItem(localHistoryKey);
  return storedHistory ? (JSON.parse(storedHistory) as MeasurementHistoryItem[]) : [];
}
