import {
  BufferAttribute,
  BufferGeometry,
  CylinderGeometry,
  FrontSide,
  LatheGeometry,
  Matrix4,
  MeshStandardMaterial,
  SphereGeometry,
  Vector2
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

import type { BodyProfile, MaterialPreset, ProductMeasurement } from "./types";
import { clamp } from "./utils";

export type GarmentGenre =
  | "TOPS_INNER"
  | "TOPS_OUTER"
  | "BOTTOMS_SLIM"
  | "BOTTOMS_LOOSE"
  | "UNSUPPORTED";

export type MaterialProps = {
  stiffness: number;
  elasticity: number;
  gravity: number;
};

export type BodyDimensions = {
  height: number;
  chest: number;
  waist: number;
  hip: number;
  inseam: number;
  shoulderWidth: number;
  sleeveLength: number;
};

export type GarmentFitInput = {
  bodyDimensions: BodyDimensions;
  measurement: ProductMeasurement;
  genre?: GarmentGenre;
  materialProps?: MaterialProps;
  showHeatmap: boolean;
};

export type FitZone = {
  part: "chest" | "shoulder" | "waist" | "hip" | "thigh" | "inseam" | "sleeve" | "hem";
  deltaCm: number;
  tone: "tight" | "ease" | "neutral";
  intensity: number;
};

type GarmentMeasurements = {
  chest: number;
  shoulder: number;
  sleeve: number;
  bodyLength: number;
  waist: number;
  hip: number;
  inseam: number;
  thigh: number;
  hem: number;
};

const neutralEaseCm = 1.5;
const maxIntensityCm = 4.5;

export class ProceduralGarmentFitter {
  resolveGenre(measurement: ProductMeasurement): GarmentGenre {
    switch (measurement.garmentType) {
      case "t_shirt":
      case "shirt":
      case "sweatshirt":
      case "knit":
        return "TOPS_INNER";
      case "outerwear":
        return "TOPS_OUTER";
      case "pants":
      case "shorts":
        return isLooseBottom(measurement) ? "BOTTOMS_LOOSE" : "BOTTOMS_SLIM";
      case "skirt":
      case "dress":
      case "unknown":
        return "UNSUPPORTED";
    }
  }

  resolveMaterialProps(measurement: ProductMeasurement): MaterialProps {
    return materialPropsForPreset(measurement.materialPreset);
  }

  computeFitZones(input: GarmentFitInput): FitZone[] {
    const genre = input.genre ?? this.resolveGenre(input.measurement);
    const measurements = normalizeMeasurements(input.measurement, input.bodyDimensions);

    if (genre === "UNSUPPORTED") {
      return [];
    }

    if (genre === "TOPS_INNER" || genre === "TOPS_OUTER") {
      return [
        zone("chest", measurements.chest - input.bodyDimensions.chest),
        zone("shoulder", measurements.shoulder - input.bodyDimensions.shoulderWidth),
        zone("sleeve", measurements.sleeve - input.bodyDimensions.sleeveLength)
      ];
    }

    return [
      zone("waist", measurements.waist - input.bodyDimensions.waist),
      zone("hip", measurements.hip - input.bodyDimensions.hip),
      zone("thigh", measurements.thigh - estimateBodyThigh(input.bodyDimensions)),
      zone("inseam", measurements.inseam - input.bodyDimensions.inseam),
      zone("hem", measurements.hem - estimateBodyHem(input.bodyDimensions))
    ];
  }

  buildGarmentGeometry(input: GarmentFitInput): BufferGeometry {
    const genre = input.genre ?? this.resolveGenre(input.measurement);
    const materialProps = input.materialProps ?? this.resolveMaterialProps(input.measurement);

    if (genre === "UNSUPPORTED") {
      return new BufferGeometry();
    }

    const geometry =
      genre === "TOPS_INNER" || genre === "TOPS_OUTER"
        ? buildTopGeometry(input, genre, materialProps)
        : buildBottomGeometry(input, genre, materialProps);
    attachStretchMorph(geometry, input, materialProps);
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
    return geometry;
  }

  buildGarmentMaterial(input: GarmentFitInput): MeshStandardMaterial {
    const genre = input.genre ?? this.resolveGenre(input.measurement);
    const materialProps = input.materialProps ?? this.resolveMaterialProps(input.measurement);
    const baseColor = genre === "TOPS_OUTER" ? "#d1d5db" : genre.startsWith("BOTTOMS") ? "#9ca3af" : "#d8d5cf";

    return new MeshStandardMaterial({
      color: baseColor,
      roughness: clamp(0.42 + materialProps.stiffness * 0.38 + materialProps.gravity * 0.08, 0.32, 0.92),
      metalness: 0.02,
      transparent: true,
      opacity: genre === "UNSUPPORTED" ? 0 : 0.88,
      side: FrontSide,
      polygonOffset: genre.startsWith("BOTTOMS"),
      polygonOffsetFactor: -1
    });
  }
}

export function bodyDimensionsFromProfile(profile: BodyProfile): BodyDimensions {
  return {
    height: profile.height,
    chest: profile.chest,
    waist: profile.waist,
    hip: profile.hip,
    inseam: profile.inseam,
    shoulderWidth: profile.shoulder,
    sleeveLength: 58 + profile.armLengthBias
  };
}

export function fitZonesToScores(zones: FitZone[]): Record<string, number> {
  return Object.fromEntries(zones.map((item) => [item.part, Math.round((1 - item.intensity) * 100)]));
}

export function zoneColor(zoneItem: FitZone) {
  if (zoneItem.tone === "tight") {
    return "#ef4444";
  }

  if (zoneItem.tone === "ease") {
    return "#38bdf8";
  }

  return "#d8d5cf";
}

export function tightMorphInfluence(zones: FitZone[], materialProps: MaterialProps) {
  const tightest = zones.reduce((current, item) => Math.max(current, item.tone === "tight" ? item.intensity : 0), 0);
  return clamp(tightest, 0, materialProps.elasticity);
}

function buildTopGeometry(input: GarmentFitInput, genre: GarmentGenre, materialProps: MaterialProps) {
  const body = input.bodyDimensions;
  const garment = normalizeMeasurements(input.measurement, body);
  const unit = sceneUnit(body);
  const outer = genre === "TOPS_OUTER";
  const baseOffset = 0.8;
  const shoulderChestOffset = outer ? 1.5 : 0;
  const follow = outer ? 0.62 : 0.95;
  const shoulderY = body.height * 0.0144;
  const hemY = Math.max(body.inseam * unit - 0.16, shoulderY - garment.bodyLength * unit - materialProps.gravity * 0.07);
  const chestRadius = cmDiameterToRadius(blendCm(body.chest, garment.chest, follow) + baseOffset + shoulderChestOffset, unit);
  const waistRadius = cmDiameterToRadius(blendCm(body.waist, garment.chest * 0.78, follow) + baseOffset, unit);
  const hemRadius = Math.max(waistRadius * (outer ? 1.12 : 0.96), cmDiameterToRadius(garment.chest * 0.74 + baseOffset, unit));
  const neckRadius = Math.max(0.14, body.shoulderWidth * unit * 0.13);
  const shoulderRadius = (blendCm(body.shoulderWidth, garment.shoulder, follow) + shoulderChestOffset) * unit * 0.5;
  const sleeveLength = Math.max(18, garment.sleeve) * unit;
  const sleeveRadius = (outer ? 7.5 : 5.5) * unit + materialProps.stiffness * 0.025;
  const sleeveDrop = materialProps.gravity * 0.16;
  const torso = new LatheGeometry(
    [
      new Vector2(neckRadius, shoulderY + 0.08),
      new Vector2(shoulderRadius, shoulderY - 0.03),
      new Vector2(chestRadius, shoulderY - 0.26),
      new Vector2(waistRadius, (shoulderY + hemY) * 0.48),
      new Vector2(hemRadius, hemY)
    ],
    36
  );
  const shoulderL = new SphereGeometry(sleeveRadius * 1.15, 18, 12);
  const shoulderR = new SphereGeometry(sleeveRadius * 1.15, 18, 12);
  shoulderL.applyMatrix4(new Matrix4().makeScale(1.25, 0.65, 0.9));
  shoulderR.applyMatrix4(new Matrix4().makeScale(1.25, 0.65, 0.9));
  shoulderL.applyMatrix4(new Matrix4().makeTranslation(-shoulderRadius, shoulderY - 0.04, 0));
  shoulderR.applyMatrix4(new Matrix4().makeTranslation(shoulderRadius, shoulderY - 0.04, 0));
  const sleeveL = new CylinderGeometry(sleeveRadius * 0.72, sleeveRadius, sleeveLength, 18, 1, true);
  const sleeveR = new CylinderGeometry(sleeveRadius * 0.72, sleeveRadius, sleeveLength, 18, 1, true);
  sleeveL.applyMatrix4(new Matrix4().makeRotationZ(-0.72));
  sleeveR.applyMatrix4(new Matrix4().makeRotationZ(0.72));
  sleeveL.applyMatrix4(new Matrix4().makeTranslation(-shoulderRadius - sleeveLength * 0.32, shoulderY - sleeveLength * 0.31 - sleeveDrop, 0));
  sleeveR.applyMatrix4(new Matrix4().makeTranslation(shoulderRadius + sleeveLength * 0.32, shoulderY - sleeveLength * 0.31 - sleeveDrop, 0));

  return mergeGeometries([torso, shoulderL, shoulderR, sleeveL, sleeveR], false) ?? torso;
}

function buildBottomGeometry(input: GarmentFitInput, genre: GarmentGenre, materialProps: MaterialProps) {
  const body = input.bodyDimensions;
  const garment = normalizeMeasurements(input.measurement, body);
  const unit = sceneUnit(body);
  const loose = genre === "BOTTOMS_LOOSE";
  const waistY = body.inseam * unit + 0.05;
  const inseamLength = Math.max(garment.inseam, body.inseam * 0.32) * unit;
  const ankleY = Math.max(0.04, waistY - inseamLength - materialProps.gravity * 0.08);
  const waistRadius = cmDiameterToRadius(Math.max(body.waist + 0.6, garment.waist + 0.6), unit);
  const hipRadius = cmDiameterToRadius(blendCm(body.hip, garment.hip, loose ? 0.4 : 0.9) + (loose ? 3 : 0.8), unit);
  const thighDiameter = blendCm(estimateBodyThigh(body), garment.thigh, loose ? 0.4 : 0.95) + (loose ? 3.2 : 0.6);
  const hemDiameter = Math.max(loose ? estimateBodyHem(body) + 6 : estimateBodyHem(body) + 0.6, garment.hem + (loose ? 3 : 0.6));
  const waist = new CylinderGeometry(hipRadius, waistRadius, 0.24, 36, 1, true);
  waist.applyMatrix4(new Matrix4().makeTranslation(0, waistY - 0.12, 0));
  const legRadiusTop = cmDiameterToRadius(thighDiameter, unit);
  const legRadiusBottom = cmDiameterToRadius(hemDiameter, unit);
  const legHeight = Math.max(0.42, waistY - ankleY);
  const legL = new CylinderGeometry(legRadiusBottom, legRadiusTop, legHeight, 24, 2, true);
  const legR = new CylinderGeometry(legRadiusBottom, legRadiusTop, legHeight, 24, 2, true);
  const legX = Math.max(legRadiusTop * 0.88, body.hip * unit * 0.16);
  const cushion = Math.max(0, garment.inseam - body.inseam) * unit * 0.35;
  legL.applyMatrix4(new Matrix4().makeScale(0.82, 1, 0.72 + materialProps.stiffness * 0.12));
  legR.applyMatrix4(new Matrix4().makeScale(0.82, 1, 0.72 + materialProps.stiffness * 0.12));
  legL.applyMatrix4(new Matrix4().makeTranslation(-legX, ankleY + legHeight * 0.5 - cushion, 0));
  legR.applyMatrix4(new Matrix4().makeTranslation(legX, ankleY + legHeight * 0.5 - cushion, 0));

  return mergeGeometries([waist, legL, legR], false) ?? waist;
}

function attachStretchMorph(geometry: BufferGeometry, input: GarmentFitInput, materialProps: MaterialProps) {
  const position = geometry.getAttribute("position");
  const stretched = new Float32Array(position.count * 3);
  const zones = new ProceduralGarmentFitter().computeFitZones(input);
  const tight = tightMorphInfluence(zones, materialProps);

  for (let index = 0; index < position.count; index += 1) {
    const x = position.getX(index);
    const y = position.getY(index);
    const z = position.getZ(index);
    stretched[index * 3] = x * (1 + tight * 0.08);
    stretched[index * 3 + 1] = y;
    stretched[index * 3 + 2] = z * (1 + tight * 0.08);
  }

  geometry.morphAttributes.position = [new BufferAttribute(stretched, 3)];
}

function normalizeMeasurements(measurement: ProductMeasurement, body: BodyDimensions): GarmentMeasurements {
  const chest = measurement.bodyWidth ? measurement.bodyWidth * 2 : body.chest + 4;
  const shoulder = measurement.shoulderWidth ?? body.shoulderWidth + 1;
  const sleeve = measurement.sleeveLength ?? body.sleeveLength;
  const bodyLength = measurement.bodyLength ?? body.height * 0.39;
  const waist = measurement.waist ?? body.waist + 3;
  const hip = Math.max(measurement.waist ?? body.hip + 4, body.hip + 2);
  const inseam = measurement.inseam ?? body.inseam;
  const thigh = measurement.thighWidth ? measurement.thighWidth * 2 : estimateBodyThigh(body) + 3;
  const hem = measurement.hemWidth ? measurement.hemWidth * 2 : estimateBodyHem(body) + 2;

  return { chest, shoulder, sleeve, bodyLength, waist, hip, inseam, thigh, hem };
}

function materialPropsForPreset(preset: MaterialPreset): MaterialProps {
  switch (preset) {
    case "structured":
      return { stiffness: 0.82, elasticity: 0.18, gravity: 0.18 };
    case "draped":
      return { stiffness: 0.22, elasticity: 0.36, gravity: 0.82 };
    case "heavy":
      return { stiffness: 0.72, elasticity: 0.16, gravity: 0.48 };
    case "standard":
    default:
      return { stiffness: 0.48, elasticity: 0.28, gravity: 0.36 };
  }
}

function isLooseBottom(measurement: ProductMeasurement) {
  const thigh = measurement.thighWidth ? measurement.thighWidth * 2 : 0;
  const hem = measurement.hemWidth ? measurement.hemWidth * 2 : 0;
  return thigh >= 68 || hem >= 48;
}

function zone(part: FitZone["part"], deltaCm: number): FitZone {
  const abs = Math.abs(deltaCm);
  const tone = abs <= neutralEaseCm ? "neutral" : deltaCm < 0 ? "tight" : "ease";
  return {
    part,
    deltaCm,
    tone,
    intensity: tone === "neutral" ? 0 : clamp(abs / maxIntensityCm, 0, 1)
  };
}

function sceneUnit(body: BodyDimensions) {
  return 2.72 / Math.max(body.height, 120);
}

function cmDiameterToRadius(value: number, unit: number) {
  return Math.max(0.02, (value * unit) / Math.PI);
}

function blendCm(bodyValue: number, garmentValue: number, bodyFollow: number) {
  return bodyValue * bodyFollow + garmentValue * (1 - bodyFollow);
}

function estimateBodyThigh(body: BodyDimensions) {
  return body.hip * 0.36;
}

function estimateBodyHem(body: BodyDimensions) {
  return body.hip * 0.2;
}
