import { describe, expect, it } from "vitest";

import { extractProductData } from "../lib/analysis/extractor";

describe("extractProductData", () => {
  it("extracts a tops size table from regular product HTML", () => {
    const result = extractProductData(
      "https://example.test/products/oxford-shirt",
      `
        <html>
          <head>
            <title>Oxford Shirt</title>
            <meta property="product:brand" content="AUTP Lab" />
          </head>
          <body>
            <h1>Oxford Shirt</h1>
            <table>
              <tr><th>サイズ</th><th>着丈</th><th>身幅</th><th>肩幅</th><th>袖丈</th></tr>
              <tr><td>S</td><td>68</td><td>53</td><td>45</td><td>60</td></tr>
              <tr><td>M</td><td>70</td><td>55</td><td>47</td><td>61</td></tr>
            </table>
          </body>
        </html>
      `
    );

    expect(result.extractionStatus).toBe("complete");
    expect(result.confidenceSummary.quality).toBe("high");
    expect(result.measurements).toHaveLength(2);
    expect(result.measurements.find((item) => item.sizeLabel === "M")?.bodyWidth).toBe(55);
  });

  it("extracts pants measurements from embedded JSON", () => {
    const result = extractProductData(
      "https://example.test/products/wide-pants",
      `
        <html>
          <body>
            <h1>Wide Pants</h1>
            <script type="application/json">
              {
                "sizes": [
                  { "size": "S", "waist": 76, "rise": 30, "inseam": 70, "thighWidth": 33, "hemWidth": 24 },
                  { "size": "M", "waist": 80, "rise": 31, "inseam": 72, "thighWidth": 34, "hemWidth": 25 }
                ]
              }
            </script>
          </body>
        </html>
      `,
      ["fetch:desktop:html:1200", "server_fetch:static_html_only"]
    );

    const medium = result.measurements.find((item) => item.sizeLabel === "M");

    expect(result.category).toBe("pants");
    expect(result.extractionStatus).toBe("complete");
    expect(result.siteLimitations).toContain(
      "現在のURL取得は静的HTMLが対象です。クリック後やログイン後に出る採寸表は拾えません。"
    );
    expect(medium?.waist).toBe(80);
    expect(medium?.hemWidth).toBe(25);
  });

  it("extracts pseudo-table measurements from definition lists", () => {
    const result = extractProductData(
      "manual:size-text",
      `
        <section>
          <h1>Basic T-shirt</h1>
          <dl>
            <dt>着丈</dt><dd>66cm</dd>
            <dt>身幅</dt><dd>52cm</dd>
            <dt>肩幅</dt><dd>44cm</dd>
            <dt>袖丈</dt><dd>22cm</dd>
          </dl>
        </section>
      `
    );

    expect(result.extractionStatus).toBe("complete");
    expect(result.measurements[0].sizeLabel).toBe("M");
    expect(result.measurements[0].sleeveLength).toBe(22);
  });

  it("uses pasted size text as the manual recovery path", () => {
    const result = extractProductData(
      "manual:size-text",
      "<section>Tシャツ サイズ M 着丈 68 身幅 54 肩幅 46 袖丈 23</section>",
      ["manual:size_text"]
    );

    expect(result.extractionStatus).toBe("complete");
    expect(result.confidenceSummary.completionRatio).toBe(100);
    expect(result.siteLimitations).toContain("貼り付けたサイズ表テキストをURL取得結果より優先して補完しています。");
    expect(result.measurements[0].bodyLength).toBe(68);
  });

  it("returns a failed result with useful limitations for blocked or JS-rendered pages", () => {
    const result = extractProductData(
      "https://example.test/products/blocked",
      "<html><body><h1>Access denied</h1><p>Enable JavaScript to continue.</p></body></html>",
      ["fetch:desktop:html:82", "server_fetch:static_html_only"],
      ["ページ本文がブロック/認証/JavaScript必須ページに見えます。表示後のサイズ表は貼り付け欄で補完してください。"]
    );

    expect(result.extractionStatus).toBe("failed");
    expect(result.confidenceSummary.quality).toBe("low");
    expect(result.extractionAlternatives.join(" ")).toContain("サイズ表");
    expect(result.siteLimitations).toContain(
      "JavaScript描画後に出るサイズ表は、現在のサーバー取得だけでは拾えない場合があります。"
    );
  });
});
