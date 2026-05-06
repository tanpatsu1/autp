import { NextResponse } from "next/server";

import { analyzeProduct } from "@/lib/analysis/extractor";
import { fetchProductPage } from "@/lib/analysis/fetch-product-page";

type AnalyzeRequest = {
  url?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalyzeRequest;

    if (!body.url) {
      return NextResponse.json({ error: "URLを入力してください。" }, { status: 400 });
    }

    const html = await fetchProductPage(body.url);
    const result = await analyzeProduct(body.url, html);

    return NextResponse.json({ result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "解析に失敗しました。";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
