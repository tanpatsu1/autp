const DEFAULT_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
  "Accept-Language": "ja,en-US;q=0.9,en;q=0.8",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Cache-Control": "no-cache",
  Pragma: "no-cache"
};

const MOBILE_HEADERS = {
  ...DEFAULT_HEADERS,
  "User-Agent":
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1"
};

export type ProductPageFetchResult = {
  html: string;
  notes: string[];
  blockers: string[];
};

export async function fetchProductPage(url: string): Promise<ProductPageFetchResult> {
  const parsedUrl = new URL(url);
  const strategies = [
    { name: "desktop", target: parsedUrl, headers: DEFAULT_HEADERS },
    { name: "mobile", target: parsedUrl, headers: MOBILE_HEADERS },
    { name: "cache_bust", target: withCacheBust(parsedUrl), headers: DEFAULT_HEADERS },
    { name: "clean_url", target: cleanTrackingParams(parsedUrl), headers: DEFAULT_HEADERS }
  ];
  const attempts: ProductPageFetchResult[] = [];
  const errors: string[] = [];

  for (const strategy of strategies) {
    try {
      const result = await fetchWithStrategy(strategy.name, strategy.target, strategy.headers);
      attempts.push(result);
    } catch (error) {
      errors.push(`${strategy.name}:${error instanceof Error ? error.message : "failed"}`);
    }
  }

  const best = attempts.sort(scoreAttempt)[0];

  if (!best) {
    throw new Error(
      `商品ページを取得できませんでした。試した方法: ${strategies.map((strategy) => strategy.name).join(", ")}。${errors.join(" / ")}`
    );
  }

  return {
    ...best,
    notes: [
      ...best.notes,
      "server_fetch:static_html_only",
      `attempts:${strategies.length}`,
      ...errors.map((error) => `fetch_error:${error}`)
    ]
  };
}

async function fetchWithStrategy(
  name: string,
  target: URL,
  headers: Record<string, string>
): Promise<ProductPageFetchResult> {
  const response = await fetch(target.toString(), {
    headers,
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const html = await response.text();

  if (!html.trim()) {
    throw new Error("empty html");
  }

  const blockers: string[] = [];

  if (looksBlocked(html)) {
    blockers.push("ページ本文がブロック/認証/JavaScript必須ページに見えます。表示後のサイズ表は貼り付け欄で補完してください。");
  }

  return { html, notes: [`fetch:${name}:html:${html.length}`], blockers };
}

function looksBlocked(html: string) {
  return /access denied|forbidden|captcha|cloudflare|bot detection|enable javascript|ログインしてください|アクセスが集中|ただいま混み合って/i.test(
    html.slice(0, 20000)
  );
}

function scoreAttempt(a: ProductPageFetchResult, b: ProductPageFetchResult) {
  const aScore = a.html.length - a.blockers.length * 100000;
  const bScore = b.html.length - b.blockers.length * 100000;
  return bScore - aScore;
}

function withCacheBust(url: URL) {
  const next = new URL(url.toString());
  next.searchParams.set("_autp", String(Date.now()));
  return next;
}

function cleanTrackingParams(url: URL) {
  const next = new URL(url.origin + url.pathname);
  for (const [key, value] of url.searchParams.entries()) {
    if (!/^utm_|^(fbclid|gclid|yclid|mc_cid|mc_eid)$/i.test(key)) {
      next.searchParams.set(key, value);
    }
  }
  return next;
}
