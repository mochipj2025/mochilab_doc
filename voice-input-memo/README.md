# Voice Input Memo

Windowsローカルで動く、リアルタイム音声入力からMarkdownメモを作る小さなツールです。

録音管理アプリではありません。音声ファイルを残すことではなく、話した内容をその場で順次文字起こしし、日時ベースのMarkdownファイルとして保存することを目的にしています。

## 場所

- WebUI版: `dev/web_app.py`
- 旧Tkinter版: `dev/voice_input_memo.py`

## できること

- ブラウザから音声入力を開始する
- ブラウザから音声入力を停止する
- 録音中にローカルサーバーで順次文字起こしする
- 停止後にMarkdownとして保存する
- 保存先フォルダを選ぶ
- 日時ベースのファイル名でMarkdown保存する
- もちスラの小さな案内表示
- 音声ファイルを保存しない
- 処理に必要な一時音声ファイルは処理後に削除する

## 使い方

かんたんに起動する場合は、以下のファイルをダブルクリックします。

```txt
start-voice-input-memo.bat
```

初回は仮想環境と依存関係を準備するため、少し時間がかかります。

PowerShellでこのフォルダへ移動し、依存関係を入れます。

```powershell
cd "C:\Users\yasut\Documents\New project 2\voice-input-memo"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r dev\requirements.txt
python dev\web_app.py
```

初回はWhisperモデルの準備に時間がかかることがあります。2回目以降は通常速くなります。

## Markdown出力

```md
# 音声入力メモ

日付：2026-05-17 10:30
タグ：

## 本文

ここに文字起こし結果が入ります。

## 要約


## 使えそうな形

```

## Notes

- `dev/` は開発中の試作品です。
- 一時音声ファイルはOSの一時フォルダへ作成し、文字起こし後に削除します。
- Markdownの初期保存先は `D:\00000\M.O.C.H.I. LABO_Vault` です。
- 長時間録音はメモリ使用量が増えるため、まずは短いメモから試してください。
