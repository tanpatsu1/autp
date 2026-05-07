import type { GarmentCategory, GarmentType } from "@/lib/types";

type Rule = {
  type: GarmentType;
  category: GarmentCategory;
  weight: number;
  patterns: RegExp[];
};

export type GarmentClassification = {
  garmentType: GarmentType;
  category: GarmentCategory;
  confidence: number;
  evidence: string[];
};

const RULES: Rule[] = [
  {
    type: "outerwear",
    category: "tops",
    weight: 1.2,
    patterns: [
      /outer|outerwear|jacket|coat|blouson|parka|anorak|down|vest/i,
      /アウター|ジャケット|コート|ブルゾン|パーカー|アノラック|ダウン|ベスト/
    ]
  },
  {
    type: "t_shirt",
    category: "tops",
    weight: 1.1,
    patterns: [/t[-\s]?shirt|tee\b|cut\s?sew|tops/i, /Tシャツ|ティーシャツ|カットソー|半袖/]
  },
  {
    type: "shirt",
    category: "tops",
    weight: 1,
    patterns: [/shirt|blouse/i, /シャツ|ブラウス/]
  },
  {
    type: "sweatshirt",
    category: "tops",
    weight: 1,
    patterns: [/sweat|hoodie|pullover/i, /スウェット|スエット|フーディ|フーディー|プルオーバー/]
  },
  {
    type: "knit",
    category: "tops",
    weight: 1,
    patterns: [/knit|sweater|cardigan/i, /ニット|セーター|カーディガン/]
  },
  {
    type: "shorts",
    category: "pants",
    weight: 1.2,
    patterns: [/shorts|short pants/i, /ショーツ|ショートパンツ|ハーフパンツ/]
  },
  {
    type: "pants",
    category: "pants",
    weight: 1,
    patterns: [/pants|trousers|slacks|jeans|denim|chino|cargo/i, /パンツ|ズボン|トラウザー|スラックス|デニム|ジーンズ|チノ|カーゴ/]
  },
  {
    type: "skirt",
    category: "pants",
    weight: 1,
    patterns: [/skirt/i, /スカート/]
  },
  {
    type: "dress",
    category: "tops",
    weight: 1,
    patterns: [/dress|one[-\s]?piece/i, /ワンピース|ドレス/]
  }
];

export function classifyGarment(text: string): GarmentClassification {
  const normalized = text.replace(/\s+/g, " ");
  const scores = new Map<GarmentType, { score: number; category: GarmentCategory; evidence: string[] }>();

  for (const rule of RULES) {
    for (const pattern of rule.patterns) {
      const match = pattern.exec(normalized);
      if (!match) {
        continue;
      }

      const current = scores.get(rule.type) ?? {
        score: 0,
        category: rule.category,
        evidence: []
      };
      current.score += rule.weight;
      current.evidence.push(match[0]);
      scores.set(rule.type, current);
    }
  }

  const ranked = [...scores.entries()].sort((a, b) => b[1].score - a[1].score);
  const best = ranked[0];

  if (!best) {
    return {
      garmentType: "unknown",
      category: "tops",
      confidence: 0,
      evidence: []
    };
  }

  const total = ranked.reduce((sum, [, item]) => sum + item.score, 0);
  const confidence = Math.min(0.95, Math.max(0.35, best[1].score / Math.max(total, 1)));

  return {
    garmentType: best[0],
    category: best[1].category,
    confidence,
    evidence: [...new Set(best[1].evidence)].slice(0, 5)
  };
}

export function categoryForGarmentType(type: GarmentType): GarmentCategory {
  return RULES.find((rule) => rule.type === type)?.category ?? (type === "unknown" ? "tops" : "tops");
}

export function garmentTypeLabel(type: GarmentType) {
  switch (type) {
    case "t_shirt":
      return "T-shirt";
    case "shirt":
      return "Shirt";
    case "sweatshirt":
      return "Sweatshirt";
    case "knit":
      return "Knit";
    case "outerwear":
      return "Outerwear";
    case "pants":
      return "Pants";
    case "shorts":
      return "Shorts";
    case "skirt":
      return "Skirt";
    case "dress":
      return "Dress";
    case "unknown":
      return "Unknown";
  }
}
