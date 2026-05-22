/**
 * Bulk-fix Khmer translations in vocab data files using Gemini 2.5 Flash.
 *
 * Reads:
 *   - src/data/topik-i-vocabulary.ts
 *   - src/data/eps-topik-vocabulary.ts
 *
 * Writes corrected Khmer back into each file in place (with timestamped .bak backup).
 * Caches results in scripts/.gemini-khmer-cache.json so re-runs resume where they stopped.
 *
 * Run: node scripts/gemini-fix-khmer.mjs            (both files)
 *      node scripts/gemini-fix-khmer.mjs topik      (only TOPIK I)
 *      node scripts/gemini-fix-khmer.mjs eps        (only EPS-TOPIK)
 *      node scripts/gemini-fix-khmer.mjs --reset    (clear cache and start over)
 */
import { readFileSync, writeFileSync, existsSync, copyFileSync } from "fs";
import { GoogleGenAI, Type } from "@google/genai";
import "dotenv/config";

const apiKey = process.env.GEMINI_API_KEY?.trim();
if (!apiKey) {
  console.error("Missing GEMINI_API_KEY in .env");
  process.exit(1);
}

const BATCH_SIZE = 50;
const DELAY_MS = 7000;
const CACHE_PATH = "scripts/.gemini-khmer-cache.json";

const args = process.argv.slice(2);
if (args.includes("--reset") && existsSync(CACHE_PATH)) {
  writeFileSync(CACHE_PATH, "{}");
  console.log("Cache cleared.");
}

const onlyTopik = args.includes("topik");
const onlyEps = args.includes("eps");
const runTopik = !onlyEps;
const runEps = !onlyTopik;

const ai = new GoogleGenAI({ apiKey });

const cache = existsSync(CACHE_PATH)
  ? JSON.parse(readFileSync(CACHE_PATH, "utf8"))
  : {};

function saveCache() {
  writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

function escStr(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

async function batchTranslate(items) {
  const prompt = [
    "You are a Korean → Khmer dictionary. For each Korean word/phrase below, return the most accurate, concise Khmer translation.",
    "Rules:",
    "- Return ONLY a JSON array of Khmer strings, same order and length as input.",
    "- Use natural, dictionary-style Khmer. No romanization, no English, no parentheses.",
    "- For verbs, use the base/dictionary form in Khmer.",
    "- Keep it short — one or two Khmer words is usually enough.",
    "",
    "Input:",
    ...items.map((w, i) => `${i + 1}. ${w.korean} (English hint: ${w.english})`),
  ].join("\n");

  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
    },
  });

  const text = result.text;
  if (!text) throw new Error("Empty response from Gemini");
  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed) || parsed.length !== items.length) {
    throw new Error(
      `Expected ${items.length} translations, got ${Array.isArray(parsed) ? parsed.length : "non-array"}`,
    );
  }
  const cleaned = parsed.map((s) => String(s).trim());

  // Validate: catch model loops / corrupted output.
  for (let i = 0; i < cleaned.length; i++) {
    const v = cleaned[i];
    if (!v) throw new Error(`Empty translation at index ${i} (korean=${items[i].korean})`);
    if (/[\r\n\t]/.test(v)) throw new Error(`Translation contains newline/tab at index ${i}: ${JSON.stringify(v)}`);
    if (v.length > 80) throw new Error(`Translation too long (${v.length} chars) at index ${i}: ${JSON.stringify(v)}`);
  }
  // Degenerate-loop detector: if >30% of a batch share the same value, treat as model failure.
  if (cleaned.length >= 10) {
    const counts = new Map();
    for (const v of cleaned) counts.set(v, (counts.get(v) ?? 0) + 1);
    const [topVal, topCount] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    if (topCount / cleaned.length > 0.3) {
      throw new Error(
        `Degenerate batch: ${topCount}/${cleaned.length} translations are "${topVal}" — model likely looped`,
      );
    }
  }

  return cleaned;
}

function parseEntries(src, format) {
  // Captures id, korean, english, khmer from each entry
  const re =
    format === "topik"
      ? /id:\s*"([^"]+)"\s*,\s*num:\s*\d+\s*,\s*korean:\s*"([^"]+)"\s*,\s*english:\s*"([^"]+)"\s*,\s*khmer:\s*"([^"]*)"\s*,\s*deck/g
      : /id:\s*"([^"]+)"\s*,\s*num:\s*\d+\s*,\s*korean:\s*"([^"]+)"\s*,\s*english:\s*"([^"]+)"\s*,\s*khmer:\s*"([^"]*)"\s*,\s*lesson/g;
  const entries = [];
  let m;
  while ((m = re.exec(src))) {
    entries.push({ id: m[1], korean: m[2], english: m[3], khmer: m[4] });
  }
  return entries;
}

function replaceKhmerForId(src, id, newKhmer) {
  // Match the object containing this id and swap the khmer value within it.
  const re = new RegExp(
    `(\\{[^}]*?id:\\s*"${id.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}"[^}]*?khmer:\\s*")[^"]*("[^}]*?\\})`,
    "s",
  );
  if (!re.test(src)) {
    console.warn(`  could not locate object for id=${id}`);
    return src;
  }
  return src.replace(re, `$1${escStr(newKhmer)}$2`);
}

async function processFile(label, path, format) {
  console.log(`\n=== ${label} (${path}) ===`);
  if (!existsSync(path)) {
    console.error(`  file not found: ${path}`);
    return;
  }

  const entries = parseEntries(readFileSync(path, "utf8"), format);
  console.log(`  parsed ${entries.length} entries`);

  const todo = entries.filter((e) => !cache[e.id]);
  console.log(`  ${todo.length} need translation (${entries.length - todo.length} cached)`);

  const totalBatches = Math.ceil(todo.length / BATCH_SIZE);
  for (let i = 0; i < todo.length; i += BATCH_SIZE) {
    const batch = todo.slice(i, i + BATCH_SIZE);
    const n = Math.floor(i / BATCH_SIZE) + 1;
    process.stdout.write(`  batch ${n}/${totalBatches} (${batch.length} words)... `);
    try {
      const translations = await batchTranslate(batch);
      batch.forEach((w, idx) => {
        cache[w.id] = translations[idx];
      });
      saveCache();
      console.log("ok");
    } catch (err) {
      console.log(`FAILED: ${err.message ?? err}`);
      console.log("  (saving progress; you can re-run to resume)");
      saveCache();
    }
    if (i + BATCH_SIZE < todo.length) {
      await new Promise((r) => setTimeout(r, DELAY_MS));
    }
  }

  // Write back to file
  const backup = `${path}.bak.${Date.now()}`;
  copyFileSync(path, backup);
  console.log(`  backup → ${backup}`);

  let src = readFileSync(path, "utf8");
  let changed = 0;
  for (const e of entries) {
    const next = cache[e.id];
    if (!next || next === e.khmer) continue;
    const updated = replaceKhmerForId(src, e.id, next);
    if (updated !== src) {
      src = updated;
      changed++;
    }
  }
  writeFileSync(path, src);
  console.log(`  rewrote ${path} (${changed} translations changed)`);
}

if (runTopik) {
  await processFile("TOPIK I", "src/data/topik-i-vocabulary.ts", "topik");
}
if (runEps) {
  await processFile("EPS-TOPIK", "src/data/eps-topik-vocabulary.ts", "eps");
}

console.log("\nDone. Inspect the diff with `git diff src/data/` before committing.");
