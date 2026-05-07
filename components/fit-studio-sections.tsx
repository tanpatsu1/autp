"use client";

import type { Dispatch, SetStateAction } from "react";
import type { Session } from "@supabase/supabase-js";

import { AvatarStage } from "@/components/avatar-stage";
import { garmentTypeLabel } from "@/lib/analysis/garment-classifier";
import type { FitScore, FitVisualization } from "@/lib/fit";
import { fieldLabel, readMeasurementField, visibleFields } from "@/lib/measurement-fields";
import type {
  BodyProfile,
  GarmentType,
  MeasurementField,
  MeasurementHistoryItem,
  ProductAnalysisResult,
  ProductMeasurement
} from "@/lib/types";
import { cn, formatDateTime, toNumber } from "@/lib/utils";

import styles from "./fit-studio.module.css";

type ProfilePanelProps = {
  profile: BodyProfile;
  session: Session | null;
  onProfileChange: Dispatch<SetStateAction<BodyProfile>>;
  onSave: () => void | Promise<void>;
};

type AnalysisPanelProps = {
  analysis: ProductAnalysisResult | null;
  analyzing: boolean;
  completionRatio: number;
  error: string;
  manualOverrides: Partial<Record<MeasurementField, string>>;
  productUrl: string;
  selectedMeasurement: ProductMeasurement | null;
  selectedSizeLabel: string;
  sizeText: string;
  onAnalyze: () => void | Promise<void>;
  onGarmentTypeChange: (garmentType: GarmentType) => void;
  onManualOverrideChange: Dispatch<SetStateAction<Partial<Record<MeasurementField, string>>>>;
  onProductUrlChange: Dispatch<SetStateAction<string>>;
  onSelectedSizeLabelChange: Dispatch<SetStateAction<string>>;
  onSizeTextChange: Dispatch<SetStateAction<string>>;
};

type PreviewPanelProps = {
  fitResult: { scores: FitScore[]; visualization: FitVisualization } | null;
  measurement: ProductMeasurement | null;
  profile: BodyProfile;
};

type AccountPanelProps = {
  authEmail: string;
  authMessage: string;
  history: MeasurementHistoryItem[];
  isSupabaseConfigured: boolean;
  onAuthEmailChange: Dispatch<SetStateAction<string>>;
  onHistoryRestore: (entry: MeasurementHistoryItem) => void;
  onSignIn: () => void | Promise<void>;
};

const GARMENT_TYPE_OPTIONS: GarmentType[] = [
  "t_shirt",
  "shirt",
  "sweatshirt",
  "knit",
  "outerwear",
  "pants",
  "shorts",
  "skirt",
  "dress",
  "unknown"
];

export function ProfilePanel({ profile, session, onProfileChange, onSave }: ProfilePanelProps) {
  return (
    <article className={styles.panel}>
      <div className={styles.panelHeader}>
        <span>01</span>
        <div>
          <h2>体型プロフィール</h2>
          <p>身長、肩幅、胸囲などを登録して、3Dマネキンとサイズ判定の基準にします。</p>
        </div>
      </div>
      <div className={styles.formGrid}>
        <NumberField label="身長" value={profile.height} onChange={(value) => patchProfile(onProfileChange, "height", value)} />
        <NumberField label="体重" value={profile.weight} onChange={(value) => patchProfile(onProfileChange, "weight", value)} />
        <NumberField label="肩幅" value={profile.shoulder} onChange={(value) => patchProfile(onProfileChange, "shoulder", value)} />
        <NumberField label="胸囲" value={profile.chest} onChange={(value) => patchProfile(onProfileChange, "chest", value)} />
        <NumberField label="ウエスト" value={profile.waist} onChange={(value) => patchProfile(onProfileChange, "waist", value)} />
        <NumberField label="ヒップ" value={profile.hip} onChange={(value) => patchProfile(onProfileChange, "hip", value)} />
        <NumberField label="股下" value={profile.inseam} onChange={(value) => patchProfile(onProfileChange, "inseam", value)} />
        <NumberField
          label="腕丈補正"
          value={profile.armLengthBias}
          onChange={(value) => patchProfile(onProfileChange, "armLengthBias", value)}
        />
        <NumberField
          label="太もも補正"
          value={profile.thighBias}
          onChange={(value) => patchProfile(onProfileChange, "thighBias", value)}
        />
        <label className={styles.field}>
          <span>好みのフィット</span>
          <select
            value={profile.fitPreference}
            onChange={(event) =>
              onProfileChange((current) => ({
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
        <button className={styles.primaryButton} type="button" onClick={onSave}>
          プロフィールを保存
        </button>
        <span className={styles.inlineNote}>
          {session?.user.email ? `ログイン中: ${session.user.email}。保存ボタンでクラウドに反映します。` : "未ログイン時はこの端末に自動保存します。"}
        </span>
      </div>
    </article>
  );
}

export function AnalysisPanel({
  analysis,
  analyzing,
  completionRatio,
  error,
  manualOverrides,
  productUrl,
  selectedMeasurement,
  selectedSizeLabel,
  sizeText,
  onAnalyze,
  onGarmentTypeChange,
  onManualOverrideChange,
  onProductUrlChange,
  onSelectedSizeLabelChange,
  onSizeTextChange
}: AnalysisPanelProps) {
  return (
    <article className={styles.panel}>
      <div className={styles.panelHeader}>
        <span>02</span>
        <div>
          <h2>商品解析</h2>
          <p>URL取得はサイト仕様に左右されます。商品ページに表示されたサイズ表を貼り付けると、より確実に補完できます。</p>
        </div>
      </div>
      <label className={styles.field}>
        <span>商品URL</span>
        <input
          type="url"
          placeholder="https://example.com/product"
          value={productUrl}
          onChange={(event) => onProductUrlChange(event.target.value)}
        />
      </label>
      <label className={styles.field}>
        <span>サイズ表テキスト</span>
        <textarea
          className={styles.sizeTextArea}
          placeholder="商品ページの「アイテムサイズ」「サイズ詳細」など、表示済みのサイズ表だけを貼り付けてください。"
          value={sizeText}
          onChange={(event) => onSizeTextChange(event.target.value)}
        />
      </label>
      <div className={styles.actionRow}>
        <button className={styles.primaryButton} type="button" disabled={analyzing} onClick={onAnalyze}>
          {analyzing ? "解析中..." : "サイズを取得する"}
        </button>
        <span className={styles.inlineNote}>URLと貼り付けテキストを併用し、貼り付け内容で不足項目を補います。</span>
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
              <span>{garmentTypeLabel(analysis.garmentType)}</span>
              <span>{statusLabel(analysis.extractionStatus)}</span>
            </div>
          </div>
          <p className={styles.summaryText}>{analysis.summary}</p>
          <div className={styles.insightGrid}>
            <div className={styles.confidenceCard}>
              <span>取得信頼度</span>
              <strong>
                {confidenceLabel(analysis.confidenceSummary.quality)} / {analysis.confidenceSummary.completionRatio}%
              </strong>
              <p>{analysis.confidenceSummary.message}</p>
              <small>
                未取得:{" "}
                {analysis.confidenceSummary.missingFields.length
                  ? analysis.confidenceSummary.missingFields.map(fieldLabel).join(" / ")
                  : "なし"}
              </small>
            </div>
            <div className={styles.limitationCard}>
              <span>取得制限</span>
              <ul>
                {analysis.siteLimitations.map((limitation) => (
                  <li key={limitation}>{limitation}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className={styles.classificationCard}>
            <div>
              <span>服種別</span>
              <strong>{garmentTypeLabel(analysis.garmentType)}</strong>
              <small>
                信頼度 {Math.round(analysis.garmentTypeConfidence * 100)}%
                {analysis.garmentTypeEvidence.length
                  ? ` / 根拠: ${analysis.garmentTypeEvidence.join(", ")}`
                  : " / 明確な根拠なし"}
              </small>
            </div>
            <label>
              <span>手動修正</span>
              <select
                value={analysis.garmentType}
                onChange={(event) => onGarmentTypeChange(event.target.value as GarmentType)}
              >
                {GARMENT_TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>
                    {garmentTypeLabel(type)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {analysis.extractionStatus !== "complete" ? (
            <div className={styles.fallbackCard}>
              <strong>
                {analysis.extractionStatus === "failed"
                  ? "このURLでは自動取得できませんでした"
                  : "一部の採寸だけ取得できました"}
              </strong>
              {analysis.extractionBlockers.length ? (
                <ul>
                  {analysis.extractionBlockers.map((blocker) => (
                    <li key={blocker}>{blocker}</li>
                  ))}
                </ul>
              ) : null}
              <p>代替案</p>
              <ul>
                {analysis.extractionAlternatives.map((alternative) => (
                  <li key={alternative}>{alternative}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className={styles.chipRow}>
            {analysis.measurements.map((entry) => (
              <button
                key={entry.sizeLabel}
                type="button"
                className={cn(styles.sizeChip, entry.sizeLabel === selectedSizeLabel && styles.sizeChipActive)}
                onClick={() => onSelectedSizeLabelChange(entry.sizeLabel)}
              >
                {entry.sizeLabel}
              </button>
            ))}
          </div>
          {selectedMeasurement ? (
            <>
              <div className={styles.measurementGrid}>
                {visibleFields(selectedMeasurement.category).map((field) => {
                  const currentValue = displayValue(selectedMeasurement, field);
                  const isManual = Boolean(manualOverrides[field]?.trim());
                  const hasAutoValue = currentValue !== "";

                  return (
                    <label className={styles.measurementField} key={field}>
                      <div className={styles.measurementLabelRow}>
                        <span>{fieldLabel(field)}</span>
                        <strong className={isManual ? styles.manualTag : styles.autoTag}>
                          {isManual ? "手入力" : hasAutoValue ? "自動取得" : "未取得"}
                        </strong>
                      </div>
                      <input
                        value={manualOverrides[field] ?? currentValue}
                        placeholder={hasAutoValue ? "" : "cmで入力"}
                        onChange={(event) =>
                          onManualOverrideChange((current) => ({
                            ...current,
                            [field]: event.target.value
                          }))
                        }
                      />
                      <small>
                        {selectedMeasurement.sourceSnippet[field] ??
                          "自動取得できなかった場合は、必要に応じて手入力してください。"}
                      </small>
                    </label>
                  );
                })}
              </div>
              <div className={styles.progressCard}>
                <span>取得完了率</span>
                <strong>{completionRatio}%</strong>
                <div className={styles.progressBar}>
                  <div style={{ width: `${completionRatio}%` }} />
                </div>
                <p>
                  未取得:{" "}
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
  );
}

export function PreviewPanel({ fitResult, measurement, profile }: PreviewPanelProps) {
  return (
    <article className={styles.panel}>
      <div className={styles.panelHeader}>
        <span>03</span>
        <div>
          <h2>3Dサイズ確認</h2>
          <p>トップス、パンツ、ショーツの簡易立体プレビューで、体型との余りやタイトさを確認します。</p>
        </div>
      </div>
      {measurement && fitResult ? (
        <>
          <AvatarStage
            profile={profile}
            measurement={measurement}
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
        <p className={styles.inlineNote}>商品を解析すると、3Dプレビューとサイズコメントが表示されます。</p>
      )}
    </article>
  );
}

export function AccountPanel({
  authEmail,
  authMessage,
  history,
  isSupabaseConfigured,
  onAuthEmailChange,
  onHistoryRestore,
  onSignIn
}: AccountPanelProps) {
  return (
    <article className={styles.panel}>
      <div className={styles.panelHeader}>
        <span>04</span>
        <div>
          <h2>ログインと履歴</h2>
          <p>ログインは任意です。ゲストはこの端末、ログイン後はSupabaseにもプロフィールと履歴を保存します。</p>
        </div>
      </div>
      <div className={styles.authCard}>
        <span className={styles.inlineNote}>
          {isSupabaseConfigured
            ? "Supabase設定済みです。ログインするとクラウド保存に切り替わります。"
            : "Supabase未設定です。プロフィールと履歴はこの端末だけに保存されます。"}
        </span>
        <div className={styles.authRow}>
          <input
            type="email"
            placeholder="you@example.com"
            value={authEmail}
            onChange={(event) => onAuthEmailChange(event.target.value)}
          />
          <button
            className={styles.secondaryButton}
            type="button"
            disabled={!isSupabaseConfigured}
            onClick={onSignIn}
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
                <p>{entry.brand || "ブランド未取得"}</p>
              </div>
              <div className={styles.historyMeta}>
                <span>{entry.category}</span>
                <span>{entry.sizeLabel}</span>
              </div>
              <div className={styles.historyActionRow}>
                <span className={styles.historyTimestamp}>{formatDateTime(entry.savedAt)}</span>
                <button
                  className={styles.historyButton}
                  type="button"
                  disabled={!entry.measurement}
                  onClick={() => onHistoryRestore(entry)}
                >
                  このサイズを開く
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.inlineNote}>まだ履歴はありません。解析できた商品は最大6件までここに残ります。</p>
        )}
      </div>
    </article>
  );
}

export function Stat({ label, value }: { label: string; value: string }) {
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
  const range = rangeForValue(value);

  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input type="number" value={value} onChange={(event) => onChange(toNumber(event.target.value))} />
      <input
        className={styles.rangeInput}
        type="range"
        min={range.min}
        max={range.max}
        step={range.step}
        value={value}
        onChange={(event) => onChange(toNumber(event.target.value))}
      />
    </label>
  );
}

function rangeForValue(value: number) {
  if (value > 130) {
    return { min: 140, max: 200, step: 1 };
  }

  if (value < 25) {
    return { min: -20, max: 20, step: 1 };
  }

  if (value <= 55) {
    return { min: 32, max: 60, step: 1 };
  }

  return { min: 45, max: 125, step: 1 };
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

function displayValue(measurement: ProductMeasurement, field: MeasurementField) {
  const value = readMeasurementField(measurement, field);
  return value == null ? "" : String(value);
}

function statusLabel(status: ProductAnalysisResult["extractionStatus"]) {
  switch (status) {
    case "complete":
      return "自動取得OK";
    case "partial":
      return "一部取得";
    case "failed":
      return "取得失敗";
  }
}

function confidenceLabel(quality: ProductAnalysisResult["confidenceSummary"]["quality"]) {
  switch (quality) {
    case "high":
      return "高";
    case "medium":
      return "中";
    case "low":
      return "低";
  }
}
