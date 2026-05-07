"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";

import {
  AccountPanel,
  AnalysisPanel,
  PreviewPanel,
  ProfilePanel,
  Stat
} from "@/components/fit-studio-sections";
import { AvatarStage } from "@/components/avatar-stage";
import { categoryForGarmentType } from "@/lib/analysis/garment-classifier";
import { describeFit } from "@/lib/fit";
import { readMeasurementField, visibleFields, writeMeasurementField } from "@/lib/measurement-fields";
import { createBrowserSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { loadBodyProfile, loadHistory, saveBodyProfile, saveHistoryItem } from "@/lib/supabase/profile-store";
import {
  BODY_PROFILE_DEFAULTS,
  type BodyProfile,
  type GarmentType,
  type MeasurementField,
  type MeasurementHistoryItem,
  type ProductAnalysisResult,
  type ProductMeasurement
} from "@/lib/types";
import { clamp, uid } from "@/lib/utils";

import styles from "./fit-studio.module.css";

const localProfileKey = "autp-body-profile";
const localHistoryKey = "autp-history";

const demoMeasurement: ProductMeasurement = {
  category: "tops",
  garmentType: "shirt",
  sizeLabel: "M demo",
  waist: null,
  inseam: null,
  rise: null,
  thighWidth: null,
  hemWidth: null,
  bodyWidth: 56,
  shoulderWidth: 48,
  bodyLength: 70,
  sleeveLength: 61,
  materialPreset: "standard",
  sourceUrl: "demo:layered-human-model",
  sourceSnippet: {},
  confidence: {},
  missingFields: []
};

export function FitStudio() {
  const [profile, setProfile] = useState<BodyProfile>(BODY_PROFILE_DEFAULTS);
  const [productUrl, setProductUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ProductAnalysisResult | null>(null);
  const [selectedSizeLabel, setSelectedSizeLabel] = useState("");
  const [sizeText, setSizeText] = useState("");
  const [manualOverrides, setManualOverrides] = useState<Partial<Record<MeasurementField, string>>>({});
  const [error, setError] = useState("");
  const [history, setHistory] = useState<MeasurementHistoryItem[]>([]);
  const [localStorageReady, setLocalStorageReady] = useState(false);
  const [supabase] = useState<SupabaseClient | null>(() =>
    typeof window === "undefined" ? null : createBrowserSupabaseClient()
  );
  const [session, setSession] = useState<Session | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authMessage, setAuthMessage] = useState("");

  useEffect(() => {
    const storedProfile = readLocalProfile();
    const storedHistory = readLocalHistory();

    startTransition(() => {
      setProfile(storedProfile);
      setHistory(storedHistory);
      setLocalStorageReady(true);
    });
  }, []);

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
    if (!localStorageReady) {
      return;
    }

    globalThis.localStorage?.setItem(localProfileKey, JSON.stringify(profile));
  }, [localStorageReady, profile]);

  useEffect(() => {
    if (!localStorageReady) {
      return;
    }

    globalThis.localStorage?.setItem(localHistoryKey, JSON.stringify(history));
  }, [history, localStorageReady]);

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

  const fitResult = useMemo(
    () => (selectedMeasurement ? describeFit(profile, selectedMeasurement) : null),
    [profile, selectedMeasurement]
  );
  const demoFitResult = useMemo(() => describeFit(profile, demoMeasurement), [profile]);

  const completionRatio = useMemo(() => {
    if (!selectedMeasurement) {
      return 0;
    }

    const expected = visibleFields(selectedMeasurement.category);
    const done = expected.filter((field) => readMeasurementField(selectedMeasurement, field) != null).length;
    return Math.round((done / expected.length) * 100);
  }, [selectedMeasurement]);

  async function handleAnalyze() {
    if (!productUrl.trim() && !sizeText.trim()) {
      setError("商品URL、またはサイズ表テキストを入力してください。");
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
        body: JSON.stringify({ url: productUrl.trim(), sizeText: sizeText.trim() })
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
          garmentType: payload.result.garmentType,
          sizeLabel: selected.sizeLabel,
          savedAt: new Date().toISOString(),
          measurement: selected
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
      setAuthMessage("Supabaseが未設定のため、ログインは利用できません。");
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

    setAuthMessage("Magic linkを送信しました。メールからログインしてください。");
  }

  async function handleProfileSave() {
    if (!supabase || !session?.user.id) {
      setAuthMessage("未ログインのため、現在はローカル保存のみです。");
      return;
    }

    await saveBodyProfile(supabase, session.user.id, profile);
    setAuthMessage("プロフィールをクラウドに保存しました。");
  }

  function handleRestoreHistoryEntry(entry: MeasurementHistoryItem) {
    if (!entry.measurement) {
      setError("この履歴には再表示できる採寸データがありません。");
      return;
    }

    setError("");
    setAuthMessage("");
    setProductUrl(entry.sourceUrl);
    setAnalysis({
      title: entry.title,
      brand: entry.brand,
      sourceUrl: entry.sourceUrl,
      category: entry.category,
      garmentType: entry.measurement.garmentType ?? "unknown",
      garmentTypeConfidence: 1,
      garmentTypeEvidence: ["history"],
      summary: "保存済みの解析履歴から再表示しています。",
      measurements: [entry.measurement],
      extractionNotes: ["history:restored"],
      extractionMode: "rule_based",
      extractionStatus: "complete",
      extractionBlockers: [],
      extractionAlternatives: [],
      confidenceSummary: confidenceSummaryFromMeasurement(entry.measurement),
      siteLimitations: ["履歴から復元した結果です。最新の商品ページとは差分がある場合があります。"]
    });
    setSelectedSizeLabel(entry.measurement.sizeLabel);
    setManualOverrides({});
  }

  function handleGarmentTypeChange(garmentType: GarmentType) {
    const category = categoryForGarmentType(garmentType);

    setAnalysis((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        category,
        garmentType,
        garmentTypeConfidence: 1,
        garmentTypeEvidence: ["manual override"],
        measurements: current.measurements.map((measurement) => {
          const next = {
            ...measurement,
            category,
            garmentType
          };

          return {
            ...next,
            missingFields: visibleFields(category).filter(
              (field) => readMeasurementField(next, field) == null
            )
          };
        })
      };
    });
    setManualOverrides({});
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>AUTP / 3D Size Preview</p>
          <h1>服のサイズ感を、買う前に立体で確認。</h1>
          <p className={styles.heroText}>
            商品URLやサイズ表テキストから採寸情報を読み取り、あなたの体型に重ねてフィット感を確認できます。
            白基調の画面と操作可能な3Dマネキンで、身幅、丈、袖、パンツの余り具合を落ち着いて見比べられます。
          </p>
          <div className={styles.heroStats}>
            <Stat label="対象" value="トップス / パンツ" />
            <Stat label="取得方式" value="ルールベース" />
            <Stat label="3D操作" value="回転 / ズーム / ポーズ" />
          </div>
        </div>
        <div className={styles.heroPane}>
          {selectedMeasurement && fitResult ? (
            <PreviewHero measurement={selectedMeasurement} profile={profile} fitResult={fitResult} />
          ) : (
            <PreviewHero measurement={demoMeasurement} profile={profile} fitResult={demoFitResult} />
          )}
        </div>
      </section>

      <section className={styles.grid}>
        <ProfilePanel
          profile={profile}
          session={session}
          onProfileChange={setProfile}
          onSave={handleProfileSave}
        />
        <AnalysisPanel
          analysis={analysis}
          analyzing={analyzing}
          completionRatio={completionRatio}
          error={error}
          manualOverrides={manualOverrides}
          productUrl={productUrl}
          selectedMeasurement={selectedMeasurement}
          selectedSizeLabel={selectedSizeLabel}
          sizeText={sizeText}
          onAnalyze={handleAnalyze}
          onGarmentTypeChange={handleGarmentTypeChange}
          onManualOverrideChange={setManualOverrides}
          onProductUrlChange={setProductUrl}
          onSelectedSizeLabelChange={setSelectedSizeLabel}
          onSizeTextChange={setSizeText}
        />
        <PreviewPanel fitResult={fitResult} measurement={selectedMeasurement} profile={profile} />
        <AccountPanel
          authEmail={authEmail}
          authMessage={authMessage}
          history={history}
          isSupabaseConfigured={isSupabaseConfigured}
          onAuthEmailChange={setAuthEmail}
          onHistoryRestore={handleRestoreHistoryEntry}
          onSignIn={handleMagicLinkSignIn}
        />
      </section>
    </main>
  );
}

function PreviewHero({
  fitResult,
  measurement,
  profile
}: {
  fitResult: NonNullable<ReturnType<typeof describeFit>>;
  measurement: ProductMeasurement;
  profile: BodyProfile;
}) {
  return (
    <AvatarStage
      profile={profile}
      measurement={measurement}
      visualization={fitResult.visualization}
      scores={fitResult.scores}
    />
  );
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

    writeMeasurementField(next, field, clamp(parsed, 0, 300));
  }

  next.missingFields = visibleFields(next.category).filter(
    (field) => readMeasurementField(next, field) == null
  );

  return next;
}

function confidenceSummaryFromMeasurement(measurement: ProductMeasurement): ProductAnalysisResult["confidenceSummary"] {
  const expectedFields = visibleFields(measurement.category);
  const filledFields = expectedFields.filter((field) => readMeasurementField(measurement, field) != null);
  const missingFields = expectedFields.filter((field) => !filledFields.includes(field));
  const completionRatio = Math.round((filledFields.length / expectedFields.length) * 100);

  return {
    expectedFields,
    filledFields,
    missingFields,
    completionRatio,
    quality: completionRatio === 100 ? "high" : completionRatio > 0 ? "medium" : "low",
    message: "保存済みの採寸データを復元しています。"
  };
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
