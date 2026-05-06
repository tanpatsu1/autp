"use client";

import type { BodyProfile, ProductMeasurement } from "@/lib/types";
import type { FitScore, FitVisualization } from "@/lib/fit";

import styles from "./fit-studio.module.css";

type AvatarStageProps = {
  profile: BodyProfile;
  measurement: ProductMeasurement;
  visualization: FitVisualization;
  scores: FitScore[];
};

export function AvatarStage({ profile, measurement, visualization, scores }: AvatarStageProps) {
  const isTop = measurement.category === "tops";

  return (
    <div className={styles.stageShell}>
      <div className={styles.stageBackdrop} />
      <div className={styles.stageInfo}>
        <span>{isTop ? "TOPS FIT VIEW" : "PANTS FIT VIEW"}</span>
        <span>{measurement.materialPreset}</span>
      </div>
      <svg
        viewBox="0 0 260 420"
        className={styles.stageSvg}
        role="img"
        aria-label="3D fit silhouette"
      >
        <defs>
          <linearGradient id="bodyGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(204,221,255,0.86)" />
            <stop offset="100%" stopColor="rgba(83,150,255,0.42)" />
          </linearGradient>
          <linearGradient id="garmentGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7af0ff" />
            <stop offset="100%" stopColor="#4477ff" />
          </linearGradient>
        </defs>
        <g opacity="0.86">
          <circle cx="130" cy="58" r="28" fill="url(#bodyGlow)" />
          <rect x="100" y="88" width="60" height="124" rx="28" fill="url(#bodyGlow)" />
          <rect x="64" y="96" width="36" height="116" rx="16" fill="url(#bodyGlow)" />
          <rect x="160" y="96" width="36" height="116" rx="16" fill="url(#bodyGlow)" />
          <rect x="104" y="206" width="22" height="168" rx="12" fill="url(#bodyGlow)" />
          <rect x="134" y="206" width="22" height="168" rx="12" fill="url(#bodyGlow)" />
        </g>
        {isTop ? (
          <g transform={`translate(${130 - 62 * visualization.torsoWidth}, 94)`}>
            <path
              d={topPath(visualization)}
              fill="url(#garmentGlow)"
              opacity="0.82"
              stroke="rgba(255,255,255,0.32)"
              strokeWidth="1.4"
            />
          </g>
        ) : (
          <g transform={`translate(${130 - 42 * visualization.waistWidth}, 184)`}>
            <path
              d={pantsPath(visualization)}
              fill="url(#garmentGlow)"
              opacity="0.82"
              stroke="rgba(255,255,255,0.32)"
              strokeWidth="1.4"
            />
          </g>
        )}
      </svg>
      <div className={styles.scoreRail}>
        {scores.map((score) => (
          <div
            key={score.label}
            className={score.tone === "good" ? styles.scoreGood : styles.scoreWarn}
          >
            <span>{score.label}</span>
            <strong>{score.detail}</strong>
          </div>
        ))}
      </div>
      <div className={styles.stageMeta}>
        <span>{profile.height}cm avatar</span>
        <span>{measurement.sizeLabel}</span>
      </div>
    </div>
  );
}

function topPath(visualization: FitVisualization) {
  const width = 124 * visualization.torsoWidth;
  const length = 152 * visualization.torsoLength;
  const sleeve = 82 * visualization.sleeveLength;
  const drape = 18 + visualization.drape * 34;

  return [
    `M ${width * 0.3} 0`,
    `L ${width * 0.7} 0`,
    `C ${width * 0.92} 6, ${width + 18} 18, ${width + 22} 28`,
    `L ${width + sleeve} ${34 + drape}`,
    `L ${width + sleeve - 14} ${58 + drape}`,
    `L ${width + 12} 46`,
    `L ${width - 6} ${length - drape}`,
    `Q ${width * 0.5} ${length + drape}, 6 ${length - drape}`,
    `L -12 46`,
    `L ${14 - sleeve} ${58 + drape}`,
    `L ${0 - sleeve} ${34 + drape}`,
    `C 6 18, ${width * 0.08} 6, ${width * 0.3} 0`,
    "Z"
  ].join(" ");
}

function pantsPath(visualization: FitVisualization) {
  const waist = 88 * visualization.waistWidth;
  const legLength = 174 * visualization.legLength;
  const hem = 34 * visualization.legOpening;
  const drape = 12 + visualization.drape * 24;

  return [
    `M 0 0`,
    `L ${waist} 0`,
    `L ${waist - 8} 44`,
    `L ${waist * 0.66} ${legLength}`,
    `L ${waist * 0.66 - hem} ${legLength}`,
    `L ${waist * 0.5} ${74 + drape}`,
    `L ${waist * 0.34} ${legLength}`,
    `L ${waist * 0.34 - hem} ${legLength}`,
    `L 8 44`,
    "Z"
  ].join(" ");
}
