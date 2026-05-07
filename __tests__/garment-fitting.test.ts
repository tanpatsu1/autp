import { describe, expect, it } from "vitest";

import {
  ProceduralGarmentFitter,
  fitZonesToScores,
  type BodyDimensions,
  type FitZone
} from "../lib/garment-fitting";
import type { ProductMeasurement } from "../lib/types";

const fitter = new ProceduralGarmentFitter();

const baseBody: BodyDimensions = {
  height: 168,
  chest: 92,
  waist: 78,
  hip: 93,
  inseam: 74,
  shoulderWidth: 44,
  sleeveLength: 58
};

const baseMeasurement: ProductMeasurement = {
  category: "tops",
  garmentType: "t_shirt",
  sizeLabel: "M",
  waist: null,
  inseam: null,
  rise: null,
  thighWidth: null,
  hemWidth: null,
  bodyWidth: 47,
  shoulderWidth: 45,
  bodyLength: 68,
  sleeveLength: 58,
  materialPreset: "standard",
  sourceUrl: "test",
  sourceSnippet: {},
  confidence: {},
  missingFields: []
};

describe("ProceduralGarmentFitter", () => {
  it("computeFitZones marks chest tight when body chest exceeds garment chest by 3cm", () => {
    const zones = fitter.computeFitZones({
      bodyDimensions: { ...baseBody, chest: 97 },
      measurement: { ...baseMeasurement, bodyWidth: 47 },
      showHeatmap: true
    });
    const chest = zones.find((item) => item.part === "chest");

    expect(chest?.tone).toBe("tight");
    expect(chest?.intensity).toBeGreaterThan(0.5);
    expect(chest?.deltaCm).toBeCloseTo(-3);
  });

  it("resolveGenre maps outerwear to TOPS_OUTER", () => {
    expect(fitter.resolveGenre({ garmentType: "outerwear" } as ProductMeasurement)).toBe("TOPS_OUTER");
  });

  it("resolveGenre maps skirt to UNSUPPORTED", () => {
    expect(fitter.resolveGenre({ garmentType: "skirt" } as ProductMeasurement)).toBe("UNSUPPORTED");
  });

  it("fitZonesToScores maps intensity 0 to score 100", () => {
    const scores = fitZonesToScores([{ part: "chest", deltaCm: 5, tone: "ease", intensity: 0 } as FitZone]);

    expect(scores.chest).toBe(100);
  });

  it("BOTTOMS_LOOSE geometry builds wider than BOTTOMS_SLIM for loose measurements", () => {
    const looseMeasurement: ProductMeasurement = {
      ...baseMeasurement,
      category: "pants",
      garmentType: "pants",
      waist: 82,
      inseam: 74,
      thighWidth: 36,
      hemWidth: 28,
      bodyWidth: null,
      shoulderWidth: null,
      bodyLength: null,
      sleeveLength: null
    };
    const slimGeometry = fitter.buildGarmentGeometry({
      bodyDimensions: baseBody,
      measurement: { ...looseMeasurement, thighWidth: 28, hemWidth: 18 },
      genre: "BOTTOMS_SLIM",
      showHeatmap: true
    });
    const looseGeometry = fitter.buildGarmentGeometry({
      bodyDimensions: baseBody,
      measurement: looseMeasurement,
      genre: "BOTTOMS_LOOSE",
      showHeatmap: true
    });

    slimGeometry.computeBoundingBox();
    looseGeometry.computeBoundingBox();

    const slimWidth = (slimGeometry.boundingBox?.max.x ?? 0) - (slimGeometry.boundingBox?.min.x ?? 0);
    const looseWidth = (looseGeometry.boundingBox?.max.x ?? 0) - (looseGeometry.boundingBox?.min.x ?? 0);

    expect(looseWidth).toBeGreaterThan(slimWidth);
  });
});
