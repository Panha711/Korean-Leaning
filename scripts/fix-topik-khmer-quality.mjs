/**
 * Re-translates TOPIK Khmer entries with API garbage (Latin text, KDE errors, etc.)
 * Run: node scripts/fix-topik-khmer-quality.mjs
 * Then: node scripts/build-topik-i-vocabulary.mjs
 */
import { readFileSync, writeFileSync } from "fs";

const SOURCE = "scripts/topik-i-1671-source.html";
const MAP_PATH = "src/data/topik-i-khmer-map.json";
const ROW_RE =
  /<td class="column-1">(\d+)<\/td><td class="column-2">([^<]+)<\/td><td class="column-3">([^<]+)<\/td>/g;
const DELAY_MS = 300;

/** Hand-checked fixes for common bad API results */
const BY_ID = {
  "topik-23": "ពេល",
  "topik-29": "ឆ្អឹងជំនីរ",
  "topik-30": "ស៊ុបឆ្អឹងជំនីរ",
  "topik-44": "ស៊ុបដំឡូង",
  "topik-54": "ផ្កាឈូក",
  "topik-61": "ការកុហក",
  "topik-72": "ភ្នាល់",
  "topik-89": "ព្រះបរមរាជវាំងក្យុងបុក",
  "topik-94": "ទិដ្ឋភាព",
  "topik-95": "បទពិសោធន៍",
  "topik-96": "ជណ្តើរ",
  "topik-114": "ខូច/មិនដំណើរការ",
  "topik-116": "ហ្គូជចាង",
  "topik-118": "ឃ្លាន",
  "topik-121": "ផ្លូវតូច",
  "topik-176": "ក្រូចពោធិ",
  "topik-204": "ឈប់/បញ្ចប់",
  "topik-209": "ឈប់/បញ្ចប់",
  "topik-221": "រង់ចាំ",
  "topik-735": "វត្ថុ/របស់",
  "topik-295": "ពោះវៀន",
  "topik-294": "ខ្ញុំ",
  "topik-263": "ខ្ញុំ",
  "topik-242": "អាកាសយានដ្ឋានអន្តរជាតិគីមប៉ូ",
  "topik-283": "ផ្សារណាមដែមុន",
  "topik-424": "ផ្សារដុងដែមុន",
  "topik-435": "តៅយ៉ាង (ទឹកស៊ុបសណ្តែប)",
  "topik-476": "តុកបុកគី",
  "topik-742": "សូដា",
  "topik-1414": "ផ្កាអាហ៊្សាឡេ",
};

function cleanKhmer(s) {
  if (!s) return "";
  return s
    .replace(/<[^>]*>/g, "")
    .replace(/&apos;/g, "'")
    .replace(/MYMEMORY WARNING[^.]*\./gi, "")
    .replace(/MYMEMORY[^.]*\./gi, "")
    .replace(/\(link[^)]*\)/gi, "")
    .replace(/whileYou are about to translate[^.]*\./gi, "")
    .replace(/goYou are about to translate[^.]*\./gi, "")
    .replace(/Please see http[^.]*\./gi, "")
    .replace(/edu\. kde\. org[^.]*\./gi, "")
    .replace(/translator\. php[^.]*\./gi, "")
    .replace(/Description$/gi, "")
    .replace(/\b(color|Name|Tag Type|weather forecast|File Position|QShortcut|Mandarin|world|kgm)\b/gi, "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s*\([^)]*[A-Za-z][^)]*\)\s*/g, " ")
    .replace(/^[-–—]+\s*/, "")
    .replace(/\s+/g, " ")
    .trim()
    .normalize("NFC");
}

function isBadKhmer(km) {
  if (!km?.trim()) return true;
  if (/MYMEMORY|kde\.org|translator|COMMAND|translate the/i.test(km)) return true;
  const latin = (km.match(/[A-Za-z]/g) || []).length;
  if (latin > 2) return true;
  return false;
}

function englishGloss(english) {
  return english
    .replace(/\([^)]*\)/g, " ")
    .split(/[,;/]/)
    .map((s) => s.trim())
    .filter((s) => s && !/^[A-Z][a-z]+$/.test(s) || s.length > 4)
    .filter(Boolean)[0]
    ?.slice(0, 120) ?? english.split(/[,;/]/)[0]?.trim().slice(0, 120) ?? english.slice(0, 120);
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
      korean: match[2].trim(),
      english: match[3].trim(),
    });
  }
  return entries;
}

async function translateGoogle(text) {
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=km&dt=t&q=" +
    encodeURIComponent(text);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Google translate HTTP ${res.status}`);
  const data = await res.json();
  const parts = data[0]?.map((row) => row[0]).join("") ?? "";
  return cleanKhmer(parts);
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

async function bestTranslation(e) {
  const gloss = englishGloss(e.english);
  const attempts = [gloss, e.english.split(/[,;/]/)[0]?.trim()].filter(Boolean);
  for (const text of attempts) {
    try {
      const g = await translateGoogle(text);
      if (g && !isBadKhmer(g)) return g;
      await new Promise((r) => setTimeout(r, 150));
    } catch {
      /* try next */
    }
    try {
      const m = await translateEnToKm(text);
      if (m && !isBadKhmer(m)) return m;
      await new Promise((r) => setTimeout(r, DELAY_MS));
    } catch {
      /* try next */
    }
  }
  return "";
}

const koToKm = loadKoToKm();
const entries = parseTopikEntries();
const map = JSON.parse(readFileSync(MAP_PATH, "utf8"));

const toFix = entries.filter((e) => isBadKhmer(map[e.id]));
console.log(`Fixing ${toFix.length} entries with bad Khmer…`);

let fixed = 0;
for (let i = 0; i < toFix.length; i++) {
  const e = toFix[i];
  let km = BY_ID[e.id] || "";

  if (!km) {
    km =
      koToKm.get(e.korean) ||
      koToKm.get(e.korean.split("/")[0].trim()) ||
      "";
    km = cleanKhmer(km);
  }

  if (!km || isBadKhmer(km)) {
    km = await bestTranslation(e);
  }

  if (km && !isBadKhmer(km)) {
    map[e.id] = km;
    fixed++;
  } else {
    console.warn(`Still bad: ${e.id} ${e.korean} (${e.english})`);
  }

  if ((i + 1) % 15 === 0 || i === toFix.length - 1) {
    writeFileSync(MAP_PATH, JSON.stringify(map, null, 2));
    console.log(`${i + 1}/${toFix.length} processed, ${fixed} fixed`);
  }
}

writeFileSync(MAP_PATH, JSON.stringify(map, null, 2));
console.log(`Done. Fixed ${fixed} entries.`);
