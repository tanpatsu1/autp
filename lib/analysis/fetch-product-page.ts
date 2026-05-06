const DEFAULT_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
  "Accept-Language": "ja,en-US;q=0.9,en;q=0.8"
};

export async function fetchProductPage(url: string) {
  const response = await fetch(url, {
    headers: DEFAULT_HEADERS,
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error(`商品ページの取得に失敗しました: ${response.status}`);
  }

  const html = await response.text();

  if (!html.trim()) {
    throw new Error("商品ページのHTMLが空でした。");
  }

  return html;
}
