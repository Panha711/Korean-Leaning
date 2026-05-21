/**
 * English → Khmer for EPS & TOPIK I grammar patterns.
 * Run: node scripts/generate-grammar-khmer.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "fs";

const DELAY_MS = 350;

const SOURCES = [
  {
    file: "src/data/eps-topik-grammar.ts",
    out: "src/data/eps-grammar-khmer-map.json",
  },
  {
    file: "src/data/topik-i-grammar.ts",
    out: "src/data/topik-i-grammar-khmer-map.json",
  },
  {
    file: "src/data/topik-ii-grammar.ts",
    out: "src/data/topik-ii-grammar-khmer-map.json",
  },
];

const ENTRY_RE =
  /\{\s*id:\s*"([^"]+)",\s*num:\s*\d+,\s*korean:\s*"([^"]+)",\s*english:\s*"([^"]+)"/g;

function cleanKhmer(s) {
  if (!s) return "";
  return s
    .replace(/MYMEMORY WARNING[^.]*\./gi, "")
    .replace(/\(link[^)]*\)/gi, "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .normalize("NFC");
}

function englishGloss(english) {
  return english
    .replace(/\([^)]*\)/g, " ")
    .split(/[,;/]/)
    .map((s) => s.trim())
    .filter(Boolean)[0]
    ?.slice(0, 180) ?? english.slice(0, 180);
}

function loadKoToKm() {
  const map = new Map();

  const eps = readFileSync("src/data/eps-topik-vocabulary.ts", "utf8");
  const epsRe = /korean: "([^"]+)", english: "([^"]+)", khmer: "([^"]+)"/g;
  let m;
  while ((m = epsRe.exec(eps))) {
    if (m[3]) map.set(m[1], m[3]);
  }

  const cleanup = readFileSync("scripts/cleanup-khmer-map.mjs", "utf8");
  const block = cleanup.match(/const BY_KOREAN = \{([\s\S]*?)\n\};/);
  if (block) {
    const entryRe = /^\s+(?:"([^"]+)"|([^:\n]+)):\s*"([^"]*)"/gm;
    let em;
    while ((em = entryRe.exec(block[1]))) {
      const key = (em[1] || em[2]).trim();
      const val = em[3];
      if (key && val && !key.startsWith("//")) map.set(key, val);
    }
  }

  return map;
}

function parseGrammar(file) {
  const text = readFileSync(file, "utf8");
  const entries = [];
  let match;
  while ((match = ENTRY_RE.exec(text))) {
    entries.push({ id: match[1], korean: match[2], english: match[3] });
  }
  return entries;
}

async function translateEnToKm(text) {
  const url =
    "https://api.mymemory.translated.net/get?q=" +
    encodeURIComponent(text) +
    "&langpair=en|km";
  const res = await fetch(url);
  const data = await res.json();
  if (data.responseStatus !== 200) {
    throw new Error(data.responseDetails || "Translation failed");
  }
  return cleanKhmer(data.responseData.translatedText);
}

async function main() {
  const koToKm = loadKoToKm();

  for (const { file, out } of SOURCES) {
    const existing = existsSync(out) ? JSON.parse(readFileSync(out, "utf8")) : {};
    const entries = parseGrammar(file);
    console.log(`\n${file}: ${entries.length} patterns → ${out}`);

    for (let i = 0; i < entries.length; i++) {
      const { id, korean, english } = entries[i];
      if (existing[id]) continue;

      let khmer = koToKm.get(korean) || "";
      if (!khmer) {
        try {
          khmer = await translateEnToKm(englishGloss(english));
          await new Promise((r) => setTimeout(r, DELAY_MS));
        } catch (err) {
          console.error("Stopped at", id, err.message);
          writeFileSync(out, JSON.stringify(existing, null, 2));
          process.exit(1);
        }
      }

      existing[id] = khmer;
      console.log(`${i + 1}/${entries.length}`, korean, "→", khmer || "(empty)");
      writeFileSync(out, JSON.stringify(existing, null, 2));
    }

    console.log("Saved", Object.keys(existing).length, "entries to", out);
  }
}

main();
