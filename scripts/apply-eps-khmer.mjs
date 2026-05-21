/**
 * Injects khmer field into eps-topik-vocabulary.ts from eps-vocab-khmer-map.json
 */
import { readFileSync, writeFileSync } from "fs";

const km = JSON.parse(
  readFileSync("src/data/eps-vocab-khmer-map.json", "utf8"),
);
let src = readFileSync("src/data/eps-topik-vocabulary.ts", "utf8");

if (!src.includes("khmer:")) {
  src = src.replace(
    "  english: string;\n  lesson: number;",
    "  english: string;\n  khmer: string;\n  lesson: number;",
  );
}

src = src.replace(
  /\{ id: "([^"]+)", num: (\d+), korean: "((?:[^"\\]|\\.)*)", english: "((?:[^"\\]|\\.)*)"(?:, khmer: "((?:[^"\\]|\\.)*)")?, lesson: (\d+) \}/g,
  (full, id, num, korean, english, _oldKhmer, lesson) => {
    const kh = km[id];
    if (!kh) return full;
    const esc = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    return `{ id: "${id}", num: ${num}, korean: "${korean}", english: "${english}", khmer: "${esc(kh)}", lesson: ${lesson} }`;
  },
);

src = src.replace(
  /w\.korean\.toLowerCase\(\)\.includes\(q\) \|\| w\.english\.toLowerCase\(\)\.includes\(q\)/,
  "w.korean.toLowerCase().includes(q) || w.english.toLowerCase().includes(q) || w.khmer.toLowerCase().includes(q)",
);

writeFileSync("src/data/eps-topik-vocabulary.ts", src);
console.log("Updated vocabulary with Khmer fields");
