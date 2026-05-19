const fields = [
  { id: "style", group: 0 },
  { id: "proportion", group: 1 },
  { id: "age", group: 1 },
  { id: "bodyType", group: 1 },
  { id: "faceType", group: 2 },
  { id: "expression", group: 2 },
  { id: "faceItem", group: 2 },
  { id: "hairStyle", group: 3 },
  { id: "bangs", group: 3 },
  { id: "eyes", group: 3 },
  { id: "feature", group: 3 },
  { id: "outerTop", group: 4 },
  { id: "inner", group: 4 },
  { id: "bottom", group: 4 },
  { id: "headItem", group: 5 },
  { id: "armItem", group: 5 },
  { id: "chestItem", group: 5 },
  { id: "backItem", group: 5 },
  { id: "waistItem", group: 5 },
  { id: "legItem", group: 5 },
  { id: "shoes", group: 5 },
  { id: "direction", group: 6 },
  { id: "range", group: 6 },
  { id: "action", group: 7 },
  { id: "background", group: 8 },
  { id: "mood", group: 9 },
  { id: "line", group: 10, quote: true }
];

const sample = {
  style: "ガラス細工調",
  proportion: "6頭身",
  age: "20代前半",
  bodyType: "細身",
  faceType: "中性的な顔",
  expression: "眠そうな表情",
  faceItem: "眼帯とピアス",
  hairStyle: "金髪ショートボブ",
  bangs: "斜め前髪",
  eyes: "赤い目",
  feature: "八重歯",
  outerTop: "和装上衣",
  inner: "白インナー",
  bottom: "ミニスカート",
  headItem: "頭に狐面",
  armItem: "腕に包帯",
  chestItem: "胸にエンブレム",
  backItem: "背中にギター",
  waistItem: "腰に鎖",
  legItem: "足にニーハイ",
  shoes: "厚底ブーツ",
  direction: "横を向いている",
  range: "バストアップ",
  action: "踊っている",
  background: "雨の路地裏",
  mood: "静かな雨の夜",
  line: "朝はまだ遠かった"
};

const storageKey = "simple-character-promptmaker";
const themeKey = "simple-character-promptmaker-theme";
const form = document.querySelector("#promptForm");
const output = document.querySelector("#promptOutput");
const copyButton = document.querySelector("#copyButton");
const sampleButton = document.querySelector("#sampleButton");
const modeButton = document.querySelector("#modeButton");

function clean(value) {
  return String(value || "")
    .replace(/[「」]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function hasPunctuation(value) {
  return /[。！？!?]$/.test(value);
}

function sentence(value) {
  const text = clean(value);
  if (!text) return "";
  return hasPunctuation(text) ? text : `${text}。`;
}

function quote(value) {
  const text = clean(value);
  if (!text) return "";
  return `「${hasPunctuation(text) ? text : `${text}。`}」`;
}

function getValue(id) {
  return document.querySelector(`#${id}`).value;
}

function buildPrompt() {
  const groups = [];
  fields.forEach((field) => {
    const line = field.quote ? quote(getValue(field.id)) : sentence(getValue(field.id));
    if (!line) return;
    if (!groups[field.group]) groups[field.group] = [];
    groups[field.group].push(line);
  });
  return groups.filter(Boolean).map((group) => group.join("\n")).join("\n\n");
}

function saveState() {
  const data = {};
  fields.forEach((field) => {
    data[field.id] = getValue(field.id);
  });
  localStorage.setItem(storageKey, JSON.stringify(data));
}

function render() {
  const prompt = buildPrompt();
  output.textContent = prompt;
  copyButton.disabled = !prompt;
  saveState();
}

function setValues(data) {
  fields.forEach((field) => {
    document.querySelector(`#${field.id}`).value = data[field.id] || "";
  });
  render();
}

function loadState() {
  try {
    const data = JSON.parse(localStorage.getItem(storageKey) || "{}");
    setValues(data);
  } catch {
    render();
  }
}

async function copyPrompt() {
  const prompt = buildPrompt();
  if (!prompt) return;
  await navigator.clipboard.writeText(prompt);
  copyButton.textContent = "コピー済み";
  window.setTimeout(() => {
    copyButton.textContent = "コピー";
  }, 1200);
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  modeButton.textContent = theme === "dark" ? "明色" : "暗色";
  modeButton.setAttribute("aria-pressed", String(theme === "dark"));
  localStorage.setItem(themeKey, theme);
}

function loadTheme() {
  const stored = localStorage.getItem(themeKey);
  if (stored === "dark" || stored === "light") {
    applyTheme(stored);
    return;
  }
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  modeButton.textContent = prefersDark ? "明色" : "暗色";
  modeButton.setAttribute("aria-pressed", String(prefersDark));
}

form.addEventListener("input", render);
form.addEventListener("reset", () => {
  window.setTimeout(render, 0);
});

copyButton.addEventListener("click", copyPrompt);
sampleButton.addEventListener("click", () => setValues(sample));
modeButton.addEventListener("click", () => {
  const current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  applyTheme(current === "dark" ? "light" : "dark");
});

loadTheme();
loadState();
