/**
 * Fixes common Khmer Unicode issues (wrong vowel order, zero-width spaces).
 */
import { readFileSync, writeFileSync } from "fs";

const REPLACEMENTS = [
  ["មឺុន", "ម៉ឺន"],
];

function fixKhmer(text) {
  let s = text
    .replace(/[\u200B-\u200D\uFEFF\u00A0]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  for (const [from, to] of REPLACEMENTS) {
    s = s.split(from).join(to);
  }
  return s.normalize("NFC");
}

// Vocabulary TS
let vocab = readFileSync("src/data/eps-topik-vocabulary.ts", "utf8");
vocab = vocab.replace(/khmer: "((?:[^"\\]|\\.)*)"/g, (_, raw) => {
  const unescaped = raw.replace(/\\"/g, '"').replace(/\\\\/g, "\\");
  const fixed = fixKhmer(unescaped);
  const escaped = fixed.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return `khmer: "${escaped}"`;
});
writeFileSync("src/data/eps-topik-vocabulary.ts", vocab);

// JSON map
const km = JSON.parse(readFileSync("src/data/eps-vocab-khmer-map.json", "utf8"));
for (const id of Object.keys(km)) {
  km[id] = fixKhmer(km[id]);
}
writeFileSync("src/data/eps-vocab-khmer-map.json", JSON.stringify(km, null, 2));

console.log("Fixed Khmer Unicode in vocabulary data");
