/**
 * One-shot: apply scripts/.gemini-khmer-cache.json values to vocab data files
 * without calling Gemini. Used to repair a partially broken file from cache.
 *
 * Run: node scripts/apply-khmer-cache.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "fs";

const CACHE_PATH = "scripts/.gemini-khmer-cache.json";
if (!existsSync(CACHE_PATH)) {
  console.error("Cache not found:", CACHE_PATH);
  process.exit(1);
}

const cache = JSON.parse(readFileSync(CACHE_PATH, "utf8"));

function escStr(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function isValid(v) {
  if (typeof v !== "string") return false;
  if (!v.trim()) return false;
  if (/[\r\n\t]/.test(v)) return false;
  if (v.length > 80) return false;
  return true;
}

function apply(path, idPrefix) {
  let src = readFileSync(path, "utf8");
  let changed = 0;
  let skipped = 0;
  let missing = 0;

  for (const [id, khmer] of Object.entries(cache)) {
    if (!id.startsWith(idPrefix)) continue;
    if (!isValid(khmer)) {
      skipped++;
      continue;
    }
    const idEsc = id.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const re = new RegExp(
      `(\\{[^}]*?id:\\s*"${idEsc}"[^}]*?khmer:\\s*")[^"]*("[^}]*?\\})`,
      "s",
    );
    if (!re.test(src)) {
      missing++;
      continue;
    }
    const before = src;
    src = src.replace(re, `$1${escStr(khmer)}$2`);
    if (src !== before) changed++;
  }

  writeFileSync(path, src);
  console.log(`${path}: changed=${changed}, skipped=${skipped}, missing=${missing}`);
}

apply("src/data/topik-i-vocabulary.ts", "topik-");
apply("src/data/eps-topik-vocabulary.ts", "eps-");
apply("src/data/eps-topik-vocabulary.ts", "ds-");
