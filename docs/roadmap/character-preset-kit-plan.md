# Character Preset Kit Plan

## Core Idea

Character Scene Prompt Maker は、単発Prompt生成ツールではなく、キャラクターJSONを中心に制作物へ展開するための母艦にする。

LoRAに頼らず、キャラJSON、世界観JSON、採用Prompt、出力タイプ別テンプレートでキャラクターの一貫性を運用する。

## Main Workflow

1. Character Preset Maker でキャラを作る
2. 良いキャラができたら JSON として保存
3. GPTフォルダ / characters に入れる
4. 各KitでJSONを読み込む
5. 出力タイプ別にPromptを生成する
6. 採用Promptを履歴として育てる

## Current Pages

- `index.html`
  - Character Preset Maker
  - キャラ作成
  - Prompt生成
  - JSON書き出し予定

- `kits/photobook.html`
  - Photo Book Kit
  - 写真集風ページPrompt

- `kits/manga.html`
  - Manga Scene Kit
  - 縦スクロール漫画Prompt

- `kits/card.html`
  - Character Card Kit
  - キャラカードPrompt

- `kits/three-view.html`
  - Three View Kit
  - 三面図Prompt

## Future Page

- `kits/lp-assets.html`
  - Landing Page Asset Kit
  - LP、OGP、noteサムネ、SNS画像Prompt
  - 未実装

## Next Implementation Tasks

1. `index.html` に「現在の設定をJSON化」ボタンを追加
2. JSONコピー機能を追加
3. JSON読み込み機能を追加
4. 各KitにJSONを貼って再利用する導線を整える
5. `kits/lp-assets.html` を追加
6. キャラJSON schema を docs に保存
7. 採用Prompt履歴の保存形式を決める
8. GPTフォルダ / Obsidian 側で characters / worlds / prompts を整理する

## Character JSON Should Include

- `character_id`
- `name`
- `version`
- `visual_lock`
  - `proportion`
  - `hair`
  - `eyes`
  - `expression`
  - `accessories`
  - `outfit`
- `personality`
- `world`
- `scene_defaults`
  - `background`
  - `lighting`
  - `framing`
  - `style`
  - `output_type`
- `poem_seeds`
- `avoid`
- `notes`
- `adopted_prompts`

## Example Character JSON

```json
{
  "character_id": "akari_0020_cyber",
  "name": "灯 / Akari",
  "version": "1.0.0",
  "visual_lock": {
    "proportion": "7頭身のすらっとしたバランス",
    "hair": "黒髪、ぱっつん寄りの前髪、肩付近の長さ",
    "eyes": "静かな目、暗い瞳",
    "expression": "無口で静かな表情",
    "accessories": "黒いチョーカー",
    "outfit": "黒いオーバーサイズの雨用ジャケット、黒い服、厚底ブーツ"
  },
  "personality": [
    "静かな性格",
    "観察が好き",
    "ひとりの時間を愛する"
  ],
  "world": {
    "place": "雨の夜のサイバー都市",
    "light": "青い都市光、小さな赤い光、濡れた路面反射",
    "tone": "暗く静か、湿度のある映画的な空気"
  },
  "scene_defaults": {
    "background": "雨の夜の街",
    "lighting": "青い都市光と濡れた路面反射",
    "framing": "全身、またはバストアップ",
    "style": "フォトリアル",
    "output_type": "1枚絵"
  },
  "poem_seeds": [
    "小さな光だけが、帰り道を覚えていた。"
  ],
  "avoid": [
    "漫画風",
    "品質呪文",
    "過剰な装飾",
    "強い広告表現"
  ],
  "notes": "LoRAなしでキャラJSONと採用Prompt履歴を育てる。",
  "adopted_prompts": []
}
```

## Kit Concepts

### Character Preset Maker

キャラクターを作る母艦。髪、目、表情、衣装、性格、世界観、出力タイプを構造化する。

今後は「Prompt生成」だけでなく「JSON書き出し」「JSON読み込み」を持たせる。

### Photo Book Kit

キャラJSONから写真集風ページを作る。

重視するもの:

- カット割り
- 余白
- 縦書き詩
- 紙面レイアウト
- ディテールカット
- 写真集の空気感

### Manga Scene Kit

キャラJSONから縦スクロール漫画Promptを作る。

重視するもの:

- 場面数
- 感情の流れ
- シーンの目的
- セリフ量
- 場面メモ
- 吹き出しを使いすぎない構成

### Character Card Kit

キャラJSONからキャラカードPromptを作る。

重視するもの:

- 名前
- 設定欄
- 大きなメインビジュアル
- ディテールカット
- 紙面の余白
- 日本語編集デザイン

### Three View Kit

キャラJSONから三面図Promptを作る。

重視するもの:

- 正面
- 横
- 背面
- 同じ髪型
- 同じ衣装
- 同じ体格
- 設定資料として見やすい構成

### Landing Page Asset Kit

未実装。LP、OGP、noteサムネ、SNS画像などを作る。

想定する出力:

- LPヒーロー画像
- ファーストビュー背景
- セクション背景
- サービス紹介ビジュアル
- キャラクター案内画像
- CTA画像
- OGP画像
- noteサムネイル
- SNS告知画像
- バナー

## Philosophy

- 呪文型Promptではなく、設計書型Prompt
- Image2.0向けの自然文
- LoRAを前提にしない
- キャラをJSON資産として育てる
- 1枚絵、三面図、キャラカード、漫画、写真集、LP素材へ展開する
- 日本語ミニマル編集デザイン
- 静かな空気感
- 過剰演出しない
- キャラJSON + 採用画像 + 出力テンプレートで統一感を作る

## Next Chat Prompt

次のチャットでは、以下のように伝えると続きから再開できる。

```txt
docs/roadmap/character-preset-kit-plan.md を読んで、Character Preset Maker の JSON書き出し / JSON読み込み機能から続けてください。
```
