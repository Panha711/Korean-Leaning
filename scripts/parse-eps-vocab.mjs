import { readFileSync, writeFileSync } from "fs";

const raw = readFileSync("scripts/eps-vocab-raw.txt", "utf8");

const lessonRanges = [
  [1, 35, 1],
  [36, 70, 2],
  [71, 110, 3],
  [111, 154, 4],
  [155, 199, 5],
  [200, 244, 6],
  [245, 290, 7],
  [291, 337, 8],
  [338, 383, 9],
  [384, 429, 10],
  [430, 454, 11],
  [455, 999, 12],
];

function getLesson(num) {
  for (const [min, max, lesson] of lessonRanges) {
    if (num >= min && num <= max) return lesson;
  }
  return 12;
}

const words = new Map();

for (const line of raw.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed) continue;
  const re = /(\d+)\s+([^\d]+?)(?=\s+\d+\s+|$)/g;
  let m;
  while ((m = re.exec(trimmed)) !== null) {
    const num = Number(m[1]);
    const korean = m[2].trim();
    if (!korean || korean.length > 60) continue;
    if (!words.has(num)) words.set(num, korean);
  }
}

const sorted = [...words.entries()]
  .sort((a, b) => a[0] - b[0])
  .map(([num, korean]) => ({
    id: `eps-${num}`,
    num,
    korean,
    lesson: getLesson(num),
  }));

console.log("Parsed", sorted.length, "words");

const lines = [
  `/** EPS-TOPIK vocabulary from PPS Korean school PDF (សួរពាក្យ) */`,
  `export interface EpsVocabWord {`,
  `  id: string;`,
  `  num: number;`,
  `  korean: string;`,
  `  lesson: number;`,
  `}`,
  ``,
  `export const EPS_LESSON_LABELS: Record<number, string> = {`,
  `  1: "Introduction & countries",`,
  `  2: "Objects & pronouns",`,
  `  3: "Places & daily verbs",`,
  `  4: "Time & food",`,
  `  5: "Schedule & seasons",`,
  `  6: "Weather & family",`,
  `  7: "Honorifics & personality",`,
  `  8: "Counters & shopping",`,
  `  9: "Housework & kitchen",`,
  `  10: "Transport & grammar review",`,
  `  11: "More transport",`,
  `  12: "Grammar patterns",`,
  `};`,
  ``,
  `export const epsTopikVocabulary: EpsVocabWord[] = [`,
];

for (const w of sorted) {
  const safe = w.korean.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  lines.push(`  { id: "${w.id}", num: ${w.num}, korean: "${safe}", lesson: ${w.lesson} },`);
}

lines.push(`];`, ``);
lines.push(`export function getEpsWordsByLesson(lesson: number): EpsVocabWord[] {`);
lines.push(`  return epsTopikVocabulary.filter((w) => w.lesson === lesson);`);
lines.push(`}`, ``);
lines.push(`export function searchEpsVocabulary(query: string): EpsVocabWord[] {`);
lines.push(`  const q = query.trim().toLowerCase();`);
lines.push(`  if (!q) return epsTopikVocabulary;`);
lines.push(`  return epsTopikVocabulary.filter((w) => w.korean.toLowerCase().includes(q) || String(w.num).includes(q));`);
lines.push(`}`, ``);

writeFileSync("src/data/eps-topik-vocabulary.ts", lines.join("\n"));
console.log("Wrote src/data/eps-topik-vocabulary.ts");
