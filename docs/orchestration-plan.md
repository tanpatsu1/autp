# Orchestration Plan

## 基本フロー
1. `git fetch origin` 後に `origin/main` を見て差分を把握する
2. `docs/current-status.md` と関連ファイルを読んで現在地を確認する
3. 1 スレッド 1 目的で実装する
4. 実装後に `npm run verify` を実行する
5. PR 着手前に再度 `origin/main` を見て競合がない状態で push する

## スレッドの分け方
- 設定確認
- 抽出改善
- UI 改善
- レビュー修正

変更範囲とアプリ実装範囲は分け、PR に載せる内容を細く保つ。

## 競合回避
- ブランチごとに 1 テーマだけ扱う
- PR が長引く場合は早めに `main` を取り込む
- `rerere` を前提にせず、競合は都度内容を確認して解消する

## 完了条件
- 実装目的が 1 文で言える
- `npm run verify` が通る
- `docs/current-status.md` を更新している
