/**
 * Khmer translations for TOPIK II grammar example sentences (English → Khmer).
 * Run: node scripts/generate-topik-ii-grammar-example-khmer.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "fs";

const SOURCE = "src/data/topik-ii-grammar.ts";
const OUT = "src/data/topik-ii-grammar-example-khmer-map.json";
const DELAY_MS = 180;

function cleanKhmer(s) {
  if (!s) return "";
  return s
    .replace(/MYMEMORY WARNING[^.]*\./gi, "")
    .replace(/\(link[^)]*\)/gi, "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .normalize("NFC");
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

async function translateMyMemory(text) {
  const email = process.env.MYMEMORY_EMAIL?.trim();
  const params = new URLSearchParams({
    q: text.slice(0, 400),
    langpair: "en|km",
  });
  if (email) params.set("de", email);
  const res = await fetch(`https://api.mymemory.translated.net/get?${params}`);
  const data = await res.json();
  if (data.responseStatus !== 200) {
    throw new Error(data.responseDetails || "Translation failed");
  }
  const raw = data.responseData?.translatedText ?? "";
  if (/MYMEMORY\s+WARNING/i.test(raw)) {
    throw new Error(raw.slice(0, 120));
  }
  return cleanKhmer(raw);
}

async function translateLine(english) {
  try {
    const g = await translateGoogle(english);
    if (g) return g;
  } catch {
    /* fall through */
  }
  return translateMyMemory(english);
}

function parseExamples(file) {
  const text = readFileSync(file, "utf8");
  const entries = [];
  const itemRe =
    /\{\s*id:\s*"(topik2-g-\d+)"[\s\S]*?exampleKorean:\s*"([^"]*)"[\s\S]*?exampleEnglish:\s*"([^"]*)"/g;
  let m;
  while ((m = itemRe.exec(text))) {
    if (m[3]) entries.push({ id: m[1], exampleEnglish: m[3] });
  }
  return entries;
}

async function main() {
  const entries = parseExamples(SOURCE);
  const existing = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};
  console.log(`Found ${entries.length} examples → ${OUT}`);

  for (let i = 0; i < entries.length; i++) {
    const { id, exampleEnglish } = entries[i];
    if (existing[id]) continue;
    try {
      existing[id] = await translateLine(exampleEnglish);
      console.log(`${i + 1}/${entries.length}`, exampleEnglish.slice(0, 50), "→", existing[id]);
      writeFileSync(OUT, JSON.stringify(existing, null, 2));
      await new Promise((r) => setTimeout(r, DELAY_MS));
    } catch (err) {
      console.error("Stopped at", id, err.message);
      writeFileSync(OUT, JSON.stringify(existing, null, 2));
      process.exit(1);
    }
  }
  console.log("Done.", Object.keys(existing).length, "entries");
}

main();
