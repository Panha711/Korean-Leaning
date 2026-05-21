/**
 * Fetches Khmer translations for EPS vocabulary (English → Khmer).
 * Run once: node scripts/generate-eps-khmer.mjs
 * Then: node scripts/apply-eps-khmer.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "fs";

const words = JSON.parse(
  readFileSync("scripts/vocab-export.json", "utf8"),
);

const outPath = "src/data/eps-vocab-khmer-map.json";
const existing = existsSync(outPath)
  ? JSON.parse(readFileSync(outPath, "utf8"))
  : {};

async function translate(text) {
  const url =
    "https://api.mymemory.translated.net/get?q=" +
    encodeURIComponent(text) +
    "&langpair=en|km";
  const res = await fetch(url);
  const data = await res.json();
  if (data.responseStatus !== 200) {
    throw new Error(data.responseDetails || "Translation failed");
  }
  return data.responseData.translatedText;
}

for (let i = 0; i < words.length; i++) {
  const w = words[i];
  if (existing[w.id]) continue;

  try {
    existing[w.id] = await translate(w.e);
    console.log(`${i + 1}/${words.length}`, w.e, "→", existing[w.id]);
    writeFileSync(outPath, JSON.stringify(existing, null, 2));
    await new Promise((r) => setTimeout(r, 400));
  } catch (err) {
    console.error("Stopped at", w.id, w.e, err.message);
    process.exit(1);
  }
}

console.log("Saved", Object.keys(existing).length, "translations to", outPath);
