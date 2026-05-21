/**
 * Fills Khmer for all TOPIK I vocabulary (English → Khmer via MyMemory).
 * Uses EPS + curated Korean map first; translates only missing entries.
 *
 * Run: node scripts/generate-topik-khmer.mjs
 * Then: node scripts/build-topik-i-vocabulary.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "fs";

const SOURCE = "scripts/topik-i-1671-source.html";
const MAP_PATH = "src/data/topik-i-khmer-map.json";
const ROW_RE =
  /<td class="column-1">(\d+)<\/td><td class="column-2">([^<]+)<\/td><td class="column-3">([^<]+)<\/td>/g;

const DELAY_MS = 350;

function cleanKhmer(s) {
  if (!s) return "";
  return s
    .replace(/<[^>]*>/g, "")
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
  const epsRe =
    /korean: "([^"]+)", english: "([^"]+)", khmer: "([^"]+)", lesson/g;
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

function parseTopikEntries() {
  const html = readFileSync(SOURCE, "utf8");
  const entries = [];
  let match;
  while ((match = ROW_RE.exec(html))) {
    entries.push({
      id: `topik-${match[1]}`,
      num: Number(match[1]),
      korean: match[2].trim(),
      english: match[3].trim(),
    });
  }
  entries.sort((a, b) => a.num - b.num);
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

const koToKm = loadKoToKm();
const entries = parseTopikEntries();
const map = existsSync(MAP_PATH)
  ? JSON.parse(readFileSync(MAP_PATH, "utf8"))
  : {};

let fromCurated = 0;
let fromCache = 0;
let translated = 0;
let skipped = 0;

for (let i = 0; i < entries.length; i++) {
  const e = entries[i];
  if (map[e.id]?.trim()) {
    skipped++;
    continue;
  }

  let km =
    koToKm.get(e.korean) ||
    koToKm.get(e.korean.split("/")[0].trim()) ||
    "";

  if (km) {
    fromCurated++;
  } else {
    try {
      km = await translateEnToKm(englishGloss(e.english));
      translated++;
      await new Promise((r) => setTimeout(r, DELAY_MS));
    } catch (err) {
      console.error(`Failed at #${e.num} ${e.korean}:`, err.message);
      writeFileSync(MAP_PATH, JSON.stringify(map, null, 2));
      process.exit(1);
    }
  }

  map[e.id] = km;

  if ((i + 1) % 25 === 0 || i === entries.length - 1) {
    writeFileSync(MAP_PATH, JSON.stringify(map, null, 2));
    console.log(
      `${i + 1}/${entries.length} | curated ${fromCurated} | api ${translated} | cached ${skipped}`,
    );
  }
}

writeFileSync(MAP_PATH, JSON.stringify(map, null, 2));
console.log(
  `Done. ${entries.length} entries → ${MAP_PATH} (curated: ${fromCurated}, API: ${translated})`,
);
