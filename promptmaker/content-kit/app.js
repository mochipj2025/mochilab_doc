const fields = [
  "contentType",
  "purpose",
  "format",
  "mangaCut",
  "magazineLayout",
  "composition",
  "camera",
  "subject",
  "scene",
  "action",
  "item",
  "textArea",
  "tone",
  "style",
  "avoid"
];

const options = {
  contentType: ["コマなし漫画", "一枚漫画", "余白漫画", "漫画1コマ", "漫画3コマ", "縦スクロール漫画の1シーン", "雑誌表紙", "雑誌特集ページ", "note見出し画像", "SNSカルーセル1枚目", "キャラクター紹介ページ"],
  purpose: ["note記事の見出し画像", "SNS告知", "漫画の導入", "キャラクター紹介", "世界観紹介", "連載告知", "作品アーカイブ"],
  format: ["縦長 4:5", "正方形 1:1", "横長 16:9", "縦長 9:16", "A4縦", "雑誌見開き風"],
  mangaCut: ["コマ割りなしの一枚漫画", "余白で読ませる漫画カット", "セリフなしの情景カット", "導入の引きカット", "表情アップ", "手元のディテールカット", "後ろ姿の余韻カット", "会話前の沈黙カット", "場面転換カット", "決めゴマ", "小さなオチのカット"],
  magazineLayout: ["コマなし漫画ページ", "余白のある漫画扉ページ", "静かな漫画誌面", "余白のある特集扉ページ", "静かなインタビューページ", "写真集の1ページ", "見出しが大きい雑誌表紙", "小さなキャプション入りページ", "図鑑風の紹介ページ", "コラム挿絵ページ"],
  composition: ["コマ枠なしで一枚絵として見せる", "人物と余白だけで構成する", "人物を右寄せ、左に余白", "中央に人物、周囲に大きな余白", "下部に人物、上部に見出し余白", "斜め構図", "画面端に小さく人物", "手元を大きく写す"],
  camera: ["顔アップ", "バストアップ", "腰上までの中距離", "全身", "引き構図", "俯瞰", "低い視点"],
  subject: ["静かな表情のキャラクター", "小さな相棒キャラクター", "雨の日の案内役", "研究室のキャラクター", "少し眠そうな人物", "余白の似合うキャラクター"],
  scene: ["雨上がりの路地", "白い部屋", "夜の駅", "古い図書室", "静かな研究室", "夕方の屋上", "余白のある誌面背景"],
  action: ["振り返っている", "本を持っている", "歩き出す直前", "窓の外を見ている", "小さく手を振っている", "座って考えている"],
  item: ["小さな本、街灯、濡れた床", "マグカップ、紙片、ペン", "見出し用の余白、細い罫線", "小さなアイコン、キャプション枠", "植物、椅子、柔らかい光"],
  textArea: ["上部に短い見出し用の余白", "左側に縦書きコピー用の余白", "下部にキャプション用の余白", "文字なしで使える構図", "雑誌タイトルを置ける広い余白"],
  tone: ["静かで余韻のある雰囲気", "やわらかく読みやすい雰囲気", "少し不思議な空気", "落ち着いた編集感", "透明感のある静けさ", "あたたかいけれど控えめ"],
  style: ["日本語ミニマル編集デザイン", "静かな漫画誌面", "写真集風", "雑誌特集ページ風", "余白のあるnoteサムネ風", "落ち着いたSNSカルーセル風"],
  avoid: ["過剰な装飾、強い広告感", "文字の詰め込み、派手な演出", "医療的な効能表現", "読みにくい小文字、情報過多", "強い煽り文句"]
};

const labels = {
  contentType: "作るもの",
  purpose: "用途",
  format: "比率",
  mangaCut: "漫画カット",
  magazineLayout: "雑誌レイアウト",
  composition: "構図",
  camera: "カメラ",
  subject: "主役",
  scene: "場面",
  action: "動き",
  item: "入れるもの",
  textArea: "文字スペース",
  tone: "空気感",
  style: "表現",
  avoid: "避けるもの"
};

const presets = {
  "コマなし漫画": {
    contentType: "コマなし漫画",
    purpose: "漫画の導入",
    format: "縦長 4:5",
    mangaCut: "コマ割りなしの一枚漫画",
    magazineLayout: "余白のある漫画扉ページ",
    composition: "コマ枠なしで一枚絵として見せる",
    camera: "腰上までの中距離",
    subject: "静かな表情のキャラクター",
    scene: "余白のある誌面背景",
    action: "歩き出す直前",
    item: "小さな本、街灯、濡れた床",
    textArea: "文字なしで使える構図",
    tone: "静かで余韻のある雰囲気",
    style: "静かな漫画誌面",
    avoid: "文字の詰め込み、派手な演出"
  },
  "雑誌扉": {
    contentType: "雑誌特集ページ",
    purpose: "世界観紹介",
    format: "A4縦",
    mangaCut: "セリフなしの情景カット",
    magazineLayout: "余白のある特集扉ページ",
    composition: "人物を右寄せ、左に余白",
    camera: "全身",
    subject: "余白の似合うキャラクター",
    scene: "静かな研究室",
    action: "窓の外を見ている",
    item: "見出し用の余白、細い罫線",
    textArea: "左側に縦書きコピー用の余白",
    tone: "落ち着いた編集感",
    style: "雑誌特集ページ風",
    avoid: "過剰な装飾、強い広告感"
  },
  "note見出し": {
    contentType: "note見出し画像",
    purpose: "note記事の見出し画像",
    format: "横長 16:9",
    mangaCut: "導入の引きカット",
    magazineLayout: "コラム挿絵ページ",
    composition: "人物を右寄せ、左に余白",
    camera: "バストアップ",
    subject: "静かな表情のキャラクター",
    scene: "白い部屋",
    action: "座って考えている",
    item: "マグカップ、紙片、ペン",
    textArea: "上部に短い見出し用の余白",
    tone: "やわらかく読みやすい雰囲気",
    style: "余白のあるnoteサムネ風",
    avoid: "強い煽り文句"
  },
  "SNSカルーセル": {
    contentType: "SNSカルーセル1枚目",
    purpose: "SNS告知",
    format: "正方形 1:1",
    mangaCut: "決めゴマ",
    magazineLayout: "見出しが大きい雑誌表紙",
    composition: "中央に人物、周囲に大きな余白",
    camera: "バストアップ",
    subject: "雨の日の案内役",
    scene: "余白のある誌面背景",
    action: "小さく手を振っている",
    item: "小さなアイコン、キャプション枠",
    textArea: "雑誌タイトルを置ける広い余白",
    tone: "あたたかいけれど控えめ",
    style: "落ち着いたSNSカルーセル風",
    avoid: "文字の詰め込み、派手な演出"
  },
  "キャラ紹介": {
    contentType: "キャラクター紹介ページ",
    purpose: "キャラクター紹介",
    format: "縦長 9:16",
    mangaCut: "表情アップ",
    magazineLayout: "図鑑風の紹介ページ",
    composition: "下部に人物、上部に見出し余白",
    camera: "全身",
    subject: "余白の似合うキャラクター",
    scene: "余白のある誌面背景",
    action: "振り返っている",
    item: "小さなアイコン、キャプション枠",
    textArea: "下部にキャプション用の余白",
    tone: "透明感のある静けさ",
    style: "日本語ミニマル編集デザイン",
    avoid: "読みにくい小文字、情報過多"
  }
};

const output = document.querySelector("#output");
const copyButton = document.querySelector("#copyButton");
const randomButton = document.querySelector("#randomButton");
const presetActions = document.querySelector("#presetActions");
const form = document.querySelector("#kitForm");

function valueOf(id) {
  return document.querySelector(`#${id}`).value.trim();
}

function sentence(text) {
  if (!text) return "";
  return /[。！？!?]$/.test(text) ? text : `${text}。`;
}

function buildPrompt() {
  const lines = fields
    .map((id) => {
      const value = valueOf(id);
      return value ? `${labels[id]}: ${sentence(value)}` : "";
    })
    .filter(Boolean);

  if (!lines.length) return "";

  return [
    "以下の内容で、添付したキャラクターを使用して画像を出力する。",
    "キャラクターの顔、髪型、衣装、体格、雰囲気は添付画像を基準に保つ。",
    "",
    ...lines,
    "",
    "添付キャラクターを主役にして、全体は静かな日本語編集デザインでまとめる。",
    "過剰に説明的にせず、余白と視線誘導を大切にする。"
  ].join("\n");
}

function render() {
  const prompt = buildPrompt();
  output.textContent = prompt;
  copyButton.disabled = !prompt;
  updateChoiceStates();
}

function pick(values) {
  return values[Math.floor(Math.random() * values.length)];
}

function setRandomValues() {
  fields.forEach((id) => {
    document.querySelector(`#${id}`).value = pick(options[id]);
  });
  render();
}

function setValues(values) {
  fields.forEach((id) => {
    document.querySelector(`#${id}`).value = values[id] || "";
  });
  render();
}

function copyFallback(text) {
  const source = document.createElement("textarea");
  source.value = text;
  source.style.position = "fixed";
  source.style.left = "-9999px";
  document.body.appendChild(source);
  source.focus();
  source.select();
  const copied = document.execCommand("copy");
  source.remove();
  return copied;
}

async function copyPrompt() {
  const prompt = buildPrompt();
  if (!prompt) return;

  if (copyFallback(prompt)) {
    copyButton.textContent = "コピー済み";
  } else {
    copyButton.textContent = "選択しました";
    const range = document.createRange();
    range.selectNodeContents(output);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  window.setTimeout(() => {
    copyButton.textContent = "コピー";
  }, 2000);
}

function createChoices() {
  fields.forEach((id) => {
    const input = document.querySelector(`#${id}`);
    const box = document.createElement("div");
    box.className = "choices";
    box.innerHTML = options[id].map((value) => (
      `<button class="choice" type="button" data-target="${id}" data-value="${value}">${value}</button>`
    )).join("");
    input.insertAdjacentElement("afterend", box);
  });
}

function createPresets() {
  presetActions.innerHTML = Object.keys(presets).map((name) => (
    `<button class="preset-button" type="button" data-preset="${name}">${name}</button>`
  )).join("");
}

function updateChoiceStates() {
  document.querySelectorAll(".choice").forEach((button) => {
    const input = document.querySelector(`#${button.dataset.target}`);
    button.classList.toggle("is-active", input.value === button.dataset.value);
  });
}

form.addEventListener("input", render);
form.addEventListener("reset", () => window.setTimeout(render, 0));
form.addEventListener("click", (event) => {
  const button = event.target.closest(".choice");
  if (!button) return;
  document.querySelector(`#${button.dataset.target}`).value = button.dataset.value;
  render();
});

presetActions.addEventListener("click", (event) => {
  const button = event.target.closest(".preset-button");
  if (!button) return;
  setValues(presets[button.dataset.preset]);
});

randomButton.addEventListener("click", setRandomValues);
copyButton.addEventListener("click", copyPrompt);

createPresets();
createChoices();
render();
