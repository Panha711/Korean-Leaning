/**
 * Builds TOPIK II vocabulary (2662 words) from scripts/topik-ii-vocab.pdf
 * Run: python scripts/extract-topik-ii-pdf.py  (first time / after PDF change)
 *      node scripts/build-topik-ii-vocabulary.mjs
 */
import { existsSync, readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";

const PDF = "scripts/topik-ii-vocab.pdf";
const PARSED_JSON = "scripts/topik-ii-vocab-parsed.json";
const OUT = "src/data/topik-ii-vocabulary.ts";
const CARDS_PER_DECK = 80;

function deckForNum(num) {
  return Math.ceil(num / CARDS_PER_DECK);
}

function deckLabel(deck) {
  const start = (deck - 1) * CARDS_PER_DECK + 1;
  const end = Math.min(deck * CARDS_PER_DECK, 2662);
  return `Cards ${start}–${end}`;
}

function lookupKhmer(id, korean) {
  const topikKmPath = "src/data/topik-i-khmer-map.json";
  const topikKmById = existsSync(topikKmPath)
    ? JSON.parse(readFileSync(topikKmPath, "utf8"))
    : {};
  const fromMap = topikKmById[id.replace("topik2-", "topik-")];
  if (fromMap?.trim()) return fromMap.trim();

  if (!existsSync("src/data/eps-topik-vocabulary.ts")) return "";
  const epsFile = readFileSync("src/data/eps-topik-vocabulary.ts", "utf8");
  const koToKm = new Map();
  const epsRe = /korean: "([^"]+)", english: "([^"]+)", khmer: "([^"]+)"/g;
  let m;
  while ((m = epsRe.exec(epsFile))) {
    if (m[3]) koToKm.set(m[1], m[3]);
  }
  return koToKm.get(korean) ?? koToKm.get(korean.split("/")[0].trim()) ?? "";
}

if (!existsSync(PARSED_JSON)) {
  if (!existsSync(PDF)) {
    console.error(`Missing ${PDF}. Copy topik-2662.pdf to scripts/topik-ii-vocab.pdf`);
    process.exit(1);
  }
  execSync("python scripts/extract-topik-ii-pdf.py", { stdio: "inherit" });
}

const entries = JSON.parse(readFileSync(PARSED_JSON, "utf8"));
entries.sort((a, b) => a.num - b.num);

if (entries.length < 2600) {
  console.error(`Expected ~2662 entries, got ${entries.length}`);
  process.exit(1);
}

const deckNums = [...new Set(entries.map((e) => deckForNum(e.num)))].sort((a, b) => a - b);
const withKhmer = entries.filter((e) => e.khmer).length;
const esc = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

const out = [
  `/** TOPIK II intermediate vocabulary — 2662 words (topik-2662.pdf) */`,
  `export interface TopikIIVocabWord {`,
  `  id: string;`,
  `  num: number;`,
  `  korean: string;`,
  `  english: string;`,
  `  khmer: string;`,
  `  deck: number;`,
  `}`,
  ``,
  `export const TOPIK_II_DECK_LABELS: Record<number, string> = {`,
  ...deckNums.map((d) => `  ${d}: "${deckLabel(d)}",`),
  `};`,
  ``,
  `export const topikIIVocabulary: TopikIIVocabWord[] = [`,
  ...entries.map((e) => {
    const deck = deckForNum(e.num);
    const id = `topik2-${e.num}`;
    const khmer = e.khmer || lookupKhmer(id, e.korean);
    return `  { id: "${id}", num: ${e.num}, korean: "${esc(e.korean)}", english: "${esc(e.english)}", khmer: "${esc(khmer)}", deck: ${deck} },`;
  }),
  `];`,
  ``,
  `export function searchTopikIIVocabulary(query: string): TopikIIVocabWord[] {`,
  `  const q = query.trim().toLowerCase();`,
  `  if (!q) return topikIIVocabulary;`,
  `  return topikIIVocabulary.filter(`,
  `    (w) =>`,
  `      w.korean.toLowerCase().includes(q) ||`,
  `      w.english.toLowerCase().includes(q) ||`,
  `      w.khmer.toLowerCase().includes(q) ||`,
  `      String(w.num).includes(q),`,
  `  );`,
  `}`,
  ``,
].join("\n");

writeFileSync(OUT, out);
console.log(`Wrote ${entries.length} words to ${OUT} (${withKhmer} with Khmer)`);
