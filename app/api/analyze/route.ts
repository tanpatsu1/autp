import { NextResponse } from "next/server";

import { analyzeProduct } from "@/lib/analysis/extractor";
import { fetchProductPage } from "@/lib/analysis/fetch-product-page";

type AnalyzeRequest = {
  url?: string;
  sizeText?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalyzeRequest;

    if (!body.url && !body.sizeText?.trim()) {
      return NextResponse.json({ error: "商品URLまたはサイズ欄テキストを入力してください。" }, { status: 400 });
    }

    const textHtml = body.sizeText?.trim() ? `<section>${escapeHtml(body.sizeText)}</section>` : "";
    const sourceUrl = body.url || "manual:size-text";
    let page = { html: textHtml, notes: ["manual:size_text"], blockers: [] as string[] };

    if (body.url) {
      try {
        const fetched = await fetchProductPage(body.url);
        page = {
          html: `${fetched.html}${textHtml}`,
          notes: [...fetched.notes, ...(textHtml ? ["manual:size_text"] : [])],
          blockers: fetched.blockers
        };
      } catch (error) {
        if (!textHtml) {
          throw error;
        }

        page.blockers.push("URL取得に失敗したため、貼り付けたサイズ欄だけを解析しました。");
      }
    }

    const result = await analyzeProduct(sourceUrl, page.html, page.notes, page.blockers);

    return NextResponse.json({ result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "解析に失敗しました。";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
