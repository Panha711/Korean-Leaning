/**
 * Khmer translations for TOPIK I grammar example sentences (English → Khmer).
 * Run: node scripts/generate-grammar-example-khmer.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "fs";

const OUT = "src/data/topik-i-grammar-example-khmer-map.json";
const ENTRY_RE =
  /\{\s*id:\s*"(topik-g-\d+)"[^}]*exampleEnglish:\s*"([^"]+)"/g;

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

async function main() {
  const text = readFileSync("src/data/topik-i-grammar.ts", "utf8");
  const entries = [];
  let m;
  const itemRe =
    /\{\s*id:\s*"(topik-g-\d+)"[\s\S]*?exampleKorean:\s*"([^"]*)"[\s\S]*?exampleEnglish:\s*"([^"]*)"/g;
  while ((m = itemRe.exec(text))) {
    if (m[3]) entries.push({ id: m[1], exampleEnglish: m[3] });
  }

  const existing = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};
  console.log(`Found ${entries.length} examples → ${OUT}`);

  for (let i = 0; i < entries.length; i++) {
    const { id, exampleEnglish } = entries[i];
    if (existing[id]) continue;
    try {
      existing[id] = await translateEnToKm(exampleEnglish);
      console.log(`${i + 1}/${entries.length}`, exampleEnglish.slice(0, 50), "→", existing[id]);
      writeFileSync(OUT, JSON.stringify(existing, null, 2));
      await new Promise((r) => setTimeout(r, 350));
    } catch (err) {
      console.error("Stopped at", id, err.message);
      process.exit(1);
    }
  }
  console.log("Done.", Object.keys(existing).length, "entries");
}

main();
