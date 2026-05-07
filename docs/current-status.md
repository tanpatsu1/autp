# Current Status

## Phase
- Current: MVP extraction reliability hardening
- Last completed: 抽出信頼度/取得制限メタ情報、UI表示、抽出fixture回帰テストの追加
- Next: 実サイトURLのサンプルセットで抽出率を測り、サイト別の失敗パターンを記録

## Route Decision
- Decision: 04_Implementation 完了、次は 05_Review
- Reason: HTML table / JSON / dl疑似表 / 手動貼り付け / ブロック失敗を回帰テスト化し、UIで信頼度とサーバー取得制限を説明できるようにしたため

## Open Issues
- High: 実サイトごとのサイズ取得精度はまだサンプル検証が必要
- Medium: サーバーfetchでは、ログイン後/クリック後/地域制限後にだけ出る採寸表は取得できない
- Low: 履歴の重複整理、削除、上書き保存は未実装

## Next Prompt
- Target thread: 05_Review
- Prompt source: `lib/analysis/extractor.ts`, `components/fit-studio-sections.tsx`, `components/avatar-stage.tsx`, `__tests__/extractor.test.ts`

## Updated
- 2026-05-08
