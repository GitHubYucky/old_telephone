const table = [
  ["あ", "い", "う", "え", "お"],
  ["か", "き", "く", "け", "こ"],
  ["さ", "し", "す", "せ", "そ"],
  ["た", "ち", "つ", "て", "と"],
  ["な", "に", "ぬ", "ね", "の"],
  ["は", "ひ", "ふ", "へ", "ほ"],
  ["ま", "み", "む", "め", "も"],
  ["や", "ゆ", "よ"],
  ["ら", "り", "る", "れ", "ろ"],
  ["わ", "を", "ん"]
];

const smallToLarge = {
  "ぁ": "あ",
  "ぃ": "い",
  "ぅ": "う",
  "ぇ": "え",
  "ぉ": "お",
  "ゃ": "や",
  "ゅ": "ゆ",
  "ょ": "よ",
  "ゎ": "わ",
  "っ": "つ"
};

const charToDigits = new Map();

table.forEach((group, row) => {
  const key = row === 0 ? "1" : String(row + 1);
  group.forEach((ch, index) => {
    charToDigits.set(ch, key.repeat(index + 1));
  });
});

// 例: が -> か, ぱ -> は のように分解して基本かなへ寄せる
function normalizeKana(char) {
  const kataToHira = char.replace(/[ァ-ン]/g, (s) =>
    String.fromCharCode(s.charCodeAt(0) - 0x60)
  );
  const decomposed = kataToHira.normalize("NFD").replace(/[\u3099\u309A]/g, "");
  return smallToLarge[decomposed] || decomposed;
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

function render() {
  const value = input.value.trim();
  output.textContent = value ? convert(value) : "1 22";
}

input.addEventListener("input", render);
render();
