import { readFileSync, writeFileSync } from "fs";

function parseEntries(src) {
  const entryRe =
    /\{\s*id:\s*"([^"]+)",\s*num:\s*(\d+),\s*korean:\s*"((?:\\.|[^"\\])*)",\s*english:\s*"((?:\\.|[^"\\])*)",\s*lesson:\s*(\d+)\s*\}/g;
  const entries = [];
  let m;
  while ((m = entryRe.exec(src)) !== null) {
    entries.push({
      id: m[1],
      pdfNum: Number(m[2]),
      korean: m[3].replace(/\\"/g, '"'),
      english: m[4].replace(/\\"/g, '"'),
      lesson: Number(m[5]),
    });
  }
  return entries;
}

function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function writeGrammar(entries) {
  const sorted = [...entries].sort(
    (a, b) => a.lesson - b.lesson || a.pdfNum - b.pdfNum,
  );
  sorted.forEach((e, i) => {
    e.num = i + 1;
  });

  const lines = [
    `/** EPS-TOPIK grammar from PPS Korean school PDF (សួរពាក្យ) */`,
    `export interface EpsGrammarItem {`,
    `  id: string;`,
    `  num: number;`,
    `  korean: string;`,
    `  english: string;`,
    `  lesson: number;`,
    `}`,
    ``,
    `export const EPS_GRAMMAR_LESSON_LABELS: Record<number, string> = {`,
    `  1: "Basic endings & particles",`,
    `  2: "Copula & negation",`,
    `  3: "Existence & location",`,
    `  4: "Time expressions",`,
    `  5: "Past tense & counters",`,
    `  6: "Negation & honorifics",`,
    `  7: "Honorific verbs",`,
    `  8: "Object counters",`,
    `  11: "Grammar review",`,
    `  12: "Patterns & requests",`,
    `};`,
    ``,
    `export const epsTopikGrammar: EpsGrammarItem[] = [`,
  ];
  for (const w of sorted) {
    lines.push(
      `  { id: "${w.id}", num: ${w.num}, korean: "${esc(w.korean)}", english: "${esc(w.english)}", lesson: ${w.lesson} },`,
    );
  }
  lines.push(`];`, ``);
  lines.push(`export function getEpsGrammarByLesson(lesson: number) {`);
  lines.push(`  return epsTopikGrammar.filter((w) => w.lesson === lesson);`);
  lines.push(`}`, ``);
  lines.push(`export function searchEpsGrammar(query: string) {`);
  lines.push(`  const q = query.trim().toLowerCase();`);
  lines.push(`  if (!q) return epsTopikGrammar;`);
  lines.push(
    `  return epsTopikGrammar.filter((w) => w.korean.toLowerCase().includes(q) || w.english.toLowerCase().includes(q) || String(w.num).includes(q));`,
  );
  lines.push(`}`, ``);
  writeFileSync("src/data/eps-topik-grammar.ts", lines.join("\n"));
  console.log("Grammar renumbered:", sorted.length, "(1–" + sorted.length + ")");
}

function writeVocabulary(entries) {
  const sorted = [...entries].sort(
    (a, b) => a.lesson - b.lesson || a.pdfNum - b.pdfNum,
  );
  sorted.forEach((e, i) => {
    e.num = i + 1;
  });

  const lines = [
    `/** EPS-TOPIK vocabulary from PPS Korean school PDF (សួរពាក្យ) */`,
    `export interface EpsVocabWord {`,
    `  id: string;`,
    `  num: number;`,
    `  korean: string;`,
    `  english: string;`,
    `  lesson: number;`,
    `}`,
    ``,
    `export const EPS_VOCAB_LESSON_LABELS: Record<number, string> = {`,
    `  1: "Introduction & countries",`,
    `  2: "Objects & pronouns",`,
    `  3: "Places & daily life",`,
    `  4: "Time & food",`,
    `  5: "Schedule & routines",`,
    `  6: "Weather & family",`,
    `  7: "Personality & food",`,
    `  8: "Shopping & sizes",`,
    `  9: "Money & housework",`,
    `  10: "Chores & transport",`,
    `  11: "Transport & places",`,
    `};`,
    ``,
    `export const epsTopikVocabulary: EpsVocabWord[] = [`,
  ];
  for (const w of sorted) {
    lines.push(
      `  { id: "${w.id}", num: ${w.num}, korean: "${esc(w.korean)}", english: "${esc(w.english)}", lesson: ${w.lesson} },`,
    );
  }
  lines.push(`];`, ``);
  lines.push(`export function getEpsVocabularyByLesson(lesson: number) {`);
  lines.push(`  return epsTopikVocabulary.filter((w) => w.lesson === lesson);`);
  lines.push(`}`, ``);
  lines.push(`export function searchEpsVocabulary(query: string) {`);
  lines.push(`  const q = query.trim().toLowerCase();`);
  lines.push(`  if (!q) return epsTopikVocabulary;`);
  lines.push(
    `  return epsTopikVocabulary.filter((w) => w.korean.toLowerCase().includes(q) || w.english.toLowerCase().includes(q) || String(w.num).includes(q));`,
  );
  lines.push(`}`, ``);
  writeFileSync("src/data/eps-topik-vocabulary.ts", lines.join("\n"));
  console.log("Vocabulary renumbered:", sorted.length, "(1–" + sorted.length + ")");
}

const grammar = parseEntries(readFileSync("src/data/eps-topik-grammar.ts", "utf8"));
const vocabulary = parseEntries(
  readFileSync("src/data/eps-topik-vocabulary.ts", "utf8"),
);
writeGrammar(grammar);
writeVocabulary(vocabulary);
