const keyGroups = [
  // Key 1
  ["あ", "い", "う", "え", "お", "ぁ", "ぃ", "ぅ", "ぇ", "ぉ"],
  // Key 2
  ["か", "き", "く", "け", "こ", "が", "ぎ", "ぐ", "げ", "ご"],
  // Key 3
  ["さ", "し", "す", "せ", "そ", "ざ", "じ", "ず", "ぜ", "ぞ"],
  // Key 4
  ["た", "ち", "つ", "て", "と", "だ", "ぢ", "づ", "で", "ど", "っ"],
  // Key 5
  ["な", "に", "ぬ", "ね", "の"],
  // Key 6
  ["は", "ひ", "ふ", "へ", "ほ", "ば", "び", "ぶ", "べ", "ぼ", "ぱ", "ぴ", "ぷ", "ぺ", "ぽ"],
  // Key 7
  ["ま", "み", "む", "め", "も"],
  // Key 8
  ["や", "ゆ", "よ", "ゃ", "ゅ", "ょ"],
  // Key 9
  ["ら", "り", "る", "れ", "ろ"],
  // Key 0
  ["わ", "を", "ん", "ゎ", "ー", "〜", "、", "。", "・", "！", "？", "「", "」", "（", "）", "：", "；", "…"]
];

const symbolAliases = {
  "!": "！",
  "?": "？",
  ",": "、",
  ".": "。",
  "-": "ー",
  "~": "〜",
  "(": "（",
  ")": "）",
  ":": "：",
  ";": "；"
};

const charToDigits = new Map();

keyGroups.forEach((group, row) => {
  const key = row === 0 ? "1" : String(row + 1);
  group.forEach((ch, index) => {
    charToDigits.set(ch, key.repeat(index + 1));
  });
});

function normalizeKana(char) {
  const normalized = char
    .replace(/[ァ-ヶ]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0x60))
    .normalize("NFC");
  return symbolAliases[normalized] || normalized;
}

function convert(text) {
  const out = [];

  for (const raw of text) {
    if (raw === " " || raw === "　" || raw === "\n" || raw === "\t") {
      out.push("/");
      continue;
    }

    const c = normalizeKana(raw);
    const digits = charToDigits.get(c);

    if (digits) {
      out.push(digits);
    } else {
      out.push(raw);
    }
  }

  return out.join(" ");
}

const input = document.getElementById("inputText");
const output = document.getElementById("outputText");
const tweetButton = document.getElementById("tweetButton");

function render() {
  const value = input.value.trim();
  output.textContent = value ? convert(value) : "1 22";
}

input.addEventListener("input", render);

tweetButton.addEventListener("click", () => {
  const text = output.textContent.trim();
  if (!text || text === "1 22") {
    return;
  }

  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener,noreferrer");
});

render();
