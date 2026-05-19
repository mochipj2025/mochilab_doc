import datetime as dt
import ctypes
import json
import mimetypes
import os
import tempfile
import threading
import time
import webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote

from faster_whisper import WhisperModel


APP_DIR = Path(__file__).resolve().parents[1]
WEB_DIR = APP_DIR / "web"
ASSET_DIR = APP_DIR / "assets"
DEFAULT_SAVE_DIR = Path(r"D:\00000\M.O.C.H.I. LABO_Vault")
HOST = "127.0.0.1"
PORT = 8765
MODEL_SIZE = "base"

model: WhisperModel | None = None
model_lock = threading.Lock()
save_dir = DEFAULT_SAVE_DIR


def get_model() -> WhisperModel:
    global model
    with model_lock:
        if model is None:
            model = WhisperModel(MODEL_SIZE, device="cpu", compute_type="int8")
        return model


def build_markdown(body: str, title: str = "音声入力メモ", tags: str = "") -> str:
    now = dt.datetime.now()
    clean_body = body.strip() or "（文字起こし結果が空でした）"
    clean_title = title.strip() or "音声入力メモ"
    clean_tags = tags.strip()
    return (
        f"# {clean_title}\n\n"
        f"日付：{now.strftime('%Y-%m-%d %H:%M')}\n"
        f"タグ：{clean_tags}\n\n"
        "## 本文\n\n"
        f"{clean_body}\n\n"
        "## 要約\n\n"
        "\n"
        "## 使えそうな形\n"
    )


def unique_markdown_path(directory: Path) -> Path:
    directory.mkdir(parents=True, exist_ok=True)
    stem = dt.datetime.now().strftime("voice-memo-%Y%m%d-%H%M%S")
    output_path = directory / f"{stem}.md"
    index = 2
    while output_path.exists():
        output_path = directory / f"{stem}-{index}.md"
        index += 1
    return output_path


def trigger_windows_dictation() -> None:
    def press_shortcut() -> None:
        time.sleep(0.25)
        user32 = ctypes.windll.user32
        keyeventf_keyup = 0x0002
        vk_lwin = 0x5B
        vk_h = 0x48

        user32.keybd_event(vk_lwin, 0, 0, 0)
        user32.keybd_event(vk_h, 0, 0, 0)
        user32.keybd_event(vk_h, 0, keyeventf_keyup, 0)
        user32.keybd_event(vk_lwin, 0, keyeventf_keyup, 0)

    threading.Thread(target=press_shortcut, daemon=True).start()


class VoiceMemoHandler(BaseHTTPRequestHandler):
    server_version = "VoiceInputMemoWeb/0.1"

    def do_GET(self) -> None:
        if self.path == "/":
            self.serve_file(WEB_DIR / "index.html")
            return
        if self.path.startswith("/web/"):
            self.serve_file(WEB_DIR / unquote(self.path.removeprefix("/web/")))
            return
        if self.path.startswith("/assets/"):
            self.serve_file(ASSET_DIR / unquote(self.path.removeprefix("/assets/")))
            return
        if self.path == "/api/config":
            self.send_json({"saveDir": str(save_dir)})
            return
        self.send_error(404)

    def do_POST(self) -> None:
        if self.path == "/api/start-windows-dictation":
            self.handle_start_windows_dictation()
            return
        if self.path == "/api/transcribe":
            self.handle_transcribe()
            return
        if self.path == "/api/save":
            self.handle_save()
            return
        if self.path == "/api/save-dir":
            self.handle_save_dir()
            return
        self.send_error(404)

    def handle_start_windows_dictation(self) -> None:
        try:
            trigger_windows_dictation()
            self.send_json({"ok": True})
        except Exception as exc:
            self.send_json({"error": str(exc)}, status=500)

    def handle_transcribe(self) -> None:
        length = int(self.headers.get("Content-Length", "0"))
        if length <= 0:
            self.send_json({"text": ""}, status=400)
            return

        audio = self.rfile.read(length)
        temp_path: str | None = None
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp_file:
                temp_file.write(audio)
                temp_path = temp_file.name

            segments, _ = get_model().transcribe(temp_path, language="ja", vad_filter=True)
            text = "\n".join(segment.text.strip() for segment in segments if segment.text.strip()).strip()
            self.send_json({"text": text})
        except Exception as exc:
            self.send_json({"error": str(exc)}, status=500)
        finally:
            if temp_path and os.path.exists(temp_path):
                try:
                    os.remove(temp_path)
                except OSError:
                    pass

    def handle_save(self) -> None:
        data = self.read_json()
        body = str(data.get("body", ""))
        title = str(data.get("title", "音声入力メモ"))
        tags = str(data.get("tags", ""))
        directory = Path(str(data.get("saveDir") or save_dir)).expanduser()
        markdown = build_markdown(body, title=title, tags=tags)
        try:
            output_path = unique_markdown_path(directory)
            output_path.write_text(markdown, encoding="utf-8")
            self.send_json({"path": str(output_path), "markdown": markdown})
        except Exception as exc:
            self.send_json({"error": str(exc)}, status=500)

    def handle_save_dir(self) -> None:
        global save_dir
        data = self.read_json()
        requested = Path(str(data.get("saveDir", ""))).expanduser()
        if not str(requested).strip():
            self.send_json({"error": "保存先が空です。"}, status=400)
            return
        save_dir = requested
        self.send_json({"saveDir": str(save_dir)})

    def read_json(self) -> dict:
        length = int(self.headers.get("Content-Length", "0"))
        if length <= 0:
            return {}
        raw = self.rfile.read(length).decode("utf-8")
        return json.loads(raw or "{}")

    def serve_file(self, path: Path) -> None:
        resolved = path.resolve()
        allowed_roots = (WEB_DIR.resolve(), ASSET_DIR.resolve())
        if not any(resolved == root or root in resolved.parents for root in allowed_roots):
            self.send_error(403)
            return
        if not resolved.exists() or not resolved.is_file():
            self.send_error(404)
            return
        content_type = mimetypes.guess_type(str(resolved))[0] or "application/octet-stream"
        data = resolved.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def send_json(self, payload: dict, status: int = 200) -> None:
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, format: str, *args) -> None:
        return


def main() -> None:
    server = ThreadingHTTPServer((HOST, PORT), VoiceMemoHandler)
    url = f"http://{HOST}:{PORT}"
    print(f"Voice Input Memo WebUI: {url}")
    webbrowser.open(url)
    server.serve_forever()


if __name__ == "__main__":
    main()
