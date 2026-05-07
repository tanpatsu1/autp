export type GarmentCategory = "tops" | "pants";

export type GarmentType =
  | "t_shirt"
  | "shirt"
  | "sweatshirt"
  | "knit"
  | "outerwear"
  | "pants"
  | "shorts"
  | "skirt"
  | "dress"
  | "unknown";

export type MaterialPreset = "structured" | "standard" | "draped" | "heavy";

export type FitPreference = "regular" | "relaxed" | "slim";

export type BodyProfile = {
  height: number;
  weight: number;
  shoulder: number;
  chest: number;
  waist: number;
  hip: number;
  inseam: number;
  armLengthBias: number;
  thighBias: number;
  fitPreference: FitPreference;
};

export type MeasurementField =
  | "waist"
  | "inseam"
  | "rise"
  | "thigh_width"
  | "hem_width"
  | "body_width"
  | "shoulder_width"
  | "body_length"
  | "sleeve_length";

export type ProductMeasurement = {
  category: GarmentCategory;
  garmentType: GarmentType;
  sizeLabel: string;
  waist: number | null;
  inseam: number | null;
  rise: number | null;
  thighWidth: number | null;
  hemWidth: number | null;
  bodyWidth: number | null;
  shoulderWidth: number | null;
  bodyLength: number | null;
  sleeveLength: number | null;
  materialPreset: MaterialPreset;
  sourceUrl: string;
  sourceSnippet: Partial<Record<MeasurementField, string>>;
  confidence: Partial<Record<MeasurementField, number>>;
  missingFields: MeasurementField[];
};

export type ExtractionConfidenceSummary = {
  expectedFields: MeasurementField[];
  filledFields: MeasurementField[];
  missingFields: MeasurementField[];
  completionRatio: number;
  quality: "high" | "medium" | "low";
  message: string;
};

export type ProductAnalysisResult = {
  title: string;
  brand: string;
  sourceUrl: string;
  category: GarmentCategory;
  garmentType: GarmentType;
  garmentTypeConfidence: number;
  garmentTypeEvidence: string[];
  summary: string;
  measurements: ProductMeasurement[];
  extractionNotes: string[];
  extractionMode: "rule_based";
  extractionStatus: "complete" | "partial" | "failed";
  extractionBlockers: string[];
  extractionAlternatives: string[];
  confidenceSummary: ExtractionConfidenceSummary;
  siteLimitations: string[];
};

export type MeasurementHistoryItem = {
  id: string;
  title: string;
  brand: string;
  sourceUrl: string;
  category: GarmentCategory;
  garmentType: GarmentType;
  sizeLabel: string;
  savedAt: string;
  measurement?: ProductMeasurement;
};

export const BODY_PROFILE_DEFAULTS: BodyProfile = {
  height: 168,
  weight: 60,
  shoulder: 44,
  chest: 92,
  waist: 78,
  hip: 93,
  inseam: 74,
  armLengthBias: 0,
  thighBias: 0,
  fitPreference: "regular"
};

export const TOPS_FIELDS: MeasurementField[] = [
  "body_length",
  "body_width",
  "shoulder_width",
  "sleeve_length"
];

export const PANTS_FIELDS: MeasurementField[] = [
  "waist",
  "rise",
  "inseam",
  "thigh_width",
  "hem_width"
];
