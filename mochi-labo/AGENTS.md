# AGENTS.md

このリポジトリで作業するAI開発アシスタント向けの共通ルールです。

## Core Rules

- `stable/` フォルダは壊さない
- `experimental/` は実験用として扱う
- UIはモバイルファーストで設計する
- 日本語可読性を優先する
- 医療的表現は禁止する
- 過度な広告デザインは禁止する
- ミニマルで静かなデザインを維持する

## Design Philosophy

- Minimal Japanese editorial design
- Mobile-first
- Calm atmosphere
- Large negative space
- Warm and trustworthy tone

## Writing Style

- Quiet emotional tone
- Avoid aggressive marketing
- Avoid medical claims
- Prioritize readability

## Development Rules

- 既存の構造と命名を尊重する
- 変更は小さく、意図が追いやすい単位にする
- Preserve responsive layout
- Prefer reusable structures
- Avoid breaking stable versions
- Keep components modular

## Brand Mood

- Deep-sea clinical
- Industrial chic
- Soft lighting
- Calm Japanese editorial aesthetic

## プロジェクトの軸

- AI × Care × Design
- 日本語ミニマルUI
- モバイルファースト
- 再利用可能なテンプレ構造

## 日本語UI方針

- 日本語UIでは短く、やさしく、意味が明確な文言を優先する
- モバイル表示を基準にしてから、デスクトップへ広げる
- 汎用化できる要素は `shared-assets/` や各テンプレートの `stable/` に整理する

## ディレクトリの使い分け

- `stable/`: 再利用可能で安定したテンプレートや成果物
- `dev/`: 開発中、検証中のテンプレートやメモ
- `experimental/`: 研究色が強く、仕様変更の可能性が高いもの
- `assets/`: 各プロジェクト固有の素材
- `shared-assets/`: 複数プロジェクトで共有する素材

## UI設計メモ

- 余白、文字量、状態表示を丁寧に扱う
- 装飾よりも読みやすさと安心感を優先する
- ボタンや入力欄は指で操作しやすいサイズにする
- 初見でも迷わないラベルを使う
