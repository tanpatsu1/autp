"use client";

import { ContactShadows, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import {
  Bone,
  BufferAttribute,
  BufferGeometry,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  PCFShadowMap,
  Skeleton,
  SkinnedMesh,
  Vector3
} from "three";

import { garmentTypeLabel } from "@/lib/analysis/garment-classifier";
import type { FitScore, FitVisualization } from "@/lib/fit";
import {
  ProceduralGarmentFitter,
  bodyDimensionsFromProfile,
  tightMorphInfluence,
  zoneColor,
  type FitZone,
  type GarmentGenre
} from "@/lib/garment-fitting";
import type { BodyProfile, ProductMeasurement } from "@/lib/types";

import styles from "./fit-studio.module.css";

type AvatarStageProps = {
  profile: BodyProfile;
  measurement: ProductMeasurement;
  visualization: FitVisualization;
  scores: FitScore[];
};

type BoneName =
  | "root"
  | "pelvis"
  | "spine"
  | "chest"
  | "neck"
  | "head"
  | "upperArmL"
  | "lowerArmL"
  | "handL"
  | "upperArmR"
  | "lowerArmR"
  | "handR"
  | "upperLegL"
  | "lowerLegL"
  | "footL"
  | "upperLegR"
  | "lowerLegR"
  | "footR";

type BoneNode = {
  name: BoneName;
  children?: BoneNode[];
};

type RigDimensions = {
  heightScale: number;
  shoulder: number;
  chest: number;
  waist: number;
  hip: number;
  depth: number;
  torsoLength: number;
  upperLeg: number;
  lowerLeg: number;
  armUpper: number;
  armLower: number;
  headScale: number;
  pelvisY: number;
  spineY: number;
  chestY: number;
  neckY: number;
  headY: number;
  shoulderX: number;
  hipJointX: number;
};

type RingSpec = {
  center: Vector3;
  rx: number;
  rz: number;
  boneA: BoneName;
  boneB: BoneName;
  blend: number;
};

type GeometryBuild = {
  positions: number[];
  indices: number[];
  skinIndices: number[];
  skinWeights: number[];
};

type MannequinRig = {
  mesh: SkinnedMesh;
  geometry: BufferGeometry;
  material: MeshStandardMaterial;
};

const radialSegments = 28;
const garmentFitter = new ProceduralGarmentFitter();

const BONE_STRUCTURE: BoneNode = {
  name: "root",
  children: [
    {
      name: "pelvis",
      children: [
        {
          name: "spine",
          children: [
            {
              name: "chest",
              children: [
                { name: "neck", children: [{ name: "head" }] },
                { name: "upperArmL", children: [{ name: "lowerArmL", children: [{ name: "handL" }] }] },
                { name: "upperArmR", children: [{ name: "lowerArmR", children: [{ name: "handR" }] }] }
              ]
            }
          ]
        },
        { name: "upperLegL", children: [{ name: "lowerLegL", children: [{ name: "footL" }] }] },
        { name: "upperLegR", children: [{ name: "lowerLegR", children: [{ name: "footR" }] }] }
      ]
    }
  ]
};

export function AvatarStage({ profile, measurement, visualization }: AvatarStageProps) {
  const [resetKey, setResetKey] = useState(0);
  const bodyDimensions = useMemo(() => bodyDimensionsFromProfile(profile), [profile]);
  const genre = useMemo(() => garmentFitter.resolveGenre(measurement), [measurement]);
  const materialProps = useMemo(() => garmentFitter.resolveMaterialProps(measurement), [measurement]);
  const fitZones = useMemo(
    () =>
      garmentFitter.computeFitZones({
        bodyDimensions,
        measurement,
        genre,
        materialProps,
        showHeatmap: true
      }),
    [bodyDimensions, genre, materialProps, measurement]
  );

  return (
    <div className={styles.stageShell}>
      <div className={styles.stageInfo}>
        <span>
          {garmentTypeLabel(measurement.garmentType)} / {measurement.sizeLabel}
        </span>
        <span>{genre === "UNSUPPORTED" ? "3D未対応の服種" : genreStatusLabel(genre)}</span>
      </div>

      <div className={styles.stageViewport} style={{ position: "relative" }}>
        <Canvas key={resetKey} shadows={{ type: PCFShadowMap }} dpr={[1, 1.7]}>
          <PerspectiveCamera makeDefault position={[0, 1.45, 6.15]} fov={35} />
          <color attach="background" args={["#f8fafc"]} />
          <ambientLight intensity={1.35} />
          <hemisphereLight args={["#ffffff", "#d9e2ef", 1.15]} />
          <directionalLight castShadow position={[3.6, 5.2, 4.1]} intensity={2.65} shadow-mapSize={[1024, 1024]} />
          <directionalLight position={[-4.2, 2.7, -3.2]} intensity={0.85} />
          <group position={[0, -1.72, 0]} rotation={[0, -0.08, 0]}>
            <StudioMannequin profile={profile} visualization={visualization} />
            {genre !== "UNSUPPORTED" ? (
              <StaticGarment
                bodyDimensions={bodyDimensions}
                fitZones={fitZones}
                genre={genre}
                materialProps={materialProps}
                measurement={measurement}
              />
            ) : null}
          </group>
          <ContactShadows position={[0, -1.72, 0]} scale={5.8} blur={2.6} opacity={0.2} />
          <OrbitControls
            enablePan={false}
            minDistance={3.5}
            maxDistance={8.2}
            minPolarAngle={Math.PI * 0.22}
            maxPolarAngle={Math.PI * 0.78}
            target={[0, 0.2, 0]}
          />
        </Canvas>
        {genre === "UNSUPPORTED" ? <UnsupportedBadge /> : null}
      </div>

      <div className={styles.viewerControls} aria-label="3Dビュー操作">
        <div className={styles.segmentGroup}>
          <button type="button" className={styles.segmentActive}>
            待機
          </button>
          <button
            type="button"
            className={styles.resetButton}
            onClick={() => {
              setResetKey((current) => current + 1);
            }}
          >
            リセット
          </button>
        </div>
      </div>

      <div className={styles.scoreRail}>
        {fitZones.length ? (
          fitZones.slice(0, 3).map((zone) => (
            <div key={zone.part} className={zone.tone === "tight" ? styles.scoreWarn : styles.scoreGood}>
              <span>{fitZoneLabel(zone.part)}</span>
              <strong>{fitZoneDetail(zone)}</strong>
            </div>
          ))
        ) : (
          <div className={styles.scoreWarn}>
            <span>衣服</span>
            <strong>非対応</strong>
          </div>
        )}
      </div>
      <div className={styles.stageMeta}>
        <span>{profile.height}cm / 簡易フィットモデル</span>
        <span>トップス・パンツ・ショーツ対応 / ドラッグで回転</span>
      </div>
    </div>
  );
}

function StudioMannequin({ profile, visualization }: { profile: BodyProfile; visualization: FitVisualization }) {
  const rig = useMemo(() => createMannequinRig(profile, visualization), [profile, visualization]);

  useEffect(() => {
    return () => {
      rig.geometry.dispose();
      rig.material.dispose();
    };
  }, [rig]);

  return <primitive object={rig.mesh} />;
}

function StaticGarment({
  bodyDimensions,
  fitZones,
  genre,
  materialProps,
  measurement
}: {
  bodyDimensions: ReturnType<typeof bodyDimensionsFromProfile>;
  fitZones: FitZone[];
  genre: Exclude<GarmentGenre, "UNSUPPORTED">;
  materialProps: ReturnType<ProceduralGarmentFitter["resolveMaterialProps"]>;
  measurement: ProductMeasurement;
}) {
  const garment = useMemo(() => {
    const input = {
      bodyDimensions,
      measurement,
      genre,
      materialProps,
      showHeatmap: true
    };
    const geometry = garmentFitter.buildGarmentGeometry(input);
    const material = garmentFitter.buildGarmentMaterial(input);
    material.color.set(zoneColor(dominantZone(fitZones)));
    material.opacity = 0.78;
    const mesh = new Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.morphTargetInfluences = [tightMorphInfluence(fitZones, materialProps)];

    return { geometry, material, mesh };
  }, [bodyDimensions, fitZones, genre, materialProps, measurement]);

  useEffect(() => {
    return () => {
      garment.geometry.dispose();
      garment.material.dispose();
    };
  }, [garment]);

  return <primitive object={garment.mesh} />;
}

function UnsupportedBadge() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
        pointerEvents: "none"
      }}
    >
      <span
        style={{
          border: "1px solid var(--line)",
          borderRadius: 999,
          background: "rgba(255, 255, 255, 0.88)",
          color: "var(--muted)",
          padding: "7px 11px",
          fontSize: 12,
          fontWeight: 700
        }}
      >
        スカート・ワンピースは次フェーズ対応予定
      </span>
    </div>
  );
}

function createMannequinRig(profile: BodyProfile, visualization: FitVisualization): MannequinRig {
  const dimensions = bodyScale(profile, visualization);
  const bones = createBones(BONE_STRUCTURE, dimensions);
  const geometry = createSkinnedMannequinGeometry(dimensions, bones.indices);
  const material = new MeshStandardMaterial({
    color: "#e7d4c4",
    roughness: 0.54,
    metalness: 0.02,
    envMapIntensity: 0.55
  });
  const mesh = new SkinnedMesh(geometry, material);
  const skeleton = new Skeleton(bones.list);

  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.add(bones.map.root);
  mesh.bind(skeleton);
  mesh.frustumCulled = false;

  return { mesh, geometry, material };
}

function bodyScale(profile: BodyProfile, visualization: FitVisualization): RigDimensions {
  const heightScale = clamp(profile.height / 168, 0.9, 1.16);
  const legPreference = clamp((profile.inseam - 74) / 125 + (heightScale - 1) * 0.42, -0.12, 0.18);
  const legScale = clamp(heightScale + legPreference, 0.82, 1.25);
  const torsoScale = clamp(heightScale - legPreference * 0.24, 0.88, 1.14);
  const shoulderScale = clamp(profile.shoulder / 44, 0.86, 1.18);
  const chestScale = clamp(profile.chest / 92, 0.82, 1.22);
  const waistScale = clamp(profile.waist / 78, 0.78, 1.28);
  const hipScale = clamp(profile.hip / 93, 0.82, 1.24);
  const massScale = clamp(profile.weight / 60, 0.82, 1.28);
  const armScale = clamp(1 + profile.armLengthBias / 80, 0.84, 1.18);
  const torsoLength = 1.08 * torsoScale;
  const upperLeg = 0.76 * legScale;
  const lowerLeg = 0.72 * legScale;
  const pelvisY = upperLeg + lowerLeg;
  const spineY = pelvisY + torsoLength * 0.43;
  const chestY = pelvisY + torsoLength * 0.92;
  const neckY = chestY + 0.2 * heightScale;
  const headY = neckY + 0.28 * heightScale;
  const shoulder = 0.68 * shoulderScale;
  const chestEase = (visualization.torsoWidth - 1) * 0.035;
  const waistEase = (visualization.waistWidth - 1) * 0.03;
  const chest = 0.86 * (chestScale + (massScale - 1) * 0.1 + chestEase);
  const waist = 0.68 * (waistScale + (massScale - 1) * 0.08 + waistEase);
  const hip = 0.9 * (hipScale + (massScale - 1) * 0.08);

  return {
    heightScale,
    shoulder,
    chest,
    waist,
    hip,
    depth: 0.34 * (0.72 + chestScale * 0.2 + massScale * 0.08),
    torsoLength,
    upperLeg,
    lowerLeg,
    armUpper: 0.58 * armScale * heightScale,
    armLower: 0.52 * armScale * heightScale,
    headScale: heightScale,
    pelvisY,
    spineY,
    chestY,
    neckY,
    headY,
    shoulderX: shoulder * 0.52,
    hipJointX: hip * 0.18
  };
}

function createBones(node: BoneNode, dimensions: RigDimensions) {
  const map = {} as Record<BoneName, Bone>;
  const list: Bone[] = [];
  const indices = {} as Record<BoneName, number>;

  function make(current: BoneNode, parent: Bone | null) {
    const bone = new Bone();
    bone.name = current.name;
    bone.position.copy(localBonePosition(current.name, dimensions));

    if (parent) {
      parent.add(bone);
    }

    map[current.name] = bone;
    indices[current.name] = list.length;
    list.push(bone);

    current.children?.forEach((child) => make(child, bone));
  }

  make(node, null);
  return { map, list, indices };
}

function localBonePosition(name: BoneName, dimensions: RigDimensions) {
  switch (name) {
    case "root":
      return new Vector3(0, 0, 0);
    case "pelvis":
      return new Vector3(0, dimensions.pelvisY, 0);
    case "spine":
      return new Vector3(0, dimensions.spineY - dimensions.pelvisY, 0);
    case "chest":
      return new Vector3(0, dimensions.chestY - dimensions.spineY, 0);
    case "neck":
      return new Vector3(0, dimensions.neckY - dimensions.chestY, 0);
    case "head":
      return new Vector3(0, dimensions.headY - dimensions.neckY, 0);
    case "upperArmL":
      return new Vector3(-dimensions.shoulderX, 0.02, 0);
    case "upperArmR":
      return new Vector3(dimensions.shoulderX, 0.02, 0);
    case "lowerArmL":
      return new Vector3(-dimensions.armUpper * 0.52, -dimensions.armUpper * 0.72, 0.02);
    case "lowerArmR":
      return new Vector3(dimensions.armUpper * 0.52, -dimensions.armUpper * 0.72, 0.02);
    case "handL":
      return new Vector3(-dimensions.armLower * 0.42, -dimensions.armLower * 0.76, 0.03);
    case "handR":
      return new Vector3(dimensions.armLower * 0.42, -dimensions.armLower * 0.76, 0.03);
    case "upperLegL":
      return new Vector3(-dimensions.hipJointX, -0.03, 0);
    case "upperLegR":
      return new Vector3(dimensions.hipJointX, -0.03, 0);
    case "lowerLegL":
    case "lowerLegR":
      return new Vector3(0, -dimensions.upperLeg, 0.02);
    case "footL":
    case "footR":
      return new Vector3(0, -dimensions.lowerLeg, 0.12);
  }
}

function createSkinnedMannequinGeometry(dimensions: RigDimensions, boneIndices: Record<BoneName, number>) {
  const data: GeometryBuild = {
    positions: [],
    indices: [],
    skinIndices: [],
    skinWeights: []
  };

  appendTube(data, torsoRings(dimensions), boneIndices);
  appendTube(data, headRings(dimensions), boneIndices);
  appendTube(data, armRings(dimensions, -1), boneIndices);
  appendTube(data, armRings(dimensions, 1), boneIndices);
  appendTube(data, legRings(dimensions, -1), boneIndices);
  appendTube(data, legRings(dimensions, 1), boneIndices);

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(new Float32Array(data.positions), 3));
  geometry.setAttribute("skinIndex", new BufferAttribute(new Uint16Array(data.skinIndices), 4));
  geometry.setAttribute("skinWeight", new BufferAttribute(new Float32Array(data.skinWeights), 4));
  geometry.setIndex(data.indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();

  return geometry;
}

function torsoRings(body: RigDimensions): RingSpec[] {
  const y = body.pelvisY;
  return [
    ring(0, y - 0.08, 0, body.hip * 0.42, body.depth * 0.88, "pelvis", "spine", 0.12),
    ring(0, y + body.torsoLength * 0.18, 0, body.waist * 0.43, body.depth * 0.82, "pelvis", "spine", 0.55),
    ring(0, y + body.torsoLength * 0.48, 0, body.waist * 0.48, body.depth * 0.92, "spine", "chest", 0.4),
    ring(0, y + body.torsoLength * 0.7, 0, body.chest * 0.52, body.depth * 1.06, "spine", "chest", 0.72),
    ring(0, body.chestY + 0.02, 0, body.shoulder * 0.58, body.depth * 0.9, "chest", "neck", 0.18),
    ring(0, body.neckY - 0.03, 0, 0.14 * body.heightScale, 0.12 * body.heightScale, "chest", "neck", 0.78)
  ];
}

function headRings(body: RigDimensions): RingSpec[] {
  const s = body.headScale;
  return [
    ring(0, body.neckY + 0.02, 0, 0.135 * s, 0.115 * s, "neck", "head", 0.35),
    ring(0, body.headY + 0.02, 0.008, 0.215 * s, 0.18 * s, "neck", "head", 0.78),
    ring(0, body.headY + 0.21 * s, 0, 0.235 * s, 0.195 * s, "head", "head", 0),
    ring(0, body.headY + 0.39 * s, -0.01, 0.15 * s, 0.14 * s, "head", "head", 0)
  ];
}

function armRings(body: RigDimensions, side: -1 | 1): RingSpec[] {
  const shoulderX = side * body.shoulderX;
  const elbowX = shoulderX + side * body.armUpper * 0.52;
  const elbowY = body.chestY - body.armUpper * 0.7;
  const wristX = elbowX + side * body.armLower * 0.42;
  const wristY = elbowY - body.armLower * 0.76;
  const upper: BoneName = side < 0 ? "upperArmL" : "upperArmR";
  const lower: BoneName = side < 0 ? "lowerArmL" : "lowerArmR";
  const hand: BoneName = side < 0 ? "handL" : "handR";

  return [
    ring(shoulderX, body.chestY - 0.03, 0, 0.155, 0.13, "chest", upper, 0.54),
    ring(shoulderX + side * body.armUpper * 0.2, body.chestY - body.armUpper * 0.28, 0.01, 0.13, 0.108, upper, lower, 0.08),
    ring(elbowX, elbowY, 0.025, 0.102, 0.088, upper, lower, 0.5),
    ring(elbowX + side * body.armLower * 0.2, elbowY - body.armLower * 0.32, 0.03, 0.082, 0.072, lower, hand, 0.18),
    ring(wristX, wristY, 0.04, 0.064, 0.058, lower, hand, 0.72),
    ring(wristX + side * 0.03, wristY - 0.1, 0.045, 0.075, 0.052, hand, hand, 0)
  ];
}

function legRings(body: RigDimensions, side: -1 | 1): RingSpec[] {
  const hipX = side * body.hipJointX;
  const kneeY = body.pelvisY - body.upperLeg;
  const ankleY = kneeY - body.lowerLeg;
  const upper: BoneName = side < 0 ? "upperLegL" : "upperLegR";
  const lower: BoneName = side < 0 ? "lowerLegL" : "lowerLegR";
  const foot: BoneName = side < 0 ? "footL" : "footR";
  const thigh = 0.145 * body.hip + clamp(body.hip - 0.9, -0.02, 0.04);

  return [
    ring(hipX, body.pelvisY - 0.02, 0, thigh * 1.15, body.depth * 0.52, "pelvis", upper, 0.56),
    ring(hipX, body.pelvisY - body.upperLeg * 0.42, 0.015, thigh, body.depth * 0.43, upper, lower, 0.08),
    ring(hipX, kneeY, 0.025, thigh * 0.68, body.depth * 0.33, upper, lower, 0.5),
    ring(hipX, kneeY - body.lowerLeg * 0.38, 0.03, thigh * 0.56, body.depth * 0.31, lower, foot, 0.08),
    ring(hipX, ankleY, 0.06, thigh * 0.42, body.depth * 0.26, lower, foot, 0.75),
    ring(hipX + side * 0.015, ankleY - 0.04, 0.18, thigh * 0.52, body.depth * 0.44, foot, foot, 0)
  ];
}

function appendTube(data: GeometryBuild, rings: RingSpec[], boneIndices: Record<BoneName, number>) {
  const start = data.positions.length / 3;

  for (const currentRing of rings) {
    for (let segment = 0; segment < radialSegments; segment += 1) {
      const angle = (segment / radialSegments) * Math.PI * 2;
      data.positions.push(
        currentRing.center.x + Math.cos(angle) * currentRing.rx,
        currentRing.center.y,
        currentRing.center.z + Math.sin(angle) * currentRing.rz
      );
      pushSkin(data, boneIndices[currentRing.boneA], boneIndices[currentRing.boneB], currentRing.blend);
    }
  }

  for (let ringIndex = 0; ringIndex < rings.length - 1; ringIndex += 1) {
    for (let segment = 0; segment < radialSegments; segment += 1) {
      const nextSegment = (segment + 1) % radialSegments;
      const a = start + ringIndex * radialSegments + segment;
      const b = start + ringIndex * radialSegments + nextSegment;
      const c = start + (ringIndex + 1) * radialSegments + segment;
      const d = start + (ringIndex + 1) * radialSegments + nextSegment;
      data.indices.push(a, c, b, b, c, d);
    }
  }
}

function pushSkin(data: GeometryBuild, boneA: number, boneB: number, blend: number) {
  const second = clamp(blend, 0, 1);
  data.skinIndices.push(boneA, boneB, 0, 0);
  data.skinWeights.push(1 - second, second, 0, 0);
}

function ring(
  x: number,
  y: number,
  z: number,
  rx: number,
  rz: number,
  boneA: BoneName,
  boneB: BoneName,
  blend: number
): RingSpec {
  return { center: new Vector3(x, y, z), rx, rz, boneA, boneB, blend };
}

function fitZoneLabel(part: FitZone["part"]) {
  switch (part) {
    case "chest":
      return "胸囲";
    case "shoulder":
      return "肩幅";
    case "waist":
      return "ウエスト";
    case "hip":
      return "ヒップ";
    case "thigh":
      return "太もも";
    case "inseam":
      return "股下";
    case "sleeve":
      return "袖丈";
    case "hem":
      return "裾幅";
  }
}

function genreStatusLabel(genre: GarmentGenre) {
  switch (genre) {
    case "TOPS_INNER":
      return "トップス簡易プレビュー";
    case "TOPS_OUTER":
      return "アウター簡易プレビュー";
    case "BOTTOMS_SLIM":
      return "パンツ簡易プレビュー";
    case "BOTTOMS_LOOSE":
      return "ワイドパンツ簡易プレビュー";
    case "UNSUPPORTED":
      return "3D未対応の服種";
  }
}

function fitZoneDetail(zone: FitZone) {
  if (zone.tone === "neutral") {
    return "適正";
  }

  return zone.tone === "tight" ? `${Math.abs(zone.deltaCm).toFixed(1)}cm タイト` : `${zone.deltaCm.toFixed(1)}cm ゆとり`;
}

function dominantZone(zones: FitZone[]) {
  return (
    zones
      .filter((zone) => zone.tone !== "neutral")
      .sort((a, b) => b.intensity - a.intensity)[0] ?? {
      part: "chest",
      deltaCm: 0,
      tone: "neutral",
      intensity: 0
    }
  );
}

function clamp(value: number, min: number, max: number) {
  return MathUtils.clamp(value, min, max);
}
