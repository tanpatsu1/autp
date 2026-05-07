import * as cheerio from "cheerio";

import { classifyGarment } from "@/lib/analysis/garment-classifier";
import { readMeasurementField } from "@/lib/measurement-fields";
import type {
  GarmentCategory,
  GarmentType,
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

type TextCandidateMap = Partial<Record<MeasurementField, Candidate>>;

type TableRowCandidate = {
  sizeLabel: string | null;
  fields: TextCandidateMap;
};

type RawExtraction = {
  title: string;
  brand: string;
  category: GarmentCategory;
  garmentType: GarmentType;
  garmentTypeConfidence: number;
  garmentTypeEvidence: string[];
  summary: string;
  measurements: ProductMeasurement[];
  extractionNotes: string[];
  extractionStatus: ProductAnalysisResult["extractionStatus"];
  extractionBlockers: string[];
  extractionAlternatives: string[];
  confidenceSummary: ProductAnalysisResult["confidenceSummary"];
  siteLimitations: string[];
};

const FIELD_ALIASES: FieldAlias[] = [
  { field: "body_length", aliases: ["着丈", "身丈", "総丈", "後身丈", "前身丈", "着用丈", "length"] },
  { field: "body_width", aliases: ["身幅", "胸囲", "バスト", "胸幅", "chest", "width"] },
  { field: "shoulder_width", aliases: ["肩幅", "shoulder"] },
  { field: "sleeve_length", aliases: ["袖丈", "裄丈", "ゆき丈", "sleeve"] },
  { field: "waist", aliases: ["ウエスト", "胴囲", "waist"] },
  { field: "rise", aliases: ["股上", "rise"] },
  { field: "inseam", aliases: ["股下", "レングス", "inseam", "length"] },
  { field: "thigh_width", aliases: ["わたり", "渡り幅", "もも幅", "腿幅", "thigh"] },
  { field: "hem_width", aliases: ["裾幅", "裾口", "裾口幅", "hem"] }
];

const EXTRA_FIELD_ALIASES: FieldAlias[] = [
  { field: "body_length", aliases: ["着丈", "身丈", "総丈", "後身丈", "前身丈", "着用丈", "body length", "bodyLength", "back length"] },
  { field: "body_width", aliases: ["身幅", "胸囲", "バスト", "胸幅", "胸まわり", "身巾", "body width", "bodyWidth", "chest width"] },
  { field: "shoulder_width", aliases: ["肩幅", "肩巾", "shoulder width", "shoulderWidth"] },
  { field: "sleeve_length", aliases: ["袖丈", "裄丈", "ゆき丈", "袖口", "sleeve length", "sleeveLength"] },
  { field: "waist", aliases: ["ウエスト", "腰囲", "胴囲"] },
  { field: "rise", aliases: ["股上", "前股上", "後股上"] },
  { field: "inseam", aliases: ["股下", "レングス", "パンツ丈"] },
  { field: "thigh_width", aliases: ["わたり", "渡り幅", "もも幅", "腿幅", "ワタリ", "thigh width", "thighWidth"] },
  { field: "hem_width", aliases: ["裾幅", "裾口", "裾口幅", "すそ幅", "hem width", "hemWidth"] }
];

const ALL_FIELD_ALIASES = [...FIELD_ALIASES, ...EXTRA_FIELD_ALIASES];

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

const SIZE_SECTION_HINTS = [
  "アイテムサイズ",
  "サイズ詳細",
  "サイズ表",
  "採寸",
  "実寸",
  "寸法",
  "size guide",
  "size chart",
  "measurements"
];

export async function analyzeProduct(
  sourceUrl: string,
  html: string,
  fetchNotes: string[] = [],
  fetchBlockers: string[] = []
): Promise<ProductAnalysisResult> {
  const result = extractProductData(sourceUrl, html, fetchNotes, fetchBlockers);

  return {
    title: result.title,
    brand: result.brand,
    sourceUrl,
    category: result.category,
    garmentType: result.garmentType,
    garmentTypeConfidence: result.garmentTypeConfidence,
    garmentTypeEvidence: result.garmentTypeEvidence,
    summary: result.summary,
    measurements: result.measurements,
    extractionNotes: result.extractionNotes,
    extractionMode: "rule_based",
    extractionStatus: result.extractionStatus,
    extractionBlockers: result.extractionBlockers,
    extractionAlternatives: result.extractionAlternatives,
    confidenceSummary: result.confidenceSummary,
    siteLimitations: result.siteLimitations
  };
}

export function extractProductData(
  sourceUrl: string,
  html: string,
  fetchNotes: string[] = [],
  fetchBlockers: string[] = []
): RawExtraction {
  const $ = cheerio.load(html);
  const richText = collectSearchText($);
  const title = readTitle($);
  const brand = readBrand($);
  const classification = classifyGarment(`${sourceUrl} ${title} ${brand} ${richText}`);
  let category = classification.category;
  const materialPreset = guessMaterialPreset(richText);
  const tableRows = extractTableCandidates($);
  tableRows.push(...extractStructuredCandidates($));
  tableRows.push(...extractKeyValueCandidates($));
  tableRows.push(...extractSizeBlockCandidates(richText));
  const textCandidates = extractTextCandidates(richText);
  category = categoryFromExtractedFields(tableRows, textCandidates) ?? category;
  const garmentType =
    classification.garmentType === "unknown" && category === "pants" ? "pants" : classification.garmentType;
  const garmentTypeConfidence =
    classification.garmentType === "unknown" && garmentType !== "unknown" ? 0.55 : classification.confidence;
  const garmentTypeEvidence =
    classification.garmentType === "unknown" && garmentType !== "unknown"
      ? ["measurement fields"]
      : classification.evidence;
  const sizeLabels = collectSizeLabels($, richText, tableRows);

  const measurements = sizeLabels.map((sizeLabel) =>
    buildMeasurement(sourceUrl, sizeLabel, category, garmentType, materialPreset, tableRows, textCandidates)
  );
  const expected = expectedFields(category);
  const bestFilledCount = Math.max(
    0,
    ...measurements.map(
      (measurement) => expected.filter((field) => readMeasurementField(measurement, field) != null).length
    )
  );
  const blockers = [...fetchBlockers];

  if (!tableRows.length && !Object.keys(textCandidates).length) {
    blockers.push("HTML内にサイズ表らしいテーブルや採寸テキストを見つけられませんでした。");
  }

  if (richText.length < 500) {
    blockers.push("取得できた本文が短く、商品情報がJavaScript描画後に出るサイトの可能性があります。");
  }

  if (garmentType === "unknown") {
    blockers.push("商品名やページ本文から服種を判定できませんでした。画面上で服種を手動選択してください。");
  }

  const extractionStatus = bestFilledCount === expected.length ? "complete" : bestFilledCount ? "partial" : "failed";
  const bestMeasurement = pickBestMeasurement(measurements, expected);
  const confidenceSummary = buildConfidenceSummary(bestMeasurement, expected, extractionStatus);
  const siteLimitations = buildSiteLimitations(fetchNotes, blockers);

  return {
    title,
    brand,
    category,
    garmentType,
    garmentTypeConfidence,
    garmentTypeEvidence,
    summary: richText.slice(0, 360),
    measurements,
    extractionStatus,
    extractionBlockers: blockers,
    extractionAlternatives: buildAlternatives(extractionStatus, blockers),
    confidenceSummary,
    siteLimitations,
    extractionNotes: [
      ...fetchNotes,
      tableRows.length ? `table_rows:${tableRows.length}` : "table_rows:none",
      `text_fields:${Object.keys(textCandidates).length}`,
      `sizes:${sizeLabels.join(", ")}`,
      `garment:${garmentType}:${garmentTypeConfidence.toFixed(2)}`,
      `status:${extractionStatus}`,
      `confidence:${confidenceSummary.quality}:${confidenceSummary.completionRatio}`,
      "extractor:html_hidden_json_tables"
    ]
  };
}

function buildMeasurement(
  sourceUrl: string,
  sizeLabel: string,
  category: GarmentCategory,
  garmentType: GarmentType,
  materialPreset: MaterialPreset,
  tableRows: TableRowCandidate[],
  textCandidates: TextCandidateMap
): ProductMeasurement {
  const tableMatch = pickBestTableRow(sizeLabel, tableRows);
  const record: ProductMeasurement = {
    category,
    garmentType,
    sizeLabel,
    waist: valueFrom(tableMatch.fields.waist ?? textCandidates.waist),
    inseam: valueFrom(tableMatch.fields.inseam ?? textCandidates.inseam),
    rise: valueFrom(tableMatch.fields.rise ?? textCandidates.rise),
    thighWidth: valueFrom(tableMatch.fields.thigh_width ?? textCandidates.thigh_width),
    hemWidth: valueFrom(tableMatch.fields.hem_width ?? textCandidates.hem_width),
    bodyWidth: valueFrom(tableMatch.fields.body_width ?? textCandidates.body_width),
    shoulderWidth: valueFrom(tableMatch.fields.shoulder_width ?? textCandidates.shoulder_width),
    bodyLength: valueFrom(tableMatch.fields.body_length ?? textCandidates.body_length),
    sleeveLength: valueFrom(tableMatch.fields.sleeve_length ?? textCandidates.sleeve_length),
    materialPreset,
    sourceUrl,
    sourceSnippet: snippetsFrom(tableMatch.fields, textCandidates),
    confidence: confidenceFrom(tableMatch.fields, textCandidates),
    missingFields: []
  };

  record.missingFields = expectedFields(category).filter(
    (field) => readMeasurementField(record, field) == null
  );

  return record;
}

function pickBestTableRow(sizeLabel: string, rows: TableRowCandidate[]) {
  const normalizedLabel = normalizeSizeLabel(sizeLabel);
  return (
    rows.find((row) => row.sizeLabel && normalizeSizeLabel(row.sizeLabel) === normalizedLabel) ??
    rows.find((row) => row.sizeLabel == null) ??
    rows[0] ?? { sizeLabel: null, fields: {} }
  );
}

function extractTableCandidates($: cheerio.CheerioAPI) {
  const rows: TableRowCandidate[] = [];

  $("table").each((_, table) => {
    const matrix: string[][] = [];

    $(table)
      .find("tr")
      .each((__, row) => {
        const cells = $(row)
          .find("th,td")
          .map((___, cell) => normalizeText($(cell).text()))
          .get();

        if (cells.length) {
          matrix.push(cells);
        }
      });

    rows.push(...extractRowsByFieldHeaders(matrix));
    rows.push(...extractRowsBySizeHeaders(matrix));
  });

  return rows;
}

function extractStructuredCandidates($: cheerio.CheerioAPI) {
  const rows: TableRowCandidate[] = [];

  $("script").each((_, element) => {
    const scriptText = ($(element).html() ?? "").trim();
    if (!scriptText || scriptText.length > 500000) {
      return;
    }

    for (const jsonText of collectJsonFragments(scriptText)) {
      try {
        walkJson(JSON.parse(jsonText), rows);
      } catch {
        // Ignore non-JSON scripts; text extraction handles them separately.
      }
    }
  });

  $("[data-size],[data-sizes],[data-product],[data-json],[data-props],[data-state]").each((_, element) => {
    for (const value of Object.values(element.attribs ?? {})) {
      const trimmed = normalizeText(value);
      if (!trimmed) {
        continue;
      }

      for (const jsonText of collectJsonFragments(trimmed)) {
        try {
          walkJson(JSON.parse(jsonText), rows);
        } catch {
          rows.push(rowFromText(trimmed, 0.72, "data attribute"));
        }
      }
    }
  });

  return rows.filter((row) => Object.keys(row.fields).length);
}

function extractKeyValueCandidates($: cheerio.CheerioAPI) {
  const rows: TableRowCandidate[] = [];
  const dlRow: TableRowCandidate = { sizeLabel: null, fields: {} };

  $("dl").each((_, dl) => {
    const terms = $(dl).find("dt").toArray();
    const descriptions = $(dl).find("dd").toArray();

    terms.forEach((term, index) => {
      const key = normalizeText($(term).text());
      const value = normalizeText($(descriptions[index]).text());
      mergeFields(dlRow.fields, rowFromText(`${key}: ${value}`, 0.86, "definition list").fields);
    });
  });

  if (Object.keys(dlRow.fields).length) {
    rows.push(dlRow);
  }

  $("li,p,div,span").each((_, element) => {
    const text = normalizeText($(element).text());
    if (text.length < 4 || text.length > 320) {
      return;
    }

    const row = rowFromText(text, 0.7, "text block");
    if (Object.keys(row.fields).length >= 2) {
      rows.push(row);
    }
  });

  return rows;
}

function extractSizeBlockCandidates(text: string) {
  const rows: TableRowCandidate[] = [];
  const sizePattern = /\b(XXS|XS|S|M|L|XL|XXL|\d{2,3})\b/gi;
  const matches = [...text.matchAll(sizePattern)].filter((match) => {
    const index = match.index ?? 0;
    const label = match[1];
    const previousText = text.slice(Math.max(0, index - 16), index);
    const nextText = text.slice(index, index + 220);
    const numericSizeIsExplicit = /^\d/.test(label) && /(size|サイズ|号|inch|インチ)\s*$/i.test(previousText);

    if (/^\d/.test(label) && !numericSizeIsExplicit) {
      return false;
    }

    return ALL_FIELD_ALIASES.some((entry) =>
      entry.aliases.some((alias) => nextText.toLowerCase().includes(alias.toLowerCase()))
    );
  });

  matches.forEach((match, index) => {
    const start = match.index ?? 0;
    const end = matches[index + 1]?.index ?? Math.min(start + 520, text.length);
    const sizeLabel = extractSizeLabel(match[1]);
    const row = rowFromText(text.slice(start, end), 0.8, "size block");

    if (sizeLabel && Object.keys(row.fields).length) {
      rows.push({ ...row, sizeLabel });
    }
  });

  return rows;
}

function rowFromText(text: string, confidence: number, source: string): TableRowCandidate {
  const fields: TextCandidateMap = {};

  for (const config of ALL_FIELD_ALIASES) {
    for (const alias of config.aliases) {
      if (isAmbiguousAlias(alias)) {
        continue;
      }

      const patterns = [
        new RegExp(`${escapeForRegex(alias)}\\s*(?:\\(|（)?\\s*(?:cm|CM)?\\s*(?:\\)|）)?\\s*[:：/／\\-]?\\s*([0-9]+(?:\\.[0-9]+)?)\\s*(?:cm|CM|センチ)?`, "i"),
        new RegExp(`${escapeForRegex(alias)}[^0-9]{0,18}([0-9]+(?:\\.[0-9]+)?)\\s*(?:cm|CM|センチ)?`, "i")
      ];

      for (const pattern of patterns) {
        const match = pattern.exec(text);
        if (!match) {
          continue;
        }

        const value = Number.parseFloat(match[1]);
        if (!isReasonableMeasurement(value)) {
          continue;
        }

        setCandidate(fields, config.field, {
          value,
          snippet: `${source}: ${text.slice(0, 180)}`,
          confidence
        });
      }
    }
  }

  return {
    sizeLabel: extractSizeLabel(text),
    fields
  };
}

function walkJson(value: unknown, rows: TableRowCandidate[]) {
  if (Array.isArray(value)) {
    value.forEach((item) => walkJson(item, rows));
    return;
  }

  if (!value || typeof value !== "object") {
    return;
  }

  const record = value as Record<string, unknown>;
  const row: TableRowCandidate = { sizeLabel: null, fields: {} };

  for (const [key, item] of Object.entries(record)) {
    const keyText = normalizeText(key);
    const field = detectFieldFromText(keyText);

    if (/^(size|サイズ|label|name)$/i.test(keyText) && typeof item !== "object") {
      row.sizeLabel = extractSizeLabel(String(item)) ?? row.sizeLabel;
    }

    if (field) {
      const numeric = extractMeasurementValue(String(item));
      if (numeric != null && isReasonableMeasurement(numeric)) {
        setCandidate(row.fields, field, {
          value: numeric,
          snippet: `json:${keyText}: ${String(item).slice(0, 80)}`,
          confidence: 0.88
        });
      }
    }

    walkJson(item, rows);
  }

  if (Object.keys(row.fields).length) {
    rows.push(row);
  }
}

function collectJsonFragments(text: string) {
  const fragments: string[] = [];
  const trimmed = text.trim();

  if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
    fragments.push(trimmed);
  }

  for (const match of text.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    fragments.push(match[1]);
  }

  const nextData = /self\.__next_f\.push\(\[.*?,"([\s\S]*?)"\]\)/.exec(text);
  if (nextData?.[1]) {
    fragments.push(nextData[1].replace(/\\"/g, '"'));
  }

  return [...new Set(fragments)];
}

function extractRowsByFieldHeaders(matrix: string[][]) {
  if (matrix.length < 2) {
    return [];
  }

  const headers = matrix[0];
  const headerMap = headers.map((header) => detectFieldFromText(header));
  const sizeColumnIndex = detectSizeColumnIndex(headers);
  const rows: TableRowCandidate[] = [];

  for (const cells of matrix.slice(1)) {
    const candidate: TableRowCandidate = { sizeLabel: null, fields: {} };

    cells.forEach((cellText, cellIndex) => {
      if (sizeColumnIndex === cellIndex) {
        candidate.sizeLabel = extractSizeLabel(cellText);
      }

      const field = headerMap[cellIndex];
      const numeric = extractMeasurementValue(cellText);

      if (field && numeric != null && isReasonableMeasurement(numeric)) {
        candidate.fields[field] = {
          value: numeric,
          snippet: `${headers[cellIndex]}: ${cellText}`,
          confidence: 0.92
        };
      }
    });

    candidate.sizeLabel ??= extractSizeLabel(cells[0] ?? "");

    if (Object.keys(candidate.fields).length) {
      rows.push(candidate);
    }
  }

  return rows;
}

function extractRowsBySizeHeaders(matrix: string[][]) {
  if (matrix.length < 2) {
    return [];
  }

  const headers = matrix[0];
  const sizeColumns = headers.map(extractSizeLabel);

  if (sizeColumns.filter(Boolean).length < 2) {
    return [];
  }

  const rowsBySize = new Map<string, TableRowCandidate>();

  for (const cells of matrix.slice(1)) {
    const field = detectFieldFromText(cells[0] ?? "");
    if (!field) {
      continue;
    }

    cells.forEach((cellText, cellIndex) => {
      const sizeLabel = sizeColumns[cellIndex];
      const numeric = extractMeasurementValue(cellText);

      if (!sizeLabel || numeric == null || !isReasonableMeasurement(numeric)) {
        return;
      }

      const row = rowsBySize.get(sizeLabel) ?? { sizeLabel, fields: {} };
      row.fields[field] = {
        value: numeric,
        snippet: `${cells[0]} ${sizeLabel}: ${cellText}`,
        confidence: 0.92
      };
      rowsBySize.set(sizeLabel, row);
    });
  }

  return [...rowsBySize.values()];
}

function extractTextCandidates(text: string) {
  const candidates: TextCandidateMap = {};

  for (const config of ALL_FIELD_ALIASES) {
    for (const alias of config.aliases) {
      if (isAmbiguousAlias(alias)) {
        continue;
      }

      const patterns = [
        new RegExp(`${escapeForRegex(alias)}\\s*[:：/／・\\-]?\\s*([0-9]+(?:\\.[0-9]+)?)\\s*(?:cm|CM)?`, "i"),
        new RegExp(`${escapeForRegex(alias)}[^0-9]{0,16}([0-9]+(?:\\.[0-9]+)?)\\s*(?:cm|CM)?`, "i")
      ];

      for (const pattern of patterns) {
        const match = pattern.exec(text);
        if (!match) {
          continue;
        }

        const value = Number.parseFloat(match[1]);
        if (!isReasonableMeasurement(value)) {
          continue;
        }
        const snippetStart = Math.max((match.index ?? 0) - 20, 0);
        const snippetEnd = Math.min((match.index ?? 0) + match[0].length + 28, text.length);

        setCandidate(candidates, config.field, {
          value,
          snippet: text.slice(snippetStart, snippetEnd),
          confidence: 0.76
        });
        break;
      }

      if (candidates[config.field]) {
        break;
      }
    }
  }

  return candidates;
}

function collectSearchText($: cheerio.CheerioAPI) {
  const chunks: string[] = [];

  chunks.push($("body").text());
  chunks.push(
    $("meta")
      .map((_, element) => $(element).attr("content") ?? "")
      .get()
      .join(" ")
  );

  $("[aria-label],[title],[data-size],[data-sizes],[data-product],[data-gtm],[data-json]").each((_, element) => {
    const attributes = element.attribs ?? {};
    chunks.push(Object.values(attributes).join(" "));
  });

  $("script").each((_, element) => {
    const scriptText = $(element).html() ?? "";
    if (scriptText.length > 300000) {
      return;
    }
    if (
      SIZE_SECTION_HINTS.some((hint) => scriptText.toLowerCase().includes(hint.toLowerCase())) ||
      ALL_FIELD_ALIASES.some((entry) =>
        entry.aliases.some((alias) => scriptText.toLowerCase().includes(alias.toLowerCase()))
      )
    ) {
      chunks.push(scriptText);
    }
  });

  return normalizeText(chunks.join(" ").replace(/\\u003c|\\u003e|\\n|\\t/g, " "));
}

function collectSizeLabels($: cheerio.CheerioAPI, text: string, tableRows: TableRowCandidate[]) {
  const labels = new Set<string>();

  for (const row of tableRows) {
    if (row.sizeLabel) {
      labels.add(normalizeSizeLabel(row.sizeLabel));
    }
  }

  $('*[class*="size" i], *[id*="size" i], option').each((_, element) => {
    const label = extractSizeLabel(normalizeText($(element).text()));
    if (label) {
      labels.add(normalizeSizeLabel(label));
    }
  });

  const matches = text.match(/\b(XXS|XS|S|M|L|XL|XXL)\b/g);
  for (const item of matches ?? []) {
    const label = extractSizeLabel(item);
    if (label) {
      labels.add(normalizeSizeLabel(label));
    }
  }

  if (!labels.size) {
    labels.add("M");
  }

  return [...labels].slice(0, 8);
}

function buildAlternatives(status: ProductAnalysisResult["extractionStatus"], blockers: string[]) {
  if (status === "complete") {
    return ["主要な採寸項目は自動取得できました。気になる数値だけ商品ページと照合してください。"];
  }

  const alternatives = [
    "商品ページの「アイテムサイズ」や「サイズ表」欄だけをコピーして手動補完欄に貼ると、URL全体のブロックを避けられます。",
    "ブランド公式のサイズガイドURLが別にある場合は、そのURLで再解析してください。",
    "ページがログイン/年齢確認/地域制限/在庫選択後に表示するタイプなら、現状のサーバー自動取得では限界です。ブラウザ拡張かブックマークレットで表示後DOMを送る方式が次の自動化候補です。"
  ];

  if (blockers.length) {
    alternatives.unshift("今回はサイト側のブロックやJavaScript描画の可能性が高いため、自動取得は部分結果として扱ってください。");
  }

  return alternatives;
}

function pickBestMeasurement(measurements: ProductMeasurement[], expected: MeasurementField[]) {
  return [...measurements].sort(
    (a, b) =>
      expected.filter((field) => readMeasurementField(b, field) != null).length -
      expected.filter((field) => readMeasurementField(a, field) != null).length
  )[0];
}

function buildConfidenceSummary(
  measurement: ProductMeasurement | undefined,
  expected: MeasurementField[],
  status: ProductAnalysisResult["extractionStatus"]
): ProductAnalysisResult["confidenceSummary"] {
  const filledFields = expected.filter((field) => measurement && readMeasurementField(measurement, field) != null);
  const missingFields = expected.filter((field) => !filledFields.includes(field));
  const completionRatio = expected.length ? Math.round((filledFields.length / expected.length) * 100) : 0;
  const quality = status === "complete" ? "high" : status === "partial" ? "medium" : "low";

  return {
    expectedFields: expected,
    filledFields,
    missingFields,
    completionRatio,
    quality,
    message: confidenceMessage(quality, filledFields.length, expected.length)
  };
}

function confidenceMessage(
  quality: ProductAnalysisResult["confidenceSummary"]["quality"],
  filledCount: number,
  expectedCount: number
) {
  if (quality === "high") {
    return `主要採寸 ${filledCount}/${expectedCount} 件を取得。商品ページとの最終照合だけ行ってください。`;
  }

  if (quality === "medium") {
    return `主要採寸 ${filledCount}/${expectedCount} 件を取得。不足項目は貼り付けテキストか手入力で補ってください。`;
  }

  return "採寸値を取得できていません。サイズ表テキストの貼り付けを主導線として使ってください。";
}

function buildSiteLimitations(fetchNotes: string[], blockers: string[]) {
  const limitations = new Set<string>();
  const joined = [...fetchNotes, ...blockers].join(" ").toLowerCase();

  if (/fetch_error|http 403|http 401|forbidden|access denied|captcha|cloudflare|bot detection/.test(joined)) {
    limitations.add("サイト側のブロックや認証で、サーバー取得できない可能性があります。");
  }

  if (/javascript|本文が短く|enable javascript/.test(joined)) {
    limitations.add("JavaScript描画後に出るサイズ表は、現在のサーバー取得だけでは拾えない場合があります。");
  }

  if (/manual:size_text/.test(joined)) {
    limitations.add("貼り付けたサイズ表テキストをURL取得結果より優先して補完しています。");
  }

  if (/server_fetch:static_html_only/.test(joined)) {
    limitations.add("現在のURL取得は静的HTMLが対象です。クリック後やログイン後に出る採寸表は拾えません。");
  }

  if (!limitations.size) {
    limitations.add("URL取得はサイト仕様に左右されます。重要な数値は商品ページと照合してください。");
  }

  return [...limitations];
}

function readTitle($: cheerio.CheerioAPI) {
  const meta = $('meta[property="og:title"]').attr("content");
  const heading = $("h1").first().text();
  return normalizeText(meta || heading || $("title").text() || "商品");
}

function readBrand($: cheerio.CheerioAPI) {
  const structured = $('script[type="application/ld+json"]')
    .map((_, element) => normalizeText($(element).html() || ""))
    .get()
    .join(" ");

  const candidates = [
    $('meta[property="product:brand"]').attr("content"),
    $('meta[name="brand"]').attr("content"),
    $('[class*="brand" i]').first().text(),
    /"brand"\s*:\s*"([^"]+)"/.exec(structured)?.[1]
  ];

  return normalizeText(candidates.find(Boolean) || "");
}

export function guessCategory(text: string): GarmentCategory {
  return /(パンツ|デニム|スラックス|トラウザー|ショーツ|pants|jeans|slacks|trousers|shorts)/i.test(text)
    ? "pants"
    : "tops";
}

function guessMaterialPreset(text: string): MaterialPreset {
  if (/(ハリ|ブロード|オックス|厚手|しっかり|structured)/i.test(text)) {
    return "structured";
  }

  if (/(落ち感|ドレープ|レーヨン|とろみ|drape)/i.test(text)) {
    return "draped";
  }

  if (/(裏毛|ヘビー|ウール|heavy|wool)/i.test(text)) {
    return "heavy";
  }

  return "standard";
}

function detectSizeColumnIndex(headers: string[]) {
  const index = headers.findIndex((header) => /(サイズ|size)/i.test(header));
  return index >= 0 ? index : 0;
}

function detectFieldFromText(text: string) {
  const normalizedText = normalizeAliasKey(text);
  const exact = ALL_FIELD_ALIASES.find((entry) =>
    entry.aliases.some((alias) => normalizeAliasKey(alias) === normalizedText)
  );

  if (exact) {
    return exact.field;
  }

  return (
    ALL_FIELD_ALIASES.find((entry) =>
      entry.aliases.some((alias) => !isAmbiguousAlias(alias) && normalizedText.includes(normalizeAliasKey(alias)))
    )?.field ?? null
  );
}

function extractSizeLabel(value: string) {
  const normalized = normalizeText(value);
  const alpha = normalized.match(/\b(XXS|XS|S|M|L|XL|XXL)\b/i);
  if (alpha) {
    return alpha[1].toUpperCase();
  }

  const numeric = normalized.match(/^(?:サイズ|SIZE)?\s*(\d{2,3})$/i);
  return numeric ? numeric[1] : null;
}

function normalizeSizeLabel(value: string) {
  return value.trim().toUpperCase();
}

function extractMeasurementValue(value: string) {
  const match = value.match(/([0-9]+(?:\.[0-9]+)?)/);
  return match ? Number.parseFloat(match[1]) : null;
}

function valueFrom(candidate?: Candidate) {
  return candidate?.value ?? null;
}

function setCandidate(fields: TextCandidateMap, field: MeasurementField, candidate: Candidate) {
  const current = fields[field];
  if (!current || candidate.confidence >= current.confidence) {
    fields[field] = candidate;
  }
}

function mergeFields(target: TextCandidateMap, source: TextCandidateMap) {
  for (const [field, candidate] of Object.entries(source) as Array<[MeasurementField, Candidate]>) {
    setCandidate(target, field, candidate);
  }
}

function isReasonableMeasurement(value: number) {
  return Number.isFinite(value) && value > 0 && value <= 300;
}

function isAmbiguousAlias(alias: string) {
  return /^(length|width)$/i.test(alias);
}

function snippetsFrom(tableFields: TextCandidateMap, textCandidates: TextCandidateMap) {
  const result: Partial<Record<MeasurementField, string>> = {};

  for (const field of allFields()) {
    const candidate = tableFields[field] ?? textCandidates[field];
    if (candidate) {
      result[field] = candidate.snippet;
    }
  }

  return result;
}

function confidenceFrom(tableFields: TextCandidateMap, textCandidates: TextCandidateMap) {
  const result: Partial<Record<MeasurementField, number>> = {};

  for (const field of allFields()) {
    const candidate = tableFields[field] ?? textCandidates[field];
    if (candidate) {
      result[field] = candidate.confidence;
    }
  }

  return result;
}

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeAliasKey(value: string) {
  return value.toLowerCase().replace(/[\s_\-]/g, "");
}

function escapeForRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function expectedFields(category: GarmentCategory) {
  return category === "pants" ? PANTS_FIELDS : TOPS_FIELDS;
}

function categoryFromExtractedFields(
  rows: TableRowCandidate[],
  textCandidates: TextCandidateMap
): GarmentCategory | null {
  const fields = new Set<MeasurementField>(Object.keys(textCandidates) as MeasurementField[]);

  for (const row of rows) {
    for (const field of Object.keys(row.fields) as MeasurementField[]) {
      fields.add(field);
    }
  }

  const pantsCount = PANTS_FIELDS.filter((field) => fields.has(field)).length;
  const topsCount = TOPS_FIELDS.filter((field) => fields.has(field)).length;

  if (pantsCount >= 2 && pantsCount > topsCount) {
    return "pants";
  }

  if (topsCount >= 2 && topsCount > pantsCount) {
    return "tops";
  }

  return null;
}

function allFields(): MeasurementField[] {
  return [...TOPS_FIELDS, ...PANTS_FIELDS.filter((field) => !TOPS_FIELDS.includes(field))];
}
