const fields = [
  { id: "style", group: 0 },
  { id: "outline", group: 0 },
  { id: "outlineWeight", group: 0 },
  { id: "proportion", group: 1 },
  { id: "age", group: 1 },
  { id: "bodyType", group: 1 },
  { id: "faceType", group: 2 },
  { id: "expression", group: 2 },
  { id: "faceItem", group: 2 },
  { id: "hairColor", group: 3 },
  { id: "hairStyle", group: 3 },
  { id: "bangs", group: 3 },
  { id: "eyes", group: 3 },
  { id: "eyeShape", group: 3 },
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
  outline: "アウトラインあり",
  outlineWeight: "細く淡い線",
  proportion: "6頭身",
  age: "20代前半",
  bodyType: "細身",
  faceType: "中性的な顔",
  expression: "眠そうな表情",
  faceItem: "眼帯とピアス",
  hairColor: "金髪",
  hairStyle: "ショートボブ",
  bangs: "斜め前髪",
  eyes: "赤い目",
  eyeShape: "少したれ目",
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

const presets = {
  "透明素材": {
    style: "ガラス細工調",
    outline: "アウトラインあり",
    outlineWeight: "細く淡い線",
    proportion: "6頭身",
    age: "年齢不詳",
    bodyType: "華奢",
    faceType: "人形のような顔",
    expression: "静かな表情",
    hairColor: "白髪",
    hairStyle: "ショートボブ",
    bangs: "目にかかる前髪",
    eyes: "透き通った目",
    eyeShape: "伏し目がちな目",
    feature: "白い肌",
    outerTop: "白いシャツ",
    inner: "ハイネック",
    bottom: "ロングスカート",
    shoes: "ショートブーツ",
    direction: "正面を向いている",
    range: "全身",
    action: "立っている",
    background: "透明背景",
    mood: "透明感のある静けさ"
  },
  "漫画主人公": {
    style: "漫画風",
    outline: "アウトラインあり",
    outlineWeight: "太くはっきりした線",
    proportion: "6頭身",
    age: "10代後半",
    bodyType: "すらっとした体型",
    faceType: "幼い顔",
    expression: "少し笑っている",
    faceItem: "そばかす",
    hairColor: "黒髪",
    hairStyle: "ショートヘア",
    bangs: "斜め前髪",
    eyes: "黒い目",
    eyeShape: "大きな目",
    feature: "八重歯",
    outerTop: "セーラー襟の上着",
    inner: "白インナー",
    bottom: "ショートパンツ",
    headItem: "頭にヘッドホン",
    armItem: "腕にリストバンド",
    shoes: "スニーカー",
    direction: "斜め前を向いている",
    range: "膝上まで",
    action: "手を伸ばしている",
    background: "淡い青背景",
    mood: "やわらかい朝"
  },
  "静かな雑誌向け": {
    style: "フィルム写真風",
    outline: "アウトラインなし",
    outlineWeight: "",
    proportion: "7頭身",
    age: "20代前半",
    bodyType: "細身",
    faceType: "中性的な顔",
    expression: "遠くを見ている表情",
    faceItem: "ピアス",
    hairColor: "青みのある黒髪",
    hairStyle: "セミロング",
    bangs: "センター分け",
    eyes: "黒い目",
    eyeShape: "切れ長の目",
    feature: "長いまつげ",
    outerTop: "長いコート",
    inner: "薄いニット",
    bottom: "細身のパンツ",
    chestItem: "胸にペンダント",
    shoes: "革靴",
    direction: "少し振り返っている",
    range: "腰上まで",
    action: "歩いている",
    background: "白背景",
    mood: "ひんやりした空気"
  },
  "相棒キャラ": {
    style: "ぬいぐるみ風",
    outline: "アウトラインあり",
    outlineWeight: "やわらかい薄い線",
    proportion: "3頭身",
    age: "年齢不詳",
    bodyType: "小柄",
    faceType: "やわらかい顔",
    expression: "少し笑っている",
    hairColor: "茶髪",
    hairStyle: "ボブ",
    bangs: "ぱっつん前髪",
    eyes: "琥珀色の目",
    eyeShape: "丸い目",
    feature: "小さなほくろ",
    outerTop: "大きめのパーカー",
    inner: "無地のシャツ",
    bottom: "ワイドパンツ",
    headItem: "頭に小さな帽子",
    armItem: "腕に手袋",
    waistItem: "腰にポーチ",
    shoes: "ショートブーツ",
    direction: "正面を向いている",
    range: "全身",
    action: "座っている",
    background: "ベージュ背景",
    mood: "あたたかい夕暮れ"
  },
  "SNS素材": {
    style: "3Dフィギュア風",
    outline: "アウトラインあり",
    outlineWeight: "普通の濃さの線",
    proportion: "5頭身",
    age: "20代前半",
    bodyType: "中性的な体型",
    faceType: "やわらかい顔",
    expression: "静かな表情",
    faceItem: "丸眼鏡",
    hairColor: "淡い紫の髪",
    hairStyle: "ショートボブ",
    bangs: "長い前髪",
    eyes: "青い目",
    eyeShape: "たれ目",
    feature: "白い肌",
    outerTop: "黒いジャケット",
    inner: "白インナー",
    bottom: "ロングスカート",
    chestItem: "胸にブローチ",
    waistItem: "腰にベルト",
    shoes: "ローファー",
    direction: "正面を向いている",
    range: "バストアップ",
    action: "立っている",
    background: "グレー背景",
    mood: "少し不思議な空気"
  }
};

const options = {
  style: [
    "ガラス細工調",
    "木彫り風",
    "粘土風",
    "羊毛フェルト風",
    "水彩風",
    "漫画風",
    "アニメ風",
    "絵本風",
    "児童書挿絵風",
    "レトロ漫画風",
    "少女漫画風",
    "墨絵風",
    "鉛筆画風",
    "色鉛筆画風",
    "パステル画風",
    "油絵風",
    "厚塗り風",
    "切り絵風",
    "貼り絵風",
    "紙人形風",
    "ぬいぐるみ風",
    "陶器人形風",
    "樹脂フィギュア風",
    "ソフビ人形風",
    "ミニチュア模型風",
    "ドット絵風",
    "低ポリゴン風",
    "3Dフィギュア風",
    "ピクトグラム風",
    "版画風",
    "リソグラフ印刷風",
    "シルクスクリーン風",
    "写真風",
    "フィルム写真風",
    "シネマ風"
  ],
  outline: ["アウトラインあり", "アウトラインなし"],
  outlineWeight: ["細く淡い線", "細く濃い線", "普通の濃さの線", "太くはっきりした線", "やわらかい薄い線", "黒く強い線"],
  proportion: ["2頭身", "3頭身", "5頭身", "6頭身", "7頭身", "8頭身"],
  age: ["10代後半", "20代前半", "20代後半", "30代前半", "年齢不詳", "大人びた雰囲気"],
  bodyType: ["細身", "小柄", "華奢", "すらっとした体型", "丸みのある体型", "中性的な体型"],
  faceType: ["中性的な顔", "幼い顔", "大人っぽい顔", "無表情が似合う顔", "やわらかい顔", "人形のような顔"],
  expression: ["眠そうな表情", "静かな表情", "少し笑っている", "無表情", "困ったような表情", "遠くを見ている表情"],
  faceItem: ["眼帯", "丸眼鏡", "ピアス", "そばかす", "泣きぼくろ", "小さな傷"],
  hairColor: ["黒髪", "金髪", "銀髪", "白髪", "茶髪", "赤髪", "青髪", "ピンク髪", "淡い紫の髪", "青みのある黒髪"],
  hairStyle: ["ショートボブ", "ロングヘア", "ボブ", "ショートヘア", "ウルフカット", "セミロング", "ツインテール", "ポニーテール", "お団子ヘア", "ゆるい三つ編み"],
  bangs: ["斜め前髪", "ぱっつん前髪", "長い前髪", "センター分け", "目にかかる前髪", "前髪なし"],
  eyes: ["赤い目", "青い目", "黒い目", "琥珀色の目", "眠そうな目", "透き通った目"],
  eyeShape: ["丸い目", "切れ長の目", "つり目", "たれ目", "三白眼", "半目", "大きな目", "細い目", "猫のような目", "伏し目がちな目"],
  feature: ["八重歯", "長いまつげ", "小さなほくろ", "尖った耳", "白い肌", "少し猫背"],
  outerTop: ["和装上衣", "黒いジャケット", "白いシャツ", "大きめのパーカー", "セーラー襟の上着", "長いコート"],
  inner: ["白インナー", "黒インナー", "ハイネック", "薄いニット", "レースのインナー", "無地のシャツ"],
  bottom: ["ミニスカート", "ロングスカート", "ショートパンツ", "細身のパンツ", "袴風スカート", "ワイドパンツ"],
  headItem: ["頭に狐面", "頭にリボン", "頭に小さな帽子", "頭に花飾り", "頭にヘッドホン", "頭にベール"],
  armItem: ["腕に包帯", "腕にブレスレット", "腕に手袋", "腕にリストバンド", "腕に袖飾り", "腕に細い鎖"],
  chestItem: ["胸にエンブレム", "胸にブローチ", "胸に小さな花", "胸に名札", "胸にリボン", "胸にペンダント"],
  backItem: ["背中にギター", "背中に小さな羽", "背中にリュック", "背中に長い布", "背中に剣", "背中に傘"],
  waistItem: ["腰に鎖", "腰にポーチ", "腰にリボン", "腰にベルト", "腰に小さな本", "腰に鍵束"],
  legItem: ["足にニーハイ", "足に包帯", "足にレッグウォーマー", "足に飾り紐", "足に模様入りタイツ", "足に細いベルト"],
  shoes: ["厚底ブーツ", "革靴", "スニーカー", "ローファー", "サンダル", "ショートブーツ"],
  direction: ["正面を向いている", "横を向いている", "少し振り返っている", "うつむいている", "上を見ている", "斜め前を向いている"],
  range: ["顔アップ", "バストアップ", "腰上まで", "膝上まで", "全身", "引き構図"],
  action: ["立っている", "歩いている", "踊っている", "座っている", "手を伸ばしている", "本を読んでいる"],
  background: ["透明背景", "白背景", "黒背景", "グレー背景", "ベージュ背景", "淡い青背景", "雨の路地裏", "白い部屋", "夜の駅", "森の小道", "古い図書室", "夕方の屋上"],
  mood: ["静かな雨の夜", "やわらかい朝", "少し不思議な空気", "ひんやりした空気", "あたたかい夕暮れ", "透明感のある静けさ"],
  line: ["朝はまだ遠かった", "光だけが残っていた", "今日はここで待っている", "名前を呼ばれた気がした", "まだ帰らなくていい", "小さな音だけが聞こえた"]
};

const storageKey = "simple-character-promptmaker";
const themeKey = "simple-character-promptmaker-theme";
const form = document.querySelector("#promptForm");
const output = document.querySelector("#promptOutput");
const copyButton = document.querySelector("#copyButton");
const sampleButton = document.querySelector("#sampleButton");
const randomButton = document.querySelector("#randomButton");
const poemButton = document.querySelector("#poemButton");
const modeButton = document.querySelector("#modeButton");
const presetActions = document.querySelector("#presetActions");

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

function createChoiceButtons() {
  fields.forEach((field) => {
    const values = options[field.id] || [];
    const input = document.querySelector(`#${field.id}`);
    if (!values.length || !input) return;
    const choices = document.createElement("div");
    choices.className = "choices";
    choices.setAttribute("aria-label", `${input.labels[0].textContent}の候補`);
    choices.innerHTML = values.map((value) => (
      `<button class="choice-button" type="button" data-target="${field.id}" data-value="${value}">${value}</button>`
    )).join("");
    input.insertAdjacentElement("afterend", choices);
  });
}

function updateChoiceStates() {
  document.querySelectorAll(".choice-button").forEach((button) => {
    const input = document.querySelector(`#${button.dataset.target}`);
    button.classList.toggle("is-active", input && input.value === button.dataset.value);
  });
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
  updateChoiceStates();
  saveState();
}

function setValues(data) {
  fields.forEach((field) => {
    document.querySelector(`#${field.id}`).value = data[field.id] || "";
  });
  render();
}

function createPresetButtons() {
  if (!presetActions) return;
  presetActions.innerHTML = Object.keys(presets).map((name) => (
    `<button class="preset-button" type="button" data-preset="${name}">${name}</button>`
  )).join("");
}

function applyPreset(name) {
  const preset = presets[name];
  if (!preset) return;
  setValues(preset);
  if (!preset.line) generatePoemLine();
}

function loadState() {
  try {
    const data = JSON.parse(localStorage.getItem(storageKey) || "{}");
    setValues(data);
  } catch {
    render();
  }
}

function setCopyButtonLabel(text) {
  copyButton.textContent = text;
  window.setTimeout(() => {
    copyButton.textContent = "コピー";
  }, 2200);
}

function copyWithFallback(text) {
  const copySource = document.createElement("textarea");
  copySource.value = text;
  copySource.setAttribute("readonly", "");
  copySource.style.position = "fixed";
  copySource.style.left = "-9999px";
  copySource.style.top = "0";
  document.body.appendChild(copySource);
  copySource.focus();
  copySource.select();
  copySource.setSelectionRange(0, copySource.value.length);
  const copied = document.execCommand("copy");
  copySource.remove();
  return copied;
}

function selectOutputText() {
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(output);
  selection.removeAllRanges();
  selection.addRange(range);
}

function copySelectedOutput() {
  selectOutputText();
  return document.execCommand("copy");
}

async function copyPrompt() {
  const prompt = buildPrompt();
  if (!prompt) return;

  if (copyWithFallback(prompt) || copySelectedOutput()) {
    setCopyButtonLabel("コピー済み");
    return;
  }

  try {
    if (globalThis.navigator && navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(prompt);
      setCopyButtonLabel("コピー済み");
      return;
    }
  } catch {
    selectOutputText();
    setCopyButtonLabel("選択しました");
    return;
  }

  selectOutputText();
  setCopyButtonLabel("選択しました");
}

function pickRandom(values) {
  return values[Math.floor(Math.random() * values.length)];
}

function setRandomValues() {
  const data = {};
  fields.forEach((field) => {
    const values = options[field.id] || [];
    data[field.id] = values.length ? pickRandom(values) : "";
  });
  setValues(data);
  generatePoemLine();
}

function includesAny(text, words) {
  return words.some((word) => text.includes(word));
}

function moodSeed() {
  const source = [
    getValue("style"),
    getValue("expression"),
    getValue("action"),
    getValue("background"),
    getValue("mood")
  ].join(" ");

  if (includesAny(source, ["雨", "夜", "路地", "駅", "ひんやり"])) {
    return ["まだ夜の匂いが残っていた", "雨音だけが、少し近かった", "帰り道は、まだ決まっていない", "光だけが、遅れて届いた"];
  }
  if (includesAny(source, ["朝", "白", "透明", "淡い", "水彩", "ガラス"])) {
    return ["朝の光が、そっと輪郭をなぞった", "小さな透明感だけが残っていた", "まだ名前のない朝だった", "光は静かにそこへ落ちた"];
  }
  if (includesAny(source, ["森", "図書", "本", "絵本", "児童書"])) {
    return ["ページの外で、風が待っていた", "物語はまだ閉じていなかった", "小さな秘密だけが残っていた", "誰も知らない続きがあった"];
  }
  if (includesAny(source, ["踊", "歩", "手を伸ば", "振り返"])) {
    return ["動き出す前の静けさがあった", "その一歩だけが、空気を変えた", "手の先に、まだ言葉が残っていた", "振り返るには少し早かった"];
  }
  if (includesAny(source, ["粘土", "羊毛", "木彫", "ぬいぐるみ", "陶器"])) {
    return ["小さな手触りが、そこに残った", "やわらかな形だけが息をしていた", "静かな温度を持っていた", "触れたら消えそうな距離だった"];
  }

  return ["朝はまだ遠かった", "光だけが残っていた", "今日はここで待っている", "名前を呼ばれた気がした", "まだ帰らなくていい", "小さな音だけが聞こえた"];
}

function generatePoemLine() {
  const lineInput = document.querySelector("#line");
  const seeds = moodSeed();
  lineInput.value = pickRandom(seeds);
  lineInput.dispatchEvent(new Event("input", { bubbles: true }));
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

form.addEventListener("click", (event) => {
  const button = event.target.closest(".choice-button");
  if (!button) return;
  const input = document.querySelector(`#${button.dataset.target}`);
  if (!input) return;
  input.value = button.dataset.value;
  input.dispatchEvent(new Event("input", { bubbles: true }));
});

if (presetActions) {
  presetActions.addEventListener("click", (event) => {
    const button = event.target.closest(".preset-button");
    if (!button) return;
    applyPreset(button.dataset.preset);
  });
}

copyButton.addEventListener("click", copyPrompt);
randomButton.addEventListener("click", setRandomValues);
sampleButton.addEventListener("click", () => setValues(sample));
poemButton.addEventListener("click", generatePoemLine);
modeButton.addEventListener("click", () => {
  const current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  applyTheme(current === "dark" ? "light" : "dark");
});

createPresetButtons();
createChoiceButtons();
loadTheme();
loadState();
