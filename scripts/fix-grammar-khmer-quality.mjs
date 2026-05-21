/**
 * Curated Khmer fixes — counters match reference chart; grammar glosses cleaned up.
 * Run: node scripts/fix-grammar-khmer-quality.mjs
 */
import { readFileSync, writeFileSync } from "fs";

const COUNTER_BY_KOREAN = JSON.parse(
  readFileSync("src/data/korean-counter-khmer.json", "utf8"),
);

/** EPS grammar id → Korean counter stem (without leading -) */
const EPS_COUNTER_STEM = {
  "eps-296": "개",
  "eps-297": "명",
  "eps-298": "분",
  "eps-299": "마리",
  "eps-300": "권",
  "eps-301": "공기",
  "eps-302": "그릇",
  "eps-303": "접시",
  "eps-304": "잔",
  "eps-305": "병",
  "eps-306": "대",
  "eps-307": "켤레",
  "eps-308": "송이",
  "eps-309": "채",
  "eps-310": "자루",
  "eps-311": "봉지",
  "eps-312": "박스",
  "eps-313": "장",
  "eps-435": "번",
  "eps-175": "시",
  "eps-465": "통",
  "eps-466": "갑",
  "eps-467": "포대",
  "eps-468": "달",
  "eps-469": "살",
  "eps-470": "벌",
  "eps-471": "그루",
};

const EPS_OVERRIDES = {
  "eps-10": "តើ…ឬ? (សំណួរ)",
  "eps-238": "ឈ្មោះ → កិត្តិយស",
  "eps-239": "ផ្ទះ → ផ្ទះគោរព",
  "eps-240": "អាយុ → អាយុគោរព",
  "eps-246": "មាន → មាន (កិត្តិយស)",
  "eps-248": "ដេក → ដេក (កិត្តិយស)",
  "eps-249": "និយាយ → និយាយ (កិត្តិយស)",
  "eps-250": "ឈឺ → ឈឺ (កិត្តិយស)",
  "eps-441": "ភាគល្អិតប្រធានបទ / ភាគល្អិតប្រធានបទ",
  "eps-447": "បញ្ចប់បច្ចុប្បន្ថកាល (-아요/어요)",
  "eps-451": "បញ្ចប់ផ្លូវការ (-ㅂ니다/습니다)",
  "eps-453": "ក្តៅទេ? (-덥다)",
  "eps-58": "តើរដ្ឋានធាតុគឺទទឹងទេ?",
};

const TOPIK_OVERRIDES = {
  "topik-g-25": "របស់ (កម្មសិទ្ធិ)",
  "topik-g-54": "ក្នុងពេលដែល / ទាំងពេល",
  "topik-g-24": "គូ",
  "topik-g-29": "ដូចជា",
  "topik-g-40": "ពេល",
  "topik-g-48": "តើអ្នកចង់…ទេ?",
  "topik-g-46": "តើ…ឬទេ?",
  "topik-g-9": "ទៅ / នៅ (កន្លែង)",
  "topik-g-10": "ពី (កន្លែង)",
  "topik-g-34": "ប៉ុន្មាន (ចំនួន)",
};

function apply(path, overrides) {
  const map = JSON.parse(readFileSync(path, "utf8"));
  let n = 0;
  for (const [id, khmer] of Object.entries(overrides)) {
    if (map[id] !== khmer) {
      map[id] = khmer;
      n++;
    }
  }
  writeFileSync(path, JSON.stringify(map, null, 2));
  console.log(path, "— fixed", n, "entries");
}

function applyEpsCounters() {
  const map = JSON.parse(readFileSync("src/data/eps-grammar-khmer-map.json", "utf8"));
  let n = 0;
  for (const [id, stem] of Object.entries(EPS_COUNTER_STEM)) {
    const khmer = COUNTER_BY_KOREAN[stem];
    if (khmer && map[id] !== khmer) {
      map[id] = khmer;
      n++;
    }
  }
  writeFileSync("src/data/eps-grammar-khmer-map.json", JSON.stringify(map, null, 2));
  console.log("src/data/eps-grammar-khmer-map.json — counters fixed", n);
}

applyEpsCounters();
apply("src/data/eps-grammar-khmer-map.json", EPS_OVERRIDES);
apply("src/data/topik-i-grammar-khmer-map.json", TOPIK_OVERRIDES);
