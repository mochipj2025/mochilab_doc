# Voice Input Memo UI Design

## Design Goal

深夜2時に、考えごとを静かに置いておける音声入力メモ。

派手な録音アプリではなく、声から生まれた文章を読み返すための、小さな研究ノート UI にする。

## Core Feeling

- 静か
- 暗い
- 読める
- 急かさない
- 少しだけあたたかい
- 素材は主役にしない

## Design Principle

1. 本文が主役
2. 録音操作は大きくしすぎない
3. キャラクターは案内役として小さく置く
4. 装飾画像は 1 画面に 2 種類まで
5. 白い面を強く出しすぎない
6. 線を増やさず、余白で区切る
7. 通知は目立たせず、消える前提にする

## Visual Direction

### Base

- 背景: 深海ネイビー
- メイン面: 少し沈んだ紙色
- 文字: 生成り白 / 暗い紙上では濃紺
- 差し色: ランタンの弱い橙、くすんだシアン、真鍮

### Avoid

- 強い白カード
- 大きいキャラクター画像
- 複数の囲み線
- 光るグロー
- 大きいヒーロー
- 素材を並べる見本帳感

## Layout

### Mobile First

1. Header
   - アプリ名を小さく表示
   - 大きなキャッチコピーは置かない

2. Recording Area
   - 状態表示
   - 小さい波形
   - 録音ボタン
   - もちスラはここだけに置く

3. Memo Draft
   - 画面の主役
   - 紙色は暗めの antique beige
   - 余白を広めにして、本文を読みやすくする

4. Tags
   - メモ下部に控えめに置く
   - chip は同一デザインで統一

5. Archive
   - 画面下部に折りたたみ気味
   - 本棚 UI は小さなリスト表現に留める

6. Save Notification
   - 右下または下部に小さく
   - もちスラ画像を使う場合は 24-32px

### Desktop

- 左 sidebar は細くする
- 中央に memo draft
- 右側に recording status と archive
- 大きなヒーロー画像は置かない

## Component Rules

### Sidebar

役割: 場所の気配を出す。

- 幅は狭く
- nav は 3-4 項目まで
- ランタン素材は使わないか、使う場合は 32px 程度
- 背景と近い色で沈める

### Recording Button

役割: 声を置く入口。

- メインボタンは 1 つ
- 録音中のみ muted orange を使う
- 大きい円形ボタンにはしない
- `ui-record-glow.png` は薄く敷く場合のみ

### Waveform Area

役割: 今聞いている感じを伝える。

- `ui-waveform-idle.png`
- `ui-waveform-active.png`
- 高さは 48-72px
- アニメーションは微弱
- 波形を主役にしない

### Memo Card

役割: 主役。

- `ui-card-paper.png` は背景テクスチャとして 4-8% 程度
- 文字量が増えても読みやすいことを優先
- 枠線より余白で区切る
- Markdown preview らしい行間

### Tag Area

役割: メモの整理。

- `ui-tag-chip-wide.png` は使いすぎない
- 全 chip の高さと色を統一
- 画像 chip と CSS chip を混在させない

### Archive Shelf

役割: 保管先の安心感。

- 本棚を絵で大きく出さない
- 古い研究ノートの棚ラベルとして表現
- 直近 3 件程度だけ見せる

### Character

役割: そっと案内する。

- もちスラ: recording area だけ
- 研究員: 空状態、またはヘルプだけ
- 同一画面で両方を大きく出さない
- キャラ画像は 48-80px まで

### Floating Save Notification

役割: 保存された安心感。

- 常時表示しない
- 高さ 44-52px
- 画面をふさがない
- 文字は「保存しました」程度

## Asset Usage

Use:

- `ui-mochisura-sticker.png`: 録音エリアの案内
- `ui-waveform-idle.png`: 待機中波形
- `ui-waveform-active.png`: 録音中波形
- `ui-card-paper.png`: メモカードの薄い紙テクスチャ
- `ui-tag-chip-wide.png`: chip の基準、または CSS 化の参照
- `ui-toast-saved-bg.png`: 保存通知背景
- `ui-researcher-sticker.png`: 空状態か補助コメント

Do not use together in first viewport:

- もちスラ大
- 研究員大
- 大きい背景画像
- 大きい保存通知

## First Implementation Plan

1. React UI を作る前にワイヤーフレームだけ作る
2. 画像なしで余白、色、本文カードを決める
3. 波形と録音ボタンを置く
4. もちスラを 1 箇所だけ足す
5. 保存通知を小さく足す
6. 最後に必要なら研究員を空状態に足す

## Success Criteria

- スクリーンショットを 3 秒見て、本文が最初に読める
- キャラクターよりメモ本文が目立つ
- 白い矩形が浮いて見えない
- 1 画面に素材が 2 種類以上主張しない
- iPhone 幅で窮屈に見えない
- 「静か」「深夜」「研究ノート」が伝わる

