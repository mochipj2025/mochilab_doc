# Character Preset Kit Work Log

Character Preset Maker を、単発Prompt生成ツールではなくキャラJSONを中心に制作物へ展開する母艦へ育てるための作業ログ。

## 2026-05-16

### 実装したこと

- `index.html` にキャラJSON機能を追加
  - 現在の設定をJSON化
  - JSONコピー
  - JSON読み込み
  - Kit用に保存
- 各Kitに `母艦から読み込む` 導線を追加
  - `kits/photobook.html`
  - `kits/manga.html`
  - `kits/card.html`
  - `kits/three-view.html`
- `kits/lp-assets.html` を追加
  - LPヒーロー画像
  - OGP画像
  - noteサムネイル
  - SNS告知画像
  - バナー
- `docs/character-json-schema.md` を追加
  - キャラJSON schema
  - 採用Prompt履歴形式

### 方針

- 呪文型Promptではなく、設計書型Promptとして扱う
- LoRAに頼らず、JSON、採用Prompt、出力タイプ別Kitで一貫性を運用する
- 医療表現、強い広告表現、過剰演出は避ける
- 日本語ミニマル編集デザインと静かな空気感を守る

## 2026-05-17

### 実装したこと

- `kits/prompt-admin.html` を追加
  - キャラJSONを読み込む
  - 採用Promptを `adopted_prompts` に追加
  - 更新済みJSONをコピー
  - 更新済みJSONをKit用に保存
- Prompt Admin に `items` 管理を追加
  - 小物
  - 衣装パーツ
  - 背景アイテム
  - 象徴物
  - Prompt用メモ
  - 避ける表現
- Prompt Admin のUIを迷いにくく整理
  - Step 1: キャラJSONを読む
  - Step 2: 追加するものを選ぶ
  - 採用Prompt / アイテムのタブ切り替え
  - JSON欄を折りたたみに移動
  - 現在のキャラ、Prompt件数、Item件数、最近の保存内容を表示
- `docs/character-json-schema.md` に `items` の保存形式を追記
- `docs/roadmap/character-preset-kit-plan.md` に Prompt Admin と `items` を反映

### 現在のワークフロー

1. `index.html` の Character Preset Maker でキャラを作る
2. 現在の設定をJSON化する
3. `Kit用に保存` する
4. 各Kitで `母艦から読み込む`
5. Promptを生成し、画像制作に使う
6. 良かったPromptだけ Prompt Admin に保存する
7. 小物、衣装パーツ、象徴物が固まったら Prompt Admin の `items` に追加する
8. 更新済みJSONをコピーまたは `Kit用に保存` する

### 確認したこと

- `index.html` でJSON生成とKit用保存が動く
- `kits/lp-assets.html` で母艦JSONを読み込める
- `kits/prompt-admin.html` で採用Promptを `adopted_prompts` に追加できる
- `kits/prompt-admin.html` でアイテムを `items` に追加できる
- Prompt Admin のタブ切り替えが動く
- Prompt Admin のインラインJavaScript構文チェックはOK

### 次の候補

- 各Kitの生成結果から Prompt Admin へ採用候補を送る導線を作る
- `items` を各KitのPrompt生成に自然に含める
- `world` を別JSONとして分離するか検討する
- characters / worlds / prompts の保存フォルダ構成を決める
- `docs/roadmap/character-preset-kit-plan.md` の古い「未実装」表現を完全に整理する

## 再開メモ

次に再開するときは、以下を読む。

- `docs/roadmap/character-preset-kit-plan.md`
- `docs/roadmap/character-preset-kit-work-log.md`
- `docs/character-json-schema.md`

次の実装に入るなら、まずは「各Kitから Prompt Admin へ採用候補を送る導線」からが自然。
