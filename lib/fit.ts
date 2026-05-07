import { clamp } from "@/lib/utils";
import type { BodyProfile, FitPreference, MaterialPreset, ProductMeasurement } from "@/lib/types";

export type FitScore = {
  label: string;
  tone: "good" | "warn";
  detail: string;
};

export type FitVisualization = {
  torsoWidth: number;
  torsoLength: number;
  sleeveLength: number;
  waistWidth: number;
  legLength: number;
  legOpening: number;
  drape: number;
};

const preferenceAllowance: Record<FitPreference, number> = {
  slim: -2,
  regular: 0,
  relaxed: 4
};

const materialDrape: Record<MaterialPreset, number> = {
  structured: 0.18,
  standard: 0.28,
  draped: 0.42,
  heavy: 0.22
};

export function describeFit(
  profile: BodyProfile,
  measurement: ProductMeasurement
): { scores: FitScore[]; visualization: FitVisualization } {
  if (measurement.category === "tops") {
    return describeTopFit(profile, measurement);
  }

  return describePantFit(profile, measurement);
}

function describeTopFit(profile: BodyProfile, measurement: ProductMeasurement) {
  const typeAllowance = measurement.garmentType === "outerwear" ? 10 : measurement.garmentType === "t_shirt" ? 2 : 0;
  const sleeveBase = measurement.garmentType === "t_shirt" ? 24 : 58;
  const widthDelta =
    (measurement.bodyWidth ? measurement.bodyWidth * 2 : profile.chest) -
    (profile.chest + preferenceAllowance[profile.fitPreference] + typeAllowance);
  const lengthDelta = (measurement.bodyLength ?? profile.height * 0.38) - profile.height * 0.38;
  const sleeveDelta =
    (measurement.sleeveLength ?? profile.armLengthBias + sleeveBase) - (sleeveBase + profile.armLengthBias);

  return {
    scores: [
      scoreFromDelta(lengthDelta, "着丈", "少し短め", "少し長め", 4),
      scoreFromDelta(widthDelta, "身幅", "やや細め", "ややゆるめ", 6),
      scoreFromDelta(sleeveDelta, "袖丈", "少し短め", "少し長め", 3)
    ],
    visualization: {
      torsoWidth: clamp(0.82 + widthDelta / 40, 0.72, 1.2),
      torsoLength: clamp(0.82 + lengthDelta / 35, 0.7, 1.18),
      sleeveLength: measurement.garmentType === "t_shirt" ? 0.38 : clamp(0.85 + sleeveDelta / 25, 0.72, 1.18),
      waistWidth: 0.94,
      legLength: 0.96,
      legOpening: 0.88,
      drape: materialDrape[measurement.materialPreset]
    }
  };
}

function describePantFit(profile: BodyProfile, measurement: ProductMeasurement) {
  const waistDelta = (measurement.waist ?? profile.waist) - profile.waist;
  const expectedInseam = measurement.garmentType === "shorts" ? profile.inseam * 0.32 : profile.inseam;
  const inseamDelta = (measurement.inseam ?? expectedInseam) - expectedInseam;
  const thighDelta =
    (measurement.thighWidth ? measurement.thighWidth * 2 : profile.hip * 0.35) -
    (profile.hip * 0.35 + profile.thighBias);

  return {
    scores: [
      scoreFromDelta(waistDelta, "ウエスト", "やや細め", "やや大きめ", 4),
      scoreFromDelta(inseamDelta, "レングス", "少し短め", "少し長め", 4),
      scoreFromDelta(thighDelta, "わたり幅", "やや細め", "やや太め", 4)
    ],
    visualization: {
      torsoWidth: 0.8,
      torsoLength: 0.9,
      sleeveLength: 0.84,
      waistWidth: clamp(0.82 + waistDelta / 35, 0.7, 1.16),
      legLength: measurement.garmentType === "shorts" ? 0.42 : clamp(0.84 + inseamDelta / 35, 0.72, 1.18),
      legOpening: clamp(0.8 + ((measurement.hemWidth ?? 20) - 20) / 30, 0.72, 1.12),
      drape: materialDrape[measurement.materialPreset]
    }
  };
}

function scoreFromDelta(
  delta: number,
  label: string,
  minusText: string,
  plusText: string,
  threshold: number
): FitScore {
  if (Math.abs(delta) <= threshold) {
    return {
      label,
      tone: "good",
      detail: "ちょうどよい"
    };
  }

  return {
    label,
    tone: "warn",
    detail: delta < 0 ? minusText : plusText
  };
}
