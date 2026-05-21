/** EPS-TOPIK grammar from PPS Korean school PDF (សួរពាក្យ) */
export interface EpsGrammarItem {
  id: string;
  num: number;
  korean: string;
  english: string;
  lesson: number;
}

export const EPS_GRAMMAR_LESSON_LABELS: Record<number, string> = {
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
  13: "Future & desire",
  15: "Trying & experience",
};

export const epsTopikGrammar: EpsGrammarItem[] = [
  { id: "eps-9", num: 1, korean: "-입니다", english: "is (copula, polite)", lesson: 1 },
  { id: "eps-10", num: 2, korean: "-입니까?", english: "is it? (question)", lesson: 1 },
  { id: "eps-34", num: 3, korean: "-은/는", english: "topic particle", lesson: 1 },
  { id: "eps-35", num: 4, korean: "-이/가", english: "subject particle", lesson: 1 },
  { id: "eps-53", num: 5, korean: "-이에요/예요", english: "is (polite)", lesson: 2 },
  { id: "eps-67", num: 6, korean: "-이/가 아니에요", english: "is not", lesson: 2 },
  { id: "eps-85", num: 7, korean: "-이/가 있어요", english: "there is / have", lesson: 3 },
  { id: "eps-86", num: 8, korean: "-이/가없어요", english: "there is not / don't have", lesson: 3 },
  { id: "eps-87", num: 9, korean: "-도", english: "also / too", lesson: 3 },
  { id: "eps-88", num: 10, korean: "장소=", english: "place (topic)", lesson: 3 },
  { id: "eps-108", num: 11, korean: "-에", english: "to / at (place/time)", lesson: 3 },
  { id: "eps-141", num: 12, korean: "-요일", english: "day of week (suffix)", lesson: 4 },
  { id: "eps-159", num: 13, korean: "-월", english: "month (suffix)", lesson: 5 },
  { id: "eps-161", num: 14, korean: "-일", english: "day (suffix)", lesson: 5 },
  { id: "eps-172", num: 15, korean: "-았어요/었어요", english: "past tense (polite)", lesson: 5 },
  { id: "eps-174", num: 16, korean: "-분", english: "minute (counter) / part", lesson: 5 },
  { id: "eps-175", num: 17, korean: "-시", english: "o'clock (time)", lesson: 5 },
  { id: "eps-236", num: 18, korean: "-안", english: "inside / not", lesson: 6 },
  { id: "eps-238", num: 19, korean: "이름→성함", english: "name → honorific name", lesson: 6 },
  { id: "eps-239", num: 20, korean: "집→댁", english: "house → honorific home", lesson: 6 },
  { id: "eps-240", num: 21, korean: "나이→연세", english: "age → honorific age", lesson: 6 },
  { id: "eps-246", num: 22, korean: "있다→계시다", english: "to be → honorific to be", lesson: 7 },
  { id: "eps-247", num: 23, korean: "먹다,마시다→드시다/잡수시다", english: "eat/drink → honorific", lesson: 7 },
  { id: "eps-248", num: 24, korean: "자다→주무시다", english: "sleep → honorific sleep", lesson: 7 },
  { id: "eps-249", num: 25, korean: "말하다→말씀하시다", english: "speak → honorific speak", lesson: 7 },
  { id: "eps-250", num: 26, korean: "아프다→편찮으시다", english: "hurt → honorific ill", lesson: 7 },
  { id: "eps-296", num: 27, korean: "-개", english: "counter (general items)", lesson: 8 },
  { id: "eps-297", num: 28, korean: "-명", english: "counter (people)", lesson: 8 },
  { id: "eps-298", num: 29, korean: "-분", english: "minute (counter) / part", lesson: 8 },
  { id: "eps-299", num: 30, korean: "-마리", english: "counter (animals)", lesson: 8 },
  { id: "eps-300", num: 31, korean: "-권", english: "counter (books)", lesson: 8 },
  { id: "eps-301", num: 32, korean: "-공기", english: "counter (bowls of rice)", lesson: 8 },
  { id: "eps-302", num: 33, korean: "-그릇", english: "counter (bowls)", lesson: 8 },
  { id: "eps-303", num: 34, korean: "-접시", english: "counter (plates)", lesson: 8 },
  { id: "eps-304", num: 35, korean: "-잔", english: "counter (cups/glasses)", lesson: 8 },
  { id: "eps-305", num: 36, korean: "-병", english: "counter (bottles)", lesson: 8 },
  { id: "eps-306", num: 37, korean: "-대", english: "counter (machines/vehicles)", lesson: 8 },
  { id: "eps-307", num: 38, korean: "-켤레", english: "counter (pairs of shoes)", lesson: 8 },
  { id: "eps-308", num: 39, korean: "-송이", english: "counter (flowers)", lesson: 8 },
  { id: "eps-309", num: 40, korean: "-채", english: "counter (houses)", lesson: 8 },
  { id: "eps-310", num: 41, korean: "-자루", english: "counter (long objects)", lesson: 8 },
  { id: "eps-311", num: 42, korean: "-봉지", english: "counter (bags)", lesson: 8 },
  { id: "eps-312", num: 43, korean: "-박스", english: "counter (boxes)", lesson: 8 },
  { id: "eps-313", num: 44, korean: "-장", english: "counter (sheets/papers)", lesson: 8 },
  { id: "eps-465", num: 74, korean: "-통", english: "counter (containers / melons)", lesson: 8 },
  { id: "eps-466", num: 75, korean: "-갑", english: "counter (packs)", lesson: 8 },
  { id: "eps-467", num: 76, korean: "-포대", english: "counter (large sacks)", lesson: 8 },
  { id: "eps-468", num: 77, korean: "-달", english: "counter (months)", lesson: 8 },
  { id: "eps-469", num: 78, korean: "-살", english: "counter (age)", lesson: 8 },
  { id: "eps-470", num: 79, korean: "-벌", english: "counter (outfits)", lesson: 8 },
  { id: "eps-471", num: 80, korean: "-그루", english: "counter (trees)", lesson: 8 },
  { id: "eps-435", num: 45, korean: "-번", english: "number / time (counter)", lesson: 11 },
  { id: "eps-440", num: 46, korean: "-입니다, 입니까?", english: "is / is it?", lesson: 11 },
  { id: "eps-441", num: 47, korean: "-은/는=이/가", english: "topic = subject particles", lesson: 11 },
  { id: "eps-442", num: 48, korean: "-이에요/예요", english: "is (polite)", lesson: 11 },
  { id: "eps-443", num: 49, korean: "-이/가 아니에요", english: "is not", lesson: 11 },
  { id: "eps-445", num: 50, korean: "-이/가 있어요,없어요", english: "have / don't have", lesson: 11 },
  { id: "eps-446", num: 51, korean: "-에 (장소)", english: "at / to (place)", lesson: 11 },
  { id: "eps-447", num: 52, korean: "-아요/어요", english: "present polite ending", lesson: 11 },
  { id: "eps-448", num: 53, korean: "-을/를", english: "object particle", lesson: 11 },
  { id: "eps-449", num: 54, korean: "-에(시간)", english: "at (time)", lesson: 11 },
  { id: "eps-450", num: 55, korean: "-았/었/했", english: "past tense", lesson: 11 },
  { id: "eps-451", num: 56, korean: "-ㅂ니다/습니다", english: "formal polite ending", lesson: 11 },
  { id: "eps-452", num: 57, korean: "-에서", english: "from / at", lesson: 11 },
  { id: "eps-453", num: 58, korean: "-덥다?", english: "is it hot?", lesson: 11 },
  { id: "eps-454", num: 59, korean: "-안", english: "inside / not", lesson: 12 },
  { id: "eps-455", num: 60, korean: "-시/으시", english: "honorific", lesson: 12 },
  { id: "eps-456", num: 61, korean: "-고", english: "and / after", lesson: 12 },
  { id: "eps-457", num: 62, korean: "-주세요", english: "please give", lesson: 12 },
  { id: "eps-458", num: 63, korean: "-하고", english: "and / with", lesson: 12 },
  { id: "eps-459", num: 64, korean: "-네요", english: "surprise ending", lesson: 12 },
  { id: "eps-460", num: 65, korean: "-아/어/해 주세요", english: "please do", lesson: 12 },
  { id: "eps-461", num: 66, korean: "-아/어/해야 되다", english: "must / have to", lesson: 12 },
  { id: "eps-462", num: 67, korean: "-을게요/ㄹ게요", english: "will (promise)", lesson: 12 },
  { id: "eps-463", num: 68, korean: "-로/으로", english: "by / with / direction", lesson: 12 },
  { id: "eps-464", num: 69, korean: "-아/어/해서", english: "because / and then", lesson: 12 },
  { id: "ds-g-1", num: 70, korean: "-고 싶어요", english: "want to (do)", lesson: 13 },
  { id: "ds-g-2", num: 71, korean: "-(으)ㄹ 거예요", english: "will (future plan)", lesson: 13 },
  { id: "ds-g-3", num: 72, korean: "-아/어서", english: "because / so (reason)", lesson: 12 },
  { id: "ds-g-4", num: 73, korean: "-아/어 보다", english: "try doing", lesson: 15 },
];

export function getEpsGrammarByLesson(lesson: number) {
  return epsTopikGrammar.filter((w) => w.lesson === lesson);
}

export function searchEpsGrammar(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return epsTopikGrammar;
  return epsTopikGrammar.filter((w) => w.korean.toLowerCase().includes(q) || w.english.toLowerCase().includes(q) || String(w.num).includes(q));
}
