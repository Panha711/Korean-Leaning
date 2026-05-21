import { readFileSync, writeFileSync } from "fs";

const src = readFileSync("src/data/eps-topik-vocabulary.ts", "utf8");
const entryRe =
  /\{\s*id:\s*"([^"]+)",\s*num:\s*(\d+),\s*korean:\s*"((?:\\.|[^"\\])*)",\s*english:\s*"((?:\\.|[^"\\])*)",\s*lesson:\s*(\d+)\s*\}/g;

const entries = [];
let m;
while ((m = entryRe.exec(src)) !== null) {
  entries.push({
    id: m[1],
    num: Number(m[2]),
    korean: m[3].replace(/\\"/g, '"'),
    english: m[4].replace(/\\"/g, '"'),
    lesson: Number(m[5]),
  });
}

const TOPIC_ONLY = new Set([
  "위치와 장소",
  "가구와 전자제품",
  "날짜와 요일",
  "하루 일과",
  "계절과 날씨",
  "가족과 친구",
  "외모와 성격",
  "음식 주문",
  "물건 구입",
  "물품 구매",
]);

function isGrammar(item) {
  const { korean, lesson } = item;
  if (TOPIC_ONLY.has(korean)) return false;
  if (korean.startsWith("-")) return true;
  if (korean.includes("→")) return true;
  if (korean.includes("=")) return true;
  if (lesson === 12) return true;
  return false;
}

const grammar = entries.filter(isGrammar);
const vocabulary = entries.filter((e) => !isGrammar(e) && !TOPIC_ONLY.has(e.korean));

function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function writeFile(path, type, items, lessonLabels) {
  const lines = [
    `/** EPS-TOPIK ${type} from PPS Korean school PDF (សួរពាក្យ) */`,
    `export interface Eps${type === "vocabulary" ? "VocabWord" : "GrammarItem"} {`,
    `  id: string;`,
    `  num: number;`,
    `  korean: string;`,
    `  english: string;`,
    `  lesson: number;`,
    `}`,
    ``,
    `export const EPS_${type === "vocabulary" ? "VOCAB" : "GRAMMAR"}_LESSON_LABELS: Record<number, string> = {`,
  ];
  for (const [k, v] of Object.entries(lessonLabels)) {
    lines.push(`  ${k}: "${v}",`);
  }
  lines.push(`};`, ``);
  const arr =
    type === "vocabulary" ? "epsTopikVocabulary" : "epsTopikGrammar";
  const sorted = [...items].sort(
    (a, b) => a.lesson - b.lesson || a.num - b.num,
  );
  sorted.forEach((w, i) => {
    w.num = i + 1;
  });

  lines.push(`export const ${arr}: Eps${type === "vocabulary" ? "VocabWord" : "GrammarItem"}[] = [`);
  for (const w of sorted) {
    lines.push(
      `  { id: "${w.id}", num: ${w.num}, korean: "${esc(w.korean)}", english: "${esc(w.english)}", lesson: ${w.lesson} },`,
    );
  }
  lines.push(`];`, ``);
  const fn = type === "vocabulary" ? "Vocabulary" : "Grammar";
  lines.push(`export function getEps${fn}ByLesson(lesson: number) {`);
  lines.push(`  return ${arr}.filter((w) => w.lesson === lesson);`);
  lines.push(`}`, ``);
  lines.push(`export function searchEps${fn}(query: string) {`);
  lines.push(`  const q = query.trim().toLowerCase();`);
  lines.push(`  if (!q) return ${arr};`);
  lines.push(
    `  return ${arr}.filter((w) => w.korean.toLowerCase().includes(q) || w.english.toLowerCase().includes(q) || String(w.num).includes(q));`,
  );
  lines.push(`}`, ``);
  writeFileSync(path, lines.join("\n"));
}

const vocabLabels = {
  1: "Introduction & countries",
  2: "Objects & pronouns",
  3: "Places & daily life",
  4: "Time & food",
  5: "Schedule & routines",
  6: "Weather & family",
  7: "Personality & food",
  8: "Shopping & sizes",
  9: "Money & housework",
  10: "Chores & transport",
  11: "Transport & places",
};

const grammarLabels = {
  1: "Basic endings & particles",
  2: "Copula & negation",
  3: "Existence & location",
  4: "Time expressions",
  5: "Past tense & counters",
  6: "Negation & honorifics",
  7: "Honorific verbs",
  8: "Object counters",
  11: "Grammar review",
  12: "Patterns & requests",
};

writeFile("src/data/eps-topik-vocabulary.ts", "vocabulary", vocabulary, vocabLabels);
writeFile("src/data/eps-topik-grammar.ts", "grammar", grammar, grammarLabels);

console.log("Vocabulary:", vocabulary.length, "Grammar:", grammar.length);
