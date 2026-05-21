/**
 * Builds TOPIK I vocabulary (cards 1–1671) from Tammy Korean word list HTML.
 * Source: http://learning-korean.com/elementary/20210101-10466/
 * Run: node scripts/build-topik-i-vocabulary.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "fs";

const SOURCE = "scripts/topik-i-1671-source.html";
const ROW_RE =
  /<td class="column-1">(\d+)<\/td><td class="column-2">([^<]+)<\/td><td class="column-3">([^<]+)<\/td>/g;

const html = readFileSync(SOURCE, "utf8");
const epsFile = readFileSync("src/data/eps-topik-vocabulary.ts", "utf8");
const topikKmPath = "src/data/topik-i-khmer-map.json";
const topikKmById = existsSync(topikKmPath)
  ? JSON.parse(readFileSync(topikKmPath, "utf8"))
  : {};

const koToKm = new Map();
const epsRe =
  /korean: "([^"]+)", english: "([^"]+)", khmer: "([^"]+)", lesson: (\d+)/g;
let m;
while ((m = epsRe.exec(epsFile))) {
  const ko = m[1];
  const km = m[3];
  if (km) koToKm.set(ko, km);
}

function lookupKhmer(id, korean) {
  const fromMap = topikKmById[id];
  if (fromMap?.trim()) return fromMap.trim();
  if (koToKm.get(korean)) return koToKm.get(korean);
  const base = korean.split("/")[0].trim();
  return koToKm.get(base) ?? "";
}

/** ~40 cards per PDF page → 42 deck groups */
const CARDS_PER_DECK = 40;

function deckForNum(num) {
  return Math.ceil(num / CARDS_PER_DECK);
}

function deckLabel(deck) {
  const start = (deck - 1) * CARDS_PER_DECK + 1;
  const end = Math.min(deck * CARDS_PER_DECK, 1671);
  return `Cards ${start}–${end}`;
}

const entries = [];
let match;
while ((match = ROW_RE.exec(html))) {
  const num = Number(match[1]);
  const korean = match[2].trim();
  const english = match[3].trim();
  const deck = deckForNum(num);
  entries.push({
    id: `topik-${num}`,
    num,
    korean,
    english,
    khmer: lookupKhmer(`topik-${num}`, korean),
    deck,
  });
}

entries.sort((a, b) => a.num - b.num);

if (entries.length !== 1671) {
  console.error(`Expected 1671 entries, got ${entries.length}`);
  process.exit(1);
}

const deckNums = [...new Set(entries.map((e) => e.deck))].sort((a, b) => a - b);
const withKhmer = entries.filter((e) => e.khmer).length;

const esc = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

const out = [
  `/** TOPIK I beginner vocabulary — cards 1–1671 (Tammy Korean / TOPIK-I-1671 deck) */`,
  `export interface TopikVocabWord {`,
  `  id: string;`,
  `  num: number;`,
  `  korean: string;`,
  `  english: string;`,
  `  khmer: string;`,
  `  deck: number;`,
  `}`,
  ``,
  `export const TOPIK_I_DECK_LABELS: Record<number, string> = {`,
  ...deckNums.map((d) => `  ${d}: "${deckLabel(d)}",`),
  `};`,
  ``,
  `export const topikIVocabulary: TopikVocabWord[] = [`,
  ...entries.map(
    (e) =>
      `  { id: "${e.id}", num: ${e.num}, korean: "${esc(e.korean)}", english: "${esc(e.english)}", khmer: "${esc(e.khmer)}", deck: ${e.deck} },`,
  ),
  `];`,
  ``,
  `export function searchTopikVocabulary(query: string): TopikVocabWord[] {`,
  `  const q = query.trim().toLowerCase();`,
  `  if (!q) return topikIVocabulary;`,
  `  return topikIVocabulary.filter(`,
  `    (w) =>`,
  `      w.korean.toLowerCase().includes(q) ||`,
  `      w.english.toLowerCase().includes(q) ||`,
  `      w.khmer.toLowerCase().includes(q) ||`,
  `      String(w.num).includes(q),`,
  `  );`,
  `}`,
  ``,
];

writeFileSync("src/data/topik-i-vocabulary.ts", out.join("\n"));
console.log(`Wrote ${entries.length} TOPIK I entries (${withKhmer} with Khmer)`);
