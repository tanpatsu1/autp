import * as cheerio from "cheerio";

import type {
  GarmentCategory,
  MaterialPreset,
  MeasurementField,
  ProductAnalysisResult,
  ProductMeasurement
} from "@/lib/types";

type FieldAlias = {
  field: MeasurementField;
  aliases: string[];
};

type Candidate = {
  value: number;
  snippet: string;
  confidence: number;
};

type RawExtraction = {
  title: string;
  brand: string;
  category: GarmentCategory;
  summary: string;
  measurements: ProductMeasurement[];
  extractionNotes: string[];
};

const FIELD_ALIASES: FieldAlias[] = [
  { field: "body_length", aliases: ["着丈", "総丈", "身丈"] },
  { field: "body_width", aliases: ["身幅", "胸囲", "バスト", "身回り"] },
  { field: "shoulder_width", aliases: ["肩幅"] },
  { field: "sleeve_length", aliases: ["袖丈", "裄丈"] },
  { field: "waist", aliases: ["ウエスト"] },
  { field: "rise", aliases: ["股上"] },
  { field: "inseam", aliases: ["股下"] },
  { field: "thigh_width", aliases: ["わたり", "渡り幅", "もも幅"] },
  { field: "hem_width", aliases: ["裾幅", "裾口"] }
];

const TOPS_FIELDS: MeasurementField[] = [
  "body_length",
  "body_width",
  "shoulder_width",
  "sleeve_length"
];

const PANTS_FIELDS: MeasurementField[] = [
  "waist",
  "rise",
  "inseam",
  "thigh_width",
  "hem_width"
];

export function extractProductData(sourceUrl: string, html: string): RawExtraction {
  const $ = cheerio.load(html);
  const cleanText = $("body")
    .text()
    .replace(/\s+/g, " ")
    .replace(/ /g, " ")
    .trim();

  const title = readTitle($);
  const brand = readBrand($);
  const category = guessCategory(`${title} ${cleanText}`);
  const materialPreset = guessMaterialPreset(cleanText);
  const sizeLabels = collectSizeLabels($, cleanText);
  const tables = extractTableCandidates($);
  const textCandidates = extractTextCandidates(cleanText);

  const measurements = sizeLabels.map((sizeLabel) =>
    buildMeasurement(sourceUrl, sizeLabel, category, materialPreset, tables, textCandidates)
  );

  return {
    title,
    brand,
    category,
    summary: cleanText.slice(0, 360),
    measurements,
    extractionNotes: [
      tables.length ? `table:${tables.length}` : "table:none",
      `sizes:${sizeLabels.join(", ")}`
    ]
  };
}

export async function maybeFillWithLlm(
  current: RawExtraction,
  html: string
): Promise<{ result: RawExtraction; usedLlmFallback: boolean }> {
  const hasMissing = current.measurements.some((item) => item.missingFields.length > 0);
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL;

  if (!hasMissing || !apiKey || !model) {
    return { result: current, usedLlmFallback: false };
  }

  const prompt = buildLlmPrompt(current, html);
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      input: prompt,
      text: {
        format: {
          type: "json_schema",
          name: "garment_extraction",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              measurements: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    sizeLabel: { type: "string" },
                    values: {
                      type: "object",
                      additionalProperties: false,
                      properties: {
                        waist: { type: ["number", "null"] },
                        inseam: { type: ["number", "null"] },
                        rise: { type: ["number", "null"] },
                        thigh_width: { type: ["number", "null"] },
                        hem_width: { type: ["number", "null"] },
                        body_width: { type: ["number", "null"] },
                        shoulder_width: { type: ["number", "null"] },
                        body_length: { type: ["number", "null"] },
                        sleeve_length: { type: ["number", "null"] }
                      },
                      required: [
                        "waist",
                        "inseam",
                        "rise",
                        "thigh_width",
                        "hem_width",
                        "body_width",
                        "shoulder_width",
                        "body_length",
                        "sleeve_length"
                      ]
                    },
                    snippets: {
                      type: "object",
                      additionalProperties: false,
                      properties: {
                        waist: { type: ["string", "null"] },
                        inseam: { type: ["string", "null"] },
                        rise: { type: ["string", "null"] },
                        thigh_width: { type: ["string", "null"] },
                        hem_width: { type: ["string", "null"] },
                        body_width: { type: ["string", "null"] },
                        shoulder_width: { type: ["string", "null"] },
                        body_length: { type: ["string", "null"] },
                        sleeve_length: { type: ["string", "null"] }
                      },
                      required: [
                        "waist",
                        "inseam",
                        "rise",
                        "thigh_width",
                        "hem_width",
                        "body_width",
                        "shoulder_width",
                        "body_length",
                        "sleeve_length"
                      ]
                    }
                  },
                  required: ["sizeLabel", "values", "snippets"]
                }
              }
            },
            required: ["measurements"]
          }
        }
      }
    })
  });

  if (!response.ok) {
    return { result: current, usedLlmFallback: false };
  }

  const payload = (await response.json()) as {
    output_text?: string;
  };

  if (!payload.output_text) {
    return { result: current, usedLlmFallback: false };
  }

  const parsed = JSON.parse(payload.output_text) as {
    measurements: Array<{
      sizeLabel: string;
      values: Partial<Record<MeasurementField, number | null>>;
      snippets: Partial<Record<MeasurementField, string | null>>;
    }>;
  };

  const merged = current.measurements.map((measurement) => {
    const llmMatch = parsed.measurements.find((entry) => entry.sizeLabel === measurement.sizeLabel);

    if (!llmMatch) {
      return measurement;
    }

    const next = { ...measurement };

    for (const field of allFields()) {
      const currentValue = readField(next, field);
      const llmValue = llmMatch.values[field];
      const llmSnippet = llmMatch.snippets[field];

      if (currentValue == null && llmValue != null) {
        writeField(next, field, llmValue);
        next.sourceSnippet[field] = llmSnippet ?? "LLM fallback";
        next.confidence[field] = 0.54;
      }
    }

    next.missingFields = expectedFields(next.category).filter((field) => readField(next, field) == null);
    return next;
  });

  return {
    result: {
      ...current,
      measurements: merged,
      extractionNotes: [...current.extractionNotes, "llm:fallback"]
    },
    usedLlmFallback: true
  };
}

export async function analyzeProduct(sourceUrl: string, html: string): Promise<ProductAnalysisResult> {
  const ruleBased = extractProductData(sourceUrl, html);
  const { result, usedLlmFallback } = await maybeFillWithLlm(ruleBased, html);

  return {
    title: result.title,
    brand: result.brand,
    sourceUrl,
    category: result.category,
    summary: result.summary,
    measurements: result.measurements,
    extractionNotes: result.extractionNotes,
    usedLlmFallback
  };
}

function buildMeasurement(
  sourceUrl: string,
  sizeLabel: string,
  category: GarmentCategory,
  materialPreset: MaterialPreset,
  tables: Array<Record<MeasurementField, Candidate>>,
  textCandidates: Record<MeasurementField, Candidate>
): ProductMeasurement {
  const tableMatch: Partial<Record<MeasurementField, Candidate>> =
    tables.find((row) => row.body_length || row.waist) ?? {};
  const record = {
    category,
    sizeLabel,
    waist: valueFrom(tableMatch.waist ?? textCandidates.waist),
    inseam: valueFrom(tableMatch.inseam ?? textCandidates.inseam),
    rise: valueFrom(tableMatch.rise ?? textCandidates.rise),
    thighWidth: valueFrom(tableMatch.thigh_width ?? textCandidates.thigh_width),
    hemWidth: valueFrom(tableMatch.hem_width ?? textCandidates.hem_width),
    bodyWidth: valueFrom(tableMatch.body_width ?? textCandidates.body_width),
    shoulderWidth: valueFrom(tableMatch.shoulder_width ?? textCandidates.shoulder_width),
    bodyLength: valueFrom(tableMatch.body_length ?? textCandidates.body_length),
    sleeveLength: valueFrom(tableMatch.sleeve_length ?? textCandidates.sleeve_length),
    materialPreset,
    sourceUrl,
    sourceSnippet: snippetsFrom(tableMatch, textCandidates),
    confidence: confidenceFrom(tableMatch, textCandidates),
    missingFields: [] as MeasurementField[]
  };

  record.missingFields = expectedFields(category).filter((field) => readField(record, field) == null);
  return record;
}

function valueFrom(candidate?: Candidate) {
  return candidate?.value ?? null;
}

function snippetsFrom(
  tableMatch: Partial<Record<MeasurementField, Candidate>>,
  textCandidates: Record<MeasurementField, Candidate>
) {
  const result: Partial<Record<MeasurementField, string>> = {};

  for (const field of allFields()) {
    const candidate = tableMatch[field] ?? textCandidates[field];
    if (candidate) {
      result[field] = candidate.snippet;
    }
  }

  return result;
}

function confidenceFrom(
  tableMatch: Partial<Record<MeasurementField, Candidate>>,
  textCandidates: Record<MeasurementField, Candidate>
) {
  const result: Partial<Record<MeasurementField, number>> = {};

  for (const field of allFields()) {
    const candidate = tableMatch[field] ?? textCandidates[field];
    if (candidate) {
      result[field] = candidate.confidence;
    }
  }

  return result;
}

function extractTableCandidates($: cheerio.CheerioAPI) {
  const rows: Array<Record<MeasurementField, Candidate>> = [];

  $("table").each((_, table) => {
    const headers = $(table)
      .find("tr")
      .first()
      .find("th,td")
      .map((__, cell) => normalizeText($(cell).text()))
      .get();

    $(table)
      .find("tr")
      .slice(1)
      .each((__, row) => {
        const cells = $(row).find("th,td");
        const candidateRow = {} as Record<MeasurementField, Candidate>;

        cells.each((cellIndex, cell) => {
          const header = headers[cellIndex] ?? "";
          const value = normalizeText($(cell).text());
          const matched = FIELD_ALIASES.find((entry) =>
            entry.aliases.some((alias) => header.includes(alias))
          );
          const number = extractMeasurementValue(value);

          if (matched && number != null) {
            candidateRow[matched.field] = {
              value: number,
              snippet: `${header}: ${value}`,
              confidence: 0.88
            };
          }
        });

        if (Object.keys(candidateRow).length) {
          rows.push(candidateRow);
        }
      });
  });

  return rows;
}

function extractTextCandidates(text: string) {
  const candidates = {} as Record<MeasurementField, Candidate>;

  for (const config of FIELD_ALIASES) {
    for (const alias of config.aliases) {
      const expression = new RegExp(`${alias}[：:\\s]*([0-9]+(?:\\.[0-9]+)?)\\s*(?:cm|CM|ｃｍ)?`, "i");
      const match = text.match(expression);

      if (match) {
        const value = Number.parseFloat(match[1]);
        candidates[config.field] = {
          value,
          snippet: text.slice(Math.max(match.index ?? 0, 0), Math.min((match.index ?? 0) + 32, text.length)),
          confidence: 0.72
        };
        break;
      }
    }
  }

  return candidates;
}

function collectSizeLabels($: cheerio.CheerioAPI, text: string) {
  const labels = new Set<string>();

  $('*[class*="size"], *[id*="size"]').each((_, element) => {
    const value = normalizeText($(element).text());
    if (/^(xxs|xs|s|m|l|xl|xxl)$/i.test(value)) {
      labels.add(value.toUpperCase());
    }
  });

  const matches = text.match(/\b(XXS|XS|S|M|L|XL|XXL)\b/g);
  for (const item of matches ?? []) {
    labels.add(item);
  }

  if (!labels.size) {
    labels.add("M");
  }

  return [...labels].slice(0, 4);
}

function readTitle($: cheerio.CheerioAPI) {
  const meta = $('meta[property="og:title"]').attr("content");
  const heading = $("h1").first().text();
  return normalizeText(meta || heading || $("title").text() || "商品");
}

function readBrand($: cheerio.CheerioAPI) {
  const candidates = [
    $('meta[property="product:brand"]').attr("content"),
    $('meta[name="brand"]').attr("content"),
    $('[class*="brand"]').first().text()
  ];

  return normalizeText(candidates.find(Boolean) || "");
}

function guessCategory(text: string): GarmentCategory {
  return /(パンツ|デニム|スラックス|トラウザー|ショーツ|shorts|pants)/i.test(text)
    ? "pants"
    : "tops";
}

function guessMaterialPreset(text: string): MaterialPreset {
  if (/(ハリ|ブロード|オックス|硬め)/i.test(text)) {
    return "structured";
  }

  if (/(落ち感|ドレープ|レーヨン|とろみ)/i.test(text)) {
    return "draped";
  }

  if (/(厚手|裏毛|ヘビー|ウール)/i.test(text)) {
    return "heavy";
  }

  return "standard";
}

function extractMeasurementValue(value: string) {
  const match = value.match(/([0-9]+(?:\.[0-9]+)?)/);
  return match ? Number.parseFloat(match[1]) : null;
}

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function buildLlmPrompt(current: RawExtraction, html: string) {
  return [
    "You extract garment size measurements from Japanese e-commerce pages.",
    "Return only missing measurements for each size label.",
    `Category: ${current.category}`,
    `Known title: ${current.title}`,
    `Known sizes: ${current.measurements.map((item) => item.sizeLabel).join(", ")}`,
    `Missing fields: ${current.measurements
      .map((item) => `${item.sizeLabel}:${item.missingFields.join(",")}`)
      .join(" | ")}`,
    "Use centimeters only.",
    html.slice(0, 18000)
  ].join("\n");
}

function expectedFields(category: GarmentCategory) {
  return category === "pants" ? PANTS_FIELDS : TOPS_FIELDS;
}

function allFields(): MeasurementField[] {
  return [...TOPS_FIELDS, ...PANTS_FIELDS.filter((field) => !TOPS_FIELDS.includes(field))];
}

function readField(measurement: ProductMeasurement, field: MeasurementField) {
  switch (field) {
    case "waist":
      return measurement.waist;
    case "inseam":
      return measurement.inseam;
    case "rise":
      return measurement.rise;
    case "thigh_width":
      return measurement.thighWidth;
    case "hem_width":
      return measurement.hemWidth;
    case "body_width":
      return measurement.bodyWidth;
    case "shoulder_width":
      return measurement.shoulderWidth;
    case "body_length":
      return measurement.bodyLength;
    case "sleeve_length":
      return measurement.sleeveLength;
  }
}

function writeField(measurement: ProductMeasurement, field: MeasurementField, value: number) {
  switch (field) {
    case "waist":
      measurement.waist = value;
      break;
    case "inseam":
      measurement.inseam = value;
      break;
    case "rise":
      measurement.rise = value;
      break;
    case "thigh_width":
      measurement.thighWidth = value;
      break;
    case "hem_width":
      measurement.hemWidth = value;
      break;
    case "body_width":
      measurement.bodyWidth = value;
      break;
    case "shoulder_width":
      measurement.shoulderWidth = value;
      break;
    case "body_length":
      measurement.bodyLength = value;
      break;
    case "sleeve_length":
      measurement.sleeveLength = value;
      break;
  }
}
