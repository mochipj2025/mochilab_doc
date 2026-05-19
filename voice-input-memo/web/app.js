const stateBadge = document.querySelector("#stateBadge");
const timer = document.querySelector("#timer");
const statusText = document.querySelector("#statusText");
const waveform = document.querySelector("#waveform");
const startButton = document.querySelector("#startButton");
const stopButton = document.querySelector("#stopButton");
const memoBody = document.querySelector("#memoBody");
const titleInput = document.querySelector("#titleInput");
const tagsInput = document.querySelector("#tags");
const saveDirInput = document.querySelector("#saveDir");
const emptyHint = document.querySelector("#emptyHint");
const toast = document.querySelector("#toast");

let mediaRecorder;
let stream;
let startedAt;
let timerId;
let isStopping = false;
let queuedTranscribes = 0;
let transcribeQueue = Promise.resolve();

const REALTIME_CHUNK_MS = 3000;

const setState = (state, message) => {
  stateBadge.textContent = state;
  statusText.textContent = message;
};

const updateEmptyHint = () => {
  emptyHint.classList.toggle("hidden", memoBody.value.trim().length > 0);
};

const appendText = (text) => {
  const clean = text.trim();
  if (!clean) return;
  memoBody.value = [memoBody.value.trim(), clean].filter(Boolean).join("\n");
  updateEmptyHint();
};

const formatTime = (date) => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
};

const startTimer = () => {
  startedAt = new Date();
  timer.textContent = "00:00";
  timerId = window.setInterval(() => {
    timer.textContent = formatTime(startedAt);
  }, 500);
};

const stopTimer = () => {
  window.clearInterval(timerId);
  timer.textContent = "00:00";
};

const finishIfIdle = () => {
  if (isStopping && queuedTranscribes === 0) saveMarkdown();
};

const enqueueTranscription = (blob) => {
  if (!blob || blob.size === 0) return;
  queuedTranscribes += 1;
  setState("LISTENING", "音声を受け取っています。順に文字へ変換します。");
  transcribeQueue = transcribeQueue
    .then(() => transcribeBlob(blob))
    .catch((error) => setState("CHECK", error.message))
    .finally(() => {
      queuedTranscribes -= 1;
      finishIfIdle();
    });
};

const transcribeBlob = async (blob) => {
  try {
    const response = await fetch("/api/transcribe", {
      method: "POST",
      headers: { "Content-Type": blob.type || "audio/webm" },
      body: blob,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "文字起こしに失敗しました。");
    appendText(data.text || "");
    if (!isStopping) setState("LISTENING", "文字起こし中です。話し続けられます。");
  } catch (error) {
    setState("CHECK", error.message);
  }
};

const startRecording = async () => {
  memoBody.focus();
  setState("DICTATION", "Windows音声入力を起動します。本文欄に話してください。");
  waveform.src = "/assets/memo-waveform-glow.png";
  startTimer();
  startButton.disabled = true;
  stopButton.disabled = false;
  try {
    const response = await fetch("/api/start-windows-dictation", { method: "POST" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Windows音声入力を起動できませんでした。");
  } catch (error) {
    setState("CHECK", error.message);
    startButton.disabled = false;
    stopButton.disabled = true;
    stopTimer();
  }
};

const startLocalTranscription = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const options = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? { mimeType: "audio/webm;codecs=opus" }
      : undefined;
    mediaRecorder = new MediaRecorder(stream, options);
    isStopping = false;
    queuedTranscribes = 0;
    transcribeQueue = Promise.resolve();
    memoBody.value = "";
    updateEmptyHint();
    mediaRecorder.addEventListener("dataavailable", (event) => enqueueTranscription(event.data));
    mediaRecorder.addEventListener("stop", () => {
      stream.getTracks().forEach((track) => track.stop());
      window.setTimeout(finishIfIdle, 0);
    });
    mediaRecorder.start(REALTIME_CHUNK_MS);
    startTimer();
    waveform.src = "/assets/memo-waveform-glow.png";
    setState("LISTENING", "記録中です。話した内容を順に文字へ変換します。");
    startButton.disabled = true;
    stopButton.disabled = false;
  } catch (error) {
    setState("CHECK", "マイクを開始できませんでした。ブラウザの許可を確認してください。");
  }
};

const stopRecording = () => {
  setState("SAVING", "本文をMarkdown保存します。");
  startButton.disabled = true;
  stopButton.disabled = true;
  stopTimer();
  saveMarkdown();
};

const stopLocalTranscription = () => {
  if (!mediaRecorder || mediaRecorder.state === "inactive") return;
  isStopping = true;
  setState("SAVING", "最後の文字起こしを整えて、Markdown保存します。");
  waveform.src = "/assets/memo-waveform-glow.png";
  startButton.disabled = true;
  stopButton.disabled = true;
  stopTimer();
  mediaRecorder.requestData();
  mediaRecorder.stop();
};

const saveMarkdown = async () => {
  try {
    const response = await fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: titleInput.value,
        body: memoBody.value,
        tags: tagsInput.value,
        saveDir: saveDirInput.value,
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "保存できませんでした。");
    setState("SAVED", `Markdownを保存しました: ${data.path}`);
    startButton.disabled = false;
    stopButton.disabled = true;
    showToast();
  } catch (error) {
    setState("CHECK", error.message);
    startButton.disabled = false;
    stopButton.disabled = true;
  }
};

const showToast = () => {
  toast.classList.add("visible");
  window.setTimeout(() => toast.classList.remove("visible"), 2400);
};

const loadConfig = async () => {
  const response = await fetch("/api/config");
  const data = await response.json();
  saveDirInput.value = data.saveDir || "";
};

startButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
memoBody.addEventListener("input", updateEmptyHint);
loadConfig();
updateEmptyHint();
