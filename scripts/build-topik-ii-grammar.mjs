/**
 * Builds TOPIK II grammar (148 patterns) from scripts/TOPIK-II-Grammar.pdf
 * Run: python scripts/extract-topik-ii-pdf.py
 *      node scripts/build-topik-ii-grammar.mjs
 */
import { existsSync, readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";

const PARSED_JSON = "scripts/topik-ii-grammar-parsed.json";
const OUT = "src/data/topik-ii-grammar.ts";

const LESSON_LABELS = {
  1: "Patterns 1 — state & contrast",
  2: "Patterns 2 — intention & obligation",
  3: "Patterns 3 — speech & hearsay",
  4: "Patterns 4 — reason & experience",
  5: "Patterns 5 — condition & comparison",
};

function lessonForNum(num) {
  if (num <= 33) return 1;
  if (num <= 66) return 2;
  if (num <= 99) return 3;
  if (num <= 132) return 4;
  return 5;
}

if (!existsSync(PARSED_JSON)) {
  execSync("python scripts/extract-topik-ii-pdf.py", { stdio: "inherit" });
}

const rows = JSON.parse(readFileSync(PARSED_JSON, "utf8"));
const esc = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

const out = [
  `/** TOPIK II grammar — 148 patterns (TOPIK-II-Grammar.pdf) */`,
  `export interface TopikIIGrammarItem {`,
  `  id: string;`,
  `  num: number;`,
  `  korean: string;`,
  `  english: string;`,
  `  lesson: number;`,
  `  exampleKorean?: string;`,
  `  exampleEnglish?: string;`,
  `}`,
  ``,
  `export const TOPIK_II_GRAMMAR_LESSON_LABELS: Record<number, string> = {`,
  ...Object.entries(LESSON_LABELS).map(([k, v]) => `  ${k}: "${v}",`),
  `};`,
  ``,
  `export const topikIIGrammar: TopikIIGrammarItem[] = [`,
  ...rows.map((r) => {
    const lesson = lessonForNum(r.num);
    const exKo = r.exampleKorean ? `, exampleKorean: "${esc(r.exampleKorean)}"` : "";
    const exEn = r.exampleEnglish ? `, exampleEnglish: "${esc(r.exampleEnglish)}"` : "";
    return `  { id: "topik2-g-${r.num}", num: ${r.num}, korean: "${esc(r.korean)}", english: "${esc(r.english)}", lesson: ${lesson}${exKo}${exEn} },`;
  }),
  `];`,
  ``,
  `export function searchTopikIIGrammar(query: string): TopikIIGrammarItem[] {`,
  `  const q = query.trim().toLowerCase();`,
  `  if (!q) return topikIIGrammar;`,
  `  return topikIIGrammar.filter(`,
  `    (g) =>`,
  `      g.korean.toLowerCase().includes(q) ||`,
  `      g.english.toLowerCase().includes(q) ||`,
  `      g.exampleKorean?.toLowerCase().includes(q) ||`,
  `      g.exampleEnglish?.toLowerCase().includes(q) ||`,
  `      String(g.num).includes(q),`,
  `  );`,
  `}`,
  ``,
].join("\n");

writeFileSync(OUT, out);
console.log(`Wrote ${rows.length} patterns to ${OUT}`);
