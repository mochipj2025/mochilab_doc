# Character JSON Schema

Character Preset Maker と各Kitで共有するキャラクター設定JSONの基本形。

## 基本方針

- 呪文型Promptではなく、設計書型Promptとして扱う
- LoRAに頼らず、JSONと採用Prompt履歴で一貫性を育てる
- Image2.0向けの自然文Promptに展開しやすい粒度にする
- 医療的な効能、診断、強い広告表現は入れない
- 日本語ミニマル編集デザイン、静かな空気感、過剰演出しない方針を守る

## Schema

```json
{
  "character_id": "string",
  "name": "string",
  "version": "string",
  "visual_lock": {
    "proportion": "string",
    "hair": "string",
    "eyes": "string",
    "expression": "string",
    "accessories": "string",
    "outfit": "string"
  },
  "personality": ["string"],
  "world": {
    "place": "string",
    "light": "string",
    "tone": "string"
  },
  "scene_defaults": {
    "background": "string",
    "lighting": "string",
    "framing": "string",
    "style": "string",
    "output_type": "string"
  },
  "poem_seeds": ["string"],
  "avoid": ["string"],
  "notes": "string",
  "items": [],
  "adopted_prompts": [],
  "latest_prompt": "string"
}
```

## Field Notes

- `character_id`: ファイル名にも使える短いID。例: `akari_0020_cyber`
- `version`: キャラクター設定の版。最初は `1.0.0`
- `visual_lock`: 三面図、カード、漫画、LP素材で固定したい外見情報
- `personality`: 性格、趣味、ふるまいの核
- `world`: キャラが属する場所、光、空気感
- `scene_defaults`: Prompt生成時の標準背景、画風、構図、出力タイプ
- `poem_seeds`: 写真集、漫画、SNS素材で使える短い詩
- `avoid`: 毎回避ける表現や画作り
- `notes`: 運用メモ
- `items`: キャラに紐づく小物、衣装パーツ、背景アイテム、象徴物
- `latest_prompt`: Character Preset Makerで最後に生成したPrompt

## Items

アイテムは、キャラの一貫性を支える小さな設定資産として `items` へ追加する。

```json
{
  "item_id": "akari_0020_cyber_black_choker_001",
  "name": "黒いチョーカー",
  "category": "accessory",
  "visual_note": "細い黒革、中央に小さな銀色の金具、首元にぴったり沿う。",
  "usage_note": "キャラカードと三面図では必ず表示。写真集ではディテールカットに使う。",
  "prompt_note": "quiet black leather choker with a small silver clasp, understated design",
  "avoid": [
    "派手な宝石",
    "大きな装飾"
  ],
  "image_ref": "",
  "notes": ""
}
```

カテゴリは最初は `accessory`、`outfit_part`、`prop`、`background_item`、`symbol`、`vehicle`、`other` を使う。

## Adopted Prompt History

採用Promptは、後から良い出力を再現しやすくするために `adopted_prompts` へ追加する。

```json
{
  "prompt_id": "akari_0020_cyber_card_001",
  "date": "2026-05-16",
  "kit": "Character Card Kit",
  "output_type": "キャラカード化",
  "prompt": "string",
  "result_note": "表情と衣装の一貫性が高い。カード用に採用。",
  "image_ref": ""
}
```

最初は空配列でよい。良い出力が出た時だけ、Kit名、用途、Prompt、結果メモを残す。
