/**
 * Khmer for each daily-sentence line (English → Khmer).
 * Run: node scripts/generate-daily-sentence-khmer.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "fs";

const OUT = "src/data/daily-sentence-line-khmer-map.json";
const DELAY_MS = 180;

function cleanKhmer(s) {
  if (!s) return "";
  return s
    .replace(/MYMEMORY WARNING[^.]*\./gi, "")
    .replace(/MYMEMORY[^.]*\./gi, "")
    .replace(/\(link[^)]*\)/gi, "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .normalize("NFC");
}

function parseDialogueLines(text) {
  const items = [];
  const parts = text.split(/\{\s*id:\s*"(ds-\d+)"/);
  for (let i = 1; i < parts.length; i += 2) {
    const groupId = parts[i];
    const block = parts[i + 1];
    const lineRe = /korean:\s*"((?:\\.|[^"\\])*)",\s*english:\s*"((?:\\.|[^"\\])*)"/g;
    let lineIndex = 0;
    let m;
    while ((m = lineRe.exec(block))) {
      const english = m[2].replace(/\\"/g, '"');
      items.push({
        key: `${groupId}:${lineIndex}`,
        english,
      });
      lineIndex++;
    }
  }
  return items;
}

async function translateGoogle(text) {
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=km&dt=t&q=" +
    encodeURIComponent(text.slice(0, 400));
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Google translate HTTP ${res.status}`);
  const data = await res.json();
  const parts = data[0]?.map((row) => row[0]).join("") ?? "";
  return cleanKhmer(parts);
}

async function translateEnToKm(text) {
  const url =
    "https://api.mymemory.translated.net/get?q=" +
    encodeURIComponent(text.slice(0, 400)) +
    "&langpair=en|km";
  const res = await fetch(url);
  const data = await res.json();
  if (data.responseStatus !== 200) {
    throw new Error(data.responseDetails || "Translation failed");
  }
  return cleanKhmer(data.responseData.translatedText);
}

async function translateLine(english) {
  try {
    const g = await translateGoogle(english);
    if (g) return g;
  } catch {
    /* fall through */
  }
  return translateEnToKm(english);
}

async function main() {
  const text = readFileSync("src/data/daily-sentences.ts", "utf8");
  const lines = parseDialogueLines(text);
  const existing = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};

  console.log(`Found ${lines.length} lines → ${OUT}`);

  for (let i = 0; i < lines.length; i++) {
    const { key, english } = lines[i];
    if (existing[key]) continue;
    try {
      existing[key] = await translateLine(english);
      console.log(`${i + 1}/${lines.length}`, key, "→", existing[key]);
      writeFileSync(OUT, JSON.stringify(existing, null, 2));
      await new Promise((r) => setTimeout(r, DELAY_MS));
    } catch (err) {
      console.error("Stopped at", key, err.message);
      process.exit(1);
    }
  }
  console.log("Done.", Object.keys(existing).length, "lines");
}

main();
