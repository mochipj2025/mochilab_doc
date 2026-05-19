import datetime as dt
import os
import queue
import tempfile
import threading
import wave
from pathlib import Path
from tkinter import PhotoImage, Tk, StringVar, Text, filedialog, messagebox, ttk

import numpy as np
import sounddevice as sd
from faster_whisper import WhisperModel


APP_TITLE = "音声入力メモ"
SAMPLE_RATE = 16000
CHANNELS = 1
MODEL_SIZE = "base"
TRANSCRIBE_INTERVAL_SECONDS = 4.0
DEFAULT_SAVE_DIR = Path(r"D:\00000\M.O.C.H.I. LABO_Vault")
ASSET_DIR = Path(__file__).resolve().parents[1] / "assets"
MOCHISURA_IMAGE = ASSET_DIR / "ui-mochisura-sticker.png"
RESEARCHER_IMAGE = ASSET_DIR / "ui-researcher-sticker.png"
SOFT_LAB_BG_IMAGE = ASSET_DIR / "ui-bg-soft-lab.png"
CARD_PAPER_IMAGE = ASSET_DIR / "ui-card-paper.png"
TAG_CHIP_IMAGE = ASSET_DIR / "ui-tag-chip-wide.png"
RECORD_GLOW_IMAGE = ASSET_DIR / "ui-record-glow.png"
WAVEFORM_ACTIVE_IMAGE = ASSET_DIR / "ui-waveform-active.png"
WAVEFORM_IDLE_IMAGE = ASSET_DIR / "ui-waveform-idle.png"
TOAST_SAVED_IMAGE = ASSET_DIR / "ui-toast-saved-bg.png"
ASSET_MAX_SIZES = {
    SOFT_LAB_BG_IMAGE: (720, 44),
    CARD_PAPER_IMAGE: (520, 18),
    MOCHISURA_IMAGE: (52, 52),
    RESEARCHER_IMAGE: (46, 46),
    TAG_CHIP_IMAGE: (96, 28),
    RECORD_GLOW_IMAGE: (220, 26),
    WAVEFORM_ACTIVE_IMAGE: (148, 40),
    WAVEFORM_IDLE_IMAGE: (148, 40),
    TOAST_SAVED_IMAGE: (220, 56),
}


class VoiceInputMemoApp:
    def __init__(self, root: Tk) -> None:
        self.root = root
        self.root.title(APP_TITLE)
        self.root.geometry("840x680")
        self.root.minsize(420, 600)

        self.save_dir = StringVar(value=str(DEFAULT_SAVE_DIR))
        self.status = StringVar(value="保存先を選び、音声入力を開始できます。")
        self.recording_time = StringVar(value="00:00")
        self.record_state = StringVar(value="READY")
        self.selected_device = StringVar(value="")
        self.input_devices: list[dict] = []

        self.audio_chunks: list[np.ndarray] = []
        self.audio_lock = threading.Lock()
        self.transcribe_lock = threading.Lock()
        self.transcribed_lines: list[str] = []
        self.transcribe_thread: threading.Thread | None = None
        self.is_transcribing = False
        self.stream: sd.InputStream | None = None
        self.is_recording = False
        self.started_at: dt.datetime | None = None
        self.model: WhisperModel | None = None
        self.event_queue: queue.Queue[tuple[str, str]] = queue.Queue()
        self.mochisura_image: PhotoImage | None = None
        self.researcher_image: PhotoImage | None = None
        self.soft_lab_bg_image: PhotoImage | None = None
        self.card_paper_image: PhotoImage | None = None
        self.tag_chip_image: PhotoImage | None = None
        self.record_glow_image: PhotoImage | None = None
        self.waveform_active_image: PhotoImage | None = None
        self.waveform_idle_image: PhotoImage | None = None
        self.toast_saved_image: PhotoImage | None = None
        self.waveform_label: ttk.Label | None = None
        self.glow_label: ttk.Label | None = None
        self.toast_label: ttk.Label | None = None
        self.empty_accent_slot: ttk.Frame | None = None
        self.empty_accent: ttk.Frame | None = None

        self.build_ui()
        self.refresh_devices()
        self.root.after(200, self.consume_events)
        self.root.after(500, self.update_timer)

    def build_ui(self) -> None:
        self.root.configure(bg="#10252f")

        style = ttk.Style()
        style.theme_use("clam")
        style.configure("TFrame", background="#10252f")
        style.configure("Surface.TFrame", background="#172f39")
        style.configure("Card.TFrame", background="#efe7dc")
        style.configure("Paper.TFrame", background="#f8f2e8")
        style.configure("Soft.TFrame", background="#203944")
        style.configure("TLabel", background="#10252f", foreground="#e9ded0", font=("Yu Gothic UI", 10))
        style.configure("AppKicker.TLabel", background="#10252f", foreground="#8fa4a6", font=("Yu Gothic UI", 9))
        style.configure("AppTitle.TLabel", background="#10252f", foreground="#f3eadf", font=("Yu Gothic UI", 18, "bold"))
        style.configure("AppMuted.TLabel", background="#10252f", foreground="#b8c6c4", font=("Yu Gothic UI", 9))
        style.configure("Muted.TLabel", background="#10252f", foreground="#7f9598", font=("Yu Gothic UI", 9))
        style.configure("SoftMuted.TLabel", background="#203944", foreground="#c8d3cf", font=("Yu Gothic UI", 9))
        style.configure("CardTitle.TLabel", background="#efe7dc", foreground="#132a33", font=("Yu Gothic UI", 10, "bold"))
        style.configure("CardMuted.TLabel", background="#efe7dc", foreground="#677272", font=("Yu Gothic UI", 9))
        style.configure("CardImage.TLabel", background="#efe7dc")
        style.configure("PaperTitle.TLabel", background="#f8f2e8", foreground="#132a33", font=("Yu Gothic UI", 10, "bold"))
        style.configure("PaperMuted.TLabel", background="#f8f2e8", foreground="#6f7774", font=("Yu Gothic UI", 9))
        style.configure("PaperImage.TLabel", background="#f8f2e8")
        style.configure("Toast.TLabel", background="#10252f", foreground="#f8f2e8", font=("Yu Gothic UI", 10, "bold"))
        style.configure("Chip.TLabel", background="#efe7dc", foreground="#6c5b48", font=("Yu Gothic UI", 8, "bold"))
        style.configure("Character.TFrame", background="#efe7dc")
        style.configure("PaperCharacter.TFrame", background="#f8f2e8")
        style.configure("Badge.TLabel", background="#d6ded9", foreground="#132a33", font=("Yu Gothic UI", 9, "bold"), padding=(10, 5))
        style.configure("Timer.TLabel", background="#efe7dc", foreground="#132a33", font=("Consolas", 18))
        style.configure("TButton", font=("Yu Gothic UI", 10), padding=(12, 8), borderwidth=0)
        style.configure("Primary.TButton", background="#d7a76f", foreground="#10252f", padding=(18, 11))
        style.configure("Quiet.TButton", background="#d8d1c7", foreground="#20343d", padding=(14, 9))
        style.map("Primary.TButton", background=[("active", "#e2b782"), ("disabled", "#849193")])
        style.map("Quiet.TButton", background=[("active", "#e4ddd3"), ("disabled", "#b2aaa0")])
        style.configure("TCombobox", fieldbackground="#fbf7ef", background="#fbf7ef", foreground="#20343d", padding=(8, 6))

        outer = ttk.Frame(self.root, padding=(24, 22))
        outer.pack(fill="both", expand=True)
        self.load_ui_assets()

        header = ttk.Frame(outer)
        header.pack(fill="x", pady=(0, 12))
        ttk.Label(header, text="M.O.C.H.I. LABO / Local Tool", style="AppKicker.TLabel").pack(anchor="w")
        ttk.Label(header, text=APP_TITLE, style="AppTitle.TLabel").pack(anchor="w", pady=(3, 6))
        ttk.Label(
            header,
            text="声をその場で文字にして、止めたらMarkdownへ残します。音声は保存しません。",
            style="AppMuted.TLabel",
            wraplength=640,
        ).pack(anchor="w")

        if self.soft_lab_bg_image:
            ttk.Label(outer, image=self.soft_lab_bg_image, style="Muted.TLabel").pack(anchor="w", pady=(0, 14))

        controls_card = ttk.Frame(outer, style="Card.TFrame", padding=18)
        controls_card.pack(fill="x", pady=(0, 14))

        recording_shell = ttk.Frame(controls_card, style="Card.TFrame")
        recording_shell.pack(fill="x", pady=(0, 14))

        recording_main = ttk.Frame(recording_shell, style="Card.TFrame")
        recording_main.pack(side="left", fill="x", expand=True)

        recording_asset = ttk.Frame(recording_shell, style="Character.TFrame", padding=(10, 0, 0, 0))
        recording_asset.pack(side="right", anchor="n")
        character_frame = self.build_character_frame(recording_asset, MOCHISURA_IMAGE, "もちスラ")
        if character_frame:
            character_frame.pack(anchor="e")

        state_row = ttk.Frame(recording_main, style="Card.TFrame")
        state_row.pack(fill="x", pady=(0, 12))
        ttk.Label(state_row, textvariable=self.record_state, style="Badge.TLabel").pack(side="left")
        ttk.Label(state_row, textvariable=self.recording_time, style="Timer.TLabel").pack(side="right")

        visual_row = ttk.Frame(recording_main, style="Card.TFrame")
        visual_row.pack(fill="x", pady=(0, 12))
        if self.waveform_idle_image:
            self.waveform_label = ttk.Label(visual_row, image=self.waveform_idle_image, style="CardImage.TLabel")
            self.waveform_label.pack(side="left")

        if self.record_glow_image:
            self.glow_label = ttk.Label(recording_main, image=self.record_glow_image, style="CardImage.TLabel")
            self.glow_label.pack(anchor="w", pady=(0, 8))

        controls = ttk.Frame(recording_main, style="Card.TFrame")
        controls.pack(fill="x")
        self.start_button = ttk.Button(controls, text="記録する", style="Primary.TButton", command=self.start_recording)
        self.start_button.pack(side="left", fill="x", expand=True)
        self.stop_button = ttk.Button(controls, text="止めて保存", style="Quiet.TButton", command=self.stop_recording, state="disabled")
        self.stop_button.pack(side="left", fill="x", expand=True, padx=(10, 0))

        settings = ttk.Frame(controls_card, style="Card.TFrame")
        settings.pack(fill="x", pady=(14, 0))

        folder_frame = ttk.Frame(settings, style="Card.TFrame")
        folder_frame.pack(fill="x", pady=(0, 10))
        ttk.Label(folder_frame, text="保存先", style="CardTitle.TLabel", width=10).pack(side="left")
        ttk.Label(folder_frame, textvariable=self.save_dir, style="CardMuted.TLabel").pack(side="left", fill="x", expand=True)
        ttk.Button(folder_frame, text="変更", style="Quiet.TButton", command=self.choose_folder).pack(side="right", padx=(10, 0))

        device_frame = ttk.Frame(settings, style="Card.TFrame")
        device_frame.pack(fill="x")
        ttk.Label(device_frame, text="マイク", style="CardTitle.TLabel", width=10).pack(side="left")
        self.device_combo = ttk.Combobox(device_frame, textvariable=self.selected_device, state="readonly")
        self.device_combo.pack(side="left", fill="x", expand=True)
        ttk.Button(device_frame, text="再読み込み", style="Quiet.TButton", command=self.refresh_devices).pack(side="right", padx=(10, 0))

        status_bar = ttk.Frame(outer, style="Soft.TFrame", padding=(14, 9))
        status_bar.pack(fill="x", pady=(0, 14))
        ttk.Label(status_bar, textvariable=self.status, style="SoftMuted.TLabel", wraplength=740).pack(anchor="w")

        if self.toast_saved_image:
            self.toast_label = ttk.Label(
                outer,
                image=self.toast_saved_image,
                text="保存しました",
                compound="center",
                style="Toast.TLabel",
            )

        editor_card = ttk.Frame(outer, style="Paper.TFrame", padding=18)
        editor_card.pack(fill="both", expand=True)
        editor_head = ttk.Frame(editor_card, style="Paper.TFrame")
        editor_head.pack(fill="x", pady=(0, 10))
        ttk.Label(editor_head, text="Markdown Draft", style="PaperTitle.TLabel").pack(side="left")
        if self.tag_chip_image:
            ttk.Label(
                editor_head,
                image=self.tag_chip_image,
                text="voice memo",
                compound="center",
                style="Chip.TLabel",
            ).pack(side="right")
        else:
            ttk.Label(editor_head, text="録音中に本文が育ちます", style="PaperMuted.TLabel").pack(side="right")

        self.empty_accent_slot = ttk.Frame(editor_card, style="Paper.TFrame")
        self.empty_accent_slot.pack(fill="x")
        self.empty_accent = self.build_character_frame(self.empty_accent_slot, RESEARCHER_IMAGE, "研究員ちゃん")
        if self.empty_accent:
            self.empty_accent.pack(anchor="e", pady=(0, 8))

        if self.card_paper_image:
            ttk.Label(editor_card, image=self.card_paper_image, style="PaperImage.TLabel").pack(anchor="w", pady=(0, 8))

        self.preview = Text(
            editor_card,
            height=14,
            wrap="word",
            bg="#f8f2e8",
            fg="#233235",
            insertbackground="#20343d",
            relief="flat",
            padx=8,
            pady=10,
            font=("Yu Gothic UI", 11),
        )
        self.preview.pack(fill="both", expand=True)
        self.preview.insert("1.0", "ここにリアルタイムの文字起こしが表示されます。")
        self.preview.configure(state="disabled")

    def load_ui_assets(self) -> None:
        self.soft_lab_bg_image = self.load_image(SOFT_LAB_BG_IMAGE)
        self.card_paper_image = self.load_image(CARD_PAPER_IMAGE)
        self.tag_chip_image = self.load_image(TAG_CHIP_IMAGE)
        self.record_glow_image = self.load_image(RECORD_GLOW_IMAGE)
        self.waveform_active_image = self.load_image(WAVEFORM_ACTIVE_IMAGE)
        self.waveform_idle_image = self.load_image(WAVEFORM_IDLE_IMAGE)
        self.toast_saved_image = self.load_image(TOAST_SAVED_IMAGE)

    def load_image(self, path: Path) -> PhotoImage | None:
        if not path.exists():
            return None
        try:
            image = PhotoImage(file=str(path))
            max_size = ASSET_MAX_SIZES.get(path)
            if not max_size:
                return image

            max_width, max_height = max_size
            factor = max(
                1,
                int(max(image.width() / max_width, image.height() / max_height) + 0.999),
            )
            return image.subsample(factor, factor)
        except Exception:
            return None

    def set_recording_visuals(self, active: bool) -> None:
        if not self.waveform_label:
            return
        image = self.waveform_active_image if active else self.waveform_idle_image
        if image:
            self.waveform_label.configure(image=image)

    def show_saved_toast(self) -> None:
        if not self.toast_label:
            return
        self.toast_label.pack(anchor="e", pady=(0, 12))
        self.root.after(2600, self.hide_saved_toast)

    def hide_saved_toast(self) -> None:
        if self.toast_label:
            self.toast_label.pack_forget()


    def build_character_frame(self, parent: ttk.Frame, image_path: Path, label: str) -> ttk.Frame | None:
        display_image = self.load_image(image_path)
        if display_image is None:
            return None

        if label == "もちスラ":
            self.mochisura_image = display_image
        else:
            self.researcher_image = display_image

        if label == "もちスラ":
            frame_style = "Character.TFrame"
            image_style = "CardMuted.TLabel"
        else:
            frame_style = "PaperCharacter.TFrame"
            image_style = "PaperMuted.TLabel"

        frame = ttk.Frame(parent, style=frame_style)
        ttk.Label(frame, image=display_image, style=image_style).pack(anchor="center")
        return frame

    def choose_folder(self) -> None:
        selected = filedialog.askdirectory(initialdir=self.save_dir.get(), title="Markdownの保存先を選ぶ")
        if selected:
            self.save_dir.set(selected)

    def refresh_devices(self) -> None:
        try:
            devices = sd.query_devices()
            self.input_devices = [
                {"index": index, "name": device["name"]}
                for index, device in enumerate(devices)
                if int(device.get("max_input_channels", 0)) > 0
            ]
        except Exception as exc:
            self.input_devices = []
            self.status.set(f"マイク一覧を取得できませんでした: {exc}")
            self.device_combo.configure(values=[])
            return

        labels = [f"{device['index']}: {device['name']}" for device in self.input_devices]
        self.device_combo.configure(values=labels)

        if labels and self.selected_device.get() not in labels:
            self.selected_device.set(labels[0])
            self.record_state.set("READY")
            self.set_recording_visuals(False)
            self.status.set("マイクを選んでから音声入力を開始できます。")
        elif not labels:
            self.selected_device.set("")
            self.record_state.set("NO MIC")
            self.set_recording_visuals(False)
            self.status.set("入力マイクが見つかりません。Windowsのサウンド設定を確認してください。")

    def get_selected_device_index(self) -> int | None:
        label = self.selected_device.get()
        if not label:
            return None
        try:
            return int(label.split(":", 1)[0])
        except ValueError:
            return None

    def start_recording(self) -> None:
        if self.is_recording:
            return

        device_index = self.get_selected_device_index()
        if device_index is None:
            messagebox.showerror(APP_TITLE, "入力マイクを選んでください。")
            return

        with self.audio_lock:
            self.audio_chunks.clear()
        self.transcribed_lines.clear()
        self.started_at = dt.datetime.now()
        self.is_recording = True
        self.is_transcribing = True
        self.record_state.set("LISTENING")
        self.set_recording_visuals(True)
        self.hide_saved_toast()
        self.status.set("録音中です。数秒ごとに文字起こしします。")
        self.start_button.configure(state="disabled")
        self.stop_button.configure(state="normal")
        self.event_queue.put(("preview", ""))

        try:
            self.stream = sd.InputStream(
                samplerate=SAMPLE_RATE,
                channels=CHANNELS,
                dtype="float32",
                device=device_index,
                callback=self.audio_callback,
            )
            self.stream.start()
            self.transcribe_thread = threading.Thread(target=self.realtime_transcribe_loop, daemon=True)
            self.transcribe_thread.start()
        except Exception as exc:
            self.is_recording = False
            self.is_transcribing = False
            self.record_state.set("CHECK")
            self.set_recording_visuals(False)
            self.start_button.configure(state="normal")
            self.stop_button.configure(state="disabled")
            messagebox.showerror(APP_TITLE, f"マイクを開始できませんでした。\n\n{exc}")

    def audio_callback(self, indata: np.ndarray, frames: int, time, status) -> None:
        if status:
            self.event_queue.put(("status", f"録音状態: {status}"))
        if self.is_recording:
            with self.audio_lock:
                self.audio_chunks.append(indata.copy())

    def stop_recording(self) -> None:
        if not self.is_recording:
            return

        self.is_recording = False
        self.record_state.set("SAVING")
        self.set_recording_visuals(False)
        self.start_button.configure(state="disabled")
        self.stop_button.configure(state="disabled")
        self.status.set("最後の文字起こしを整えて、Markdown保存します。")

        if self.stream:
            self.stream.stop()
            self.stream.close()
            self.stream = None

        threading.Thread(target=self.finish_and_save, daemon=True).start()

    def realtime_transcribe_loop(self) -> None:
        while self.is_transcribing:
            threading.Event().wait(TRANSCRIBE_INTERVAL_SECONDS)
            if not self.is_transcribing:
                break
            self.transcribe_pending_audio()

    def drain_audio_chunks(self) -> np.ndarray | None:
        with self.audio_lock:
            if not self.audio_chunks:
                return None
            chunks = self.audio_chunks[:]
            self.audio_chunks.clear()

        audio = np.concatenate(chunks, axis=0)
        if audio.size == 0:
            return None
        return audio

    def transcribe_pending_audio(self) -> None:
        if not self.transcribe_lock.acquire(blocking=False):
            return

        audio = self.drain_audio_chunks()
        if audio is None:
            self.transcribe_lock.release()
            return

        temp_path: str | None = None
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
                temp_path = temp_file.name

            self.write_wav(temp_path, audio)
            text = self.transcribe(temp_path)
            if text:
                self.transcribed_lines.append(text)
                self.event_queue.put(("preview", self.current_body_text()))
                self.event_queue.put(("status", "文字起こし中です。話し続けられます。"))
        except Exception as exc:
            self.event_queue.put(("error", str(exc)))
        finally:
            if temp_path and os.path.exists(temp_path):
                try:
                    os.remove(temp_path)
                except OSError:
                    self.event_queue.put(("status", f"一時ファイルを削除できませんでした: {temp_path}"))
            self.transcribe_lock.release()

    def finish_and_save(self) -> None:
        try:
            self.is_transcribing = False
            self.transcribe_pending_audio()
            body = self.current_body_text()
            if not body:
                self.event_queue.put(("error", "音声が記録されていないか、文字起こし結果が空でした。"))
                return

            markdown = self.build_markdown(body)
            output_path = self.save_markdown(markdown)
            self.event_queue.put(("saved", str(output_path)))
            self.event_queue.put(("preview", markdown))
        except Exception as exc:
            self.event_queue.put(("error", str(exc)))
        finally:
            with self.audio_lock:
                self.audio_chunks.clear()

    def current_body_text(self) -> str:
        return "\n".join(line for line in self.transcribed_lines if line.strip()).strip()

    def write_wav(self, path: str, audio: np.ndarray) -> None:
        clipped = np.clip(audio.reshape(-1), -1.0, 1.0)
        pcm = (clipped * 32767).astype(np.int16)

        with wave.open(path, "wb") as wav_file:
            wav_file.setnchannels(CHANNELS)
            wav_file.setsampwidth(2)
            wav_file.setframerate(SAMPLE_RATE)
            wav_file.writeframes(pcm.tobytes())

    def transcribe(self, wav_path: str) -> str:
        if self.model is None:
            self.event_queue.put(("status", "Whisperモデルを読み込んでいます。初回は少し時間がかかります。"))
            self.model = WhisperModel(MODEL_SIZE, device="cpu", compute_type="int8")

        segments, _ = self.model.transcribe(wav_path, language="ja", vad_filter=True)
        lines = [segment.text.strip() for segment in segments if segment.text.strip()]
        return "\n".join(lines).strip()

    def build_markdown(self, body: str) -> str:
        now = dt.datetime.now()
        body_text = body if body else "（文字起こし結果が空でした）"
        return (
            "# 音声入力メモ\n\n"
            f"日付：{now.strftime('%Y-%m-%d %H:%M')}\n"
            "タグ：\n\n"
            "## 本文\n\n"
            f"{body_text}\n\n"
            "## 要約\n\n"
            "\n"
            "## 使えそうな形\n"
        )

    def save_markdown(self, markdown: str) -> Path:
        save_dir = Path(self.save_dir.get()).expanduser()
        save_dir.mkdir(parents=True, exist_ok=True)
        filename = dt.datetime.now().strftime("voice-memo-%Y%m%d-%H%M%S.md")
        output_path = save_dir / filename
        output_path.write_text(markdown, encoding="utf-8")
        return output_path

    def consume_events(self) -> None:
        while True:
            try:
                kind, value = self.event_queue.get_nowait()
            except queue.Empty:
                break

            if kind == "status":
                self.status.set(value)
            elif kind == "preview":
                self.preview.configure(state="normal")
                self.preview.delete("1.0", "end")
                self.preview.insert("1.0", value)
                self.preview.configure(state="disabled")
                if self.empty_accent:
                    if value.strip():
                        self.empty_accent.pack_forget()
                    else:
                        self.empty_accent.pack(anchor="e", pady=(0, 8))
            elif kind == "saved":
                self.record_state.set("SAVED")
                self.set_recording_visuals(False)
                self.show_saved_toast()
                self.status.set(f"Markdownを保存しました: {value}")
                self.start_button.configure(state="normal")
                self.stop_button.configure(state="disabled")
            elif kind == "error":
                self.record_state.set("CHECK")
                self.set_recording_visuals(False)
                self.status.set("処理を完了できませんでした。")
                self.start_button.configure(state="normal")
                self.stop_button.configure(state="disabled")
                messagebox.showerror(APP_TITLE, value)

        self.root.after(200, self.consume_events)

    def update_timer(self) -> None:
        if self.is_recording and self.started_at:
            elapsed = dt.datetime.now() - self.started_at
            seconds = int(elapsed.total_seconds())
            self.recording_time.set(f"{seconds // 60:02d}:{seconds % 60:02d}")
        elif not self.is_recording:
            self.recording_time.set("00:00")

        self.root.after(500, self.update_timer)


def main() -> None:
    root = Tk()
    app = VoiceInputMemoApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
