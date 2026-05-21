export type ExerciseCategory =
  | "vocabulary"
  | "grammar"
  | "reading"
  | "listening"
  | "hangul";

export interface PracticeExercise {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category?: ExerciseCategory;
  /** TOPIK I style prompt context (e.g. short dialogue) */
  passage?: string;
}

export const practiceExercisesBySkill: Record<string, PracticeExercise[]> = {
  hangul: [
    {
      category: "hangul",
      question: "What does 안녕하세요 mean?",
      options: ["Goodbye", "Hello (polite)", "Thank you", "Sorry"],
      correctIndex: 1,
      explanation: "안녕하세요 is the standard polite greeting, used any time of day.",
    },
    {
      category: "hangul",
      question: "How many syllable blocks are in 한글?",
      options: ["One", "Two", "Three", "Four"],
      correctIndex: 1,
      explanation: "한 + 글 = two syllable blocks (each block = one consonant + vowel, etc.).",
    },
    {
      category: "hangul",
      question: "Which vowel is ㅏ?",
      options: ["a", "eo", "o", "u"],
      correctIndex: 0,
      explanation: "ㅏ is pronounced like “a” in “father” (Korean a).",
    },
    {
      category: "hangul",
      question: "Read this word: 학교. What does it mean?",
      options: ["Hospital", "School", "Library", "Station"],
      correctIndex: 1,
      explanation: "학교 (hak-gyo) = school. 학 = study, 교 = institution.",
    },
    {
      category: "hangul",
      question: "Which letter is the consonant “n” (nieun)?",
      options: ["ㄱ", "ㄴ", "ㄷ", "ㄹ"],
      correctIndex: 1,
      explanation: "ㄴ = nieun, the “n” sound at the start of a syllable.",
    },
    {
      category: "hangul",
      question: "How do you write “ga” (가) — the syllable starting with ㄱ + ㅏ?",
      options: ["가", "나", "다", "라"],
      correctIndex: 0,
      explanation: "ㄱ + ㅏ combines into the syllable block 가.",
    },
    {
      category: "hangul",
      question: "What is the correct reading of 물?",
      options: ["mul (water)", "bul (fire)", "bam (night)", "namu (tree)"],
      correctIndex: 0,
      explanation: "물 = mul = water. ㅁ + ㅜ + ㄹ.",
    },
    {
      category: "hangul",
      question: "Which word means “book”?",
      options: ["책", "집", "밥", "손"],
      correctIndex: 0,
      explanation: "책 (chaek) = book. 집 = house, 밥 = rice/meal, 손 = hand.",
    },
  ],
  "korean-vocab": [
    {
      category: "vocabulary",
      question: "Which phrase means “Thank you”?",
      options: ["안녕하세요", "감사합니다", "죄송합니다", "안녕히 가세요"],
      correctIndex: 1,
      explanation: "감사합니다 = Thank you (polite). 죄송합니다 = Sorry.",
    },
    {
      category: "vocabulary",
      question: "저는 학생이에요 means…",
      options: ["I am a student", "I am a teacher", "Goodbye", "See you tomorrow"],
      correctIndex: 0,
      explanation: "저 (I) + 는 (topic) + 학생 (student) + 이에요 (am, polite).",
    },
    {
      category: "vocabulary",
      question: "What does 월요일 mean?",
      options: ["Sunday", "Monday", "Friday", "Saturday"],
      correctIndex: 1,
      explanation: "월요일 = Monday. 일요일 = Sunday, 금요일 = Friday.",
    },
    {
      category: "vocabulary",
      question: "Choose the correct number: “five”",
      options: ["사", "오", "육", "칠"],
      correctIndex: 1,
      explanation: "오 = 5. 사 = 4, 육 = 6, 칠 = 7. (Sino-Korean: 오, native: 다섯)",
    },
    {
      category: "vocabulary",
      question: "Which word means “mother”?",
      options: ["아버지", "어머니", "형", "동생"],
      correctIndex: 1,
      explanation: "어머니 = mother. 아버지 = father, 형 = older brother (male speaker).",
    },
    {
      category: "vocabulary",
      question: "지금 means…",
      options: ["Yesterday", "Now", "Tomorrow", "Always"],
      correctIndex: 1,
      explanation: "지금 = now. 어제 = yesterday, 내일 = tomorrow.",
    },
    {
      category: "vocabulary",
      question: "Where do you buy medicine?",
      options: ["은행", "약국", "우체국", "공원"],
      correctIndex: 1,
      explanation: "약국 = pharmacy. 은행 = bank, 우체국 = post office.",
    },
    {
      category: "vocabulary",
      question: "맛있어요 means the food is…",
      options: ["expensive", "delicious", "cold", "ready"],
      correctIndex: 1,
      explanation: "맛있어요 = (it) is delicious. 맛 = taste, 있어요 = exists/is.",
    },
    {
      category: "vocabulary",
      question: "What does 커피 mean?",
      options: ["Tea", "Coffee", "Juice", "Water"],
      correctIndex: 1,
      explanation: "커피 = coffee (loanword). 차 = tea, 주스 = juice.",
    },
    {
      category: "vocabulary",
      question: "비가 와요 means…",
      options: ["It is sunny", "It is raining", "It is snowing", "It is windy"],
      correctIndex: 1,
      explanation: "비 (rain) + 가 (subject) + 와요 (comes) → It is raining.",
    },
  ],
  "korean-grammar": [
    {
      category: "grammar",
      question: "Which particle marks the topic?",
      options: ["이/가", "은/는", "을/를", "에"],
      correctIndex: 1,
      explanation: "은/는 mark the topic. 이/가 = subject, 을/를 = object.",
    },
    {
      category: "grammar",
      question: "책이 있어요 means…",
      options: ["I have a book", "I want a book", "I read a book", "I bought a book"],
      correctIndex: 0,
      explanation: "이/가 + 있어요 = there is / (someone) has.",
    },
    {
      category: "grammar",
      question: "Choose the polite present tense: “I eat.”",
      options: ["먹어", "먹어요", "먹었다", "먹을"],
      correctIndex: 1,
      explanation: "먹어요 = eat (polite present). 먹었다 = ate, 먹을 = will eat.",
    },
    {
      category: "grammar",
      question: "학교에 가요 — the particle 에 means…",
      options: ["from", "to/at (direction/location)", "with", "and"],
      correctIndex: 1,
      explanation: "에 often marks direction (to) or location (at/in).",
    },
    {
      category: "grammar",
      question: "Fill in: 저___ 한국 사람이에요.",
      options: ["는", "를", "에서", "하고"],
      correctIndex: 0,
      explanation: "저는 = As for me… (topic particle after 저).",
    },
    {
      category: "grammar",
      question: "안 + verb stem + ___ = “do not …” (polite)",
      options: ["아요", "아요 → 않아요", "았어요", "을게요"],
      correctIndex: 1,
      explanation: "Negation: 안 + verb (e.g. 안 가요 = do not go).",
    },
    {
      category: "grammar",
      question: "비빔밥을 먹어요. 을/를 marks the…",
      options: ["subject", "object", "topic", "time"],
      correctIndex: 1,
      explanation: "을/를 marks the direct object (what is eaten).",
    },
    {
      category: "grammar",
      question: "어제 친구를 만났어요. 어제 means…",
      options: ["today", "yesterday", "tomorrow", "every day"],
      correctIndex: 1,
      explanation: "어제 = yesterday. Time words often come at the start.",
    },
    {
      category: "grammar",
      question: "Which is correct: “I want to go.”",
      options: ["가고 싶어요", "가 싶어요", "가요 싶어", "싶어 가요"],
      correctIndex: 0,
      explanation: "Verb stem + 고 싶어요 = want to (do). 가고 싶어요.",
    },
    {
      category: "grammar",
      question: "친구하고 영화를 봤어요. 하고 means…",
      options: ["but", "with/and", "because", "if"],
      correctIndex: 1,
      explanation: "N + 하고 = with N / and N (also used for listing).",
    },
  ],
  "topik-1": [
    {
      category: "vocabulary",
      question: "Choose the word closest in meaning to 크다.",
      options: ["small", "big", "fast", "slow"],
      correctIndex: 1,
      explanation: "크다 = to be big. 작다 = small (TOPIK I basic antonyms).",
    },
    {
      category: "vocabulary",
      question: "What is the opposite of 덥다 (hot)?",
      options: ["춥다", "많다", "좋다", "쉽다"],
      correctIndex: 0,
      explanation: "덥다 = hot (weather), 춥다 = cold. Common TOPIK I pair.",
    },
    {
      category: "grammar",
      question: "가: 공부를 해요. What is 공부?",
      options: ["work", "study", "travel", "rest"],
      correctIndex: 1,
      explanation: "공부하다/공부를 하다 = to study. TOPIK I daily routine vocab.",
    },
    {
      category: "grammar",
      question: "Choose the correct particle: 친구___ 만나요.",
      options: ["를", "은", "에서", "부터"],
      correctIndex: 0,
      explanation: "만나다 takes object: 친구를 만나요 = meet (a) friend.",
    },
    {
      category: "reading",
      passage:
        "민수: 안녕하세요. 저는 민수예요.\n지영: 안녕하세요. 저는 지영이에요. 만나서 반갑습니다.",
      question: "What are they doing?",
      options: [
        "Saying goodbye",
        "Introducing themselves",
        "Ordering food",
        "Asking for directions",
      ],
      correctIndex: 1,
      explanation: "They greet and introduce names — typical TOPIK I dialogue opening.",
    },
    {
      category: "reading",
      passage: "오늘은 토요일이에요. 날씨가 좋아요. 공원에 갈 거예요.",
      question: "What will they probably do?",
      options: ["Stay home", "Go to the park", "Go to work", "Study at school"],
      correctIndex: 1,
      explanation: "공원에 갈 거예요 = will go to the park. 좋은 날씨 = good weather.",
    },
    {
      category: "reading",
      passage:
        "이 가게는 아침 9시에 열어요. 저녁 8시에 닫아요. 일요일은 쉬어요.",
      question: "When is the store closed?",
      options: ["Every day at 8 PM", "On Sundays", "At 9 AM", "Only on Monday"],
      correctIndex: 1,
      explanation: "일요일은 쉬어요 = rests on Sunday (closed).",
    },
    {
      category: "listening",
      passage: "[Listening] You hear: “지하철역이 어디예요?”",
      question: "What is the speaker asking?",
      options: [
        "Where is the subway station?",
        "What time is it?",
        "How much does it cost?",
        "Do you like Korean food?",
      ],
      correctIndex: 0,
      explanation: "어디예요? = Where is it? 지하철역 = subway station.",
    },
    {
      category: "listening",
      passage: "[Listening] You hear: “이거 얼마예요?”",
      question: "Best response at a shop:",
      options: ["만 원이에요", "네, 맛있어요", "내일 만나요", "한국어를 배워요"],
      correctIndex: 0,
      explanation: "얼마예요? = How much? → price answer: 만 원이에요.",
    },
    {
      category: "listening",
      passage: "[Listening] You hear: “물 한 병 주세요.”",
      question: "What does the customer want?",
      options: ["One bottle of water", "Two cups of coffee", "A map", "A ticket"],
      correctIndex: 0,
      explanation: "물 = water, 한 병 = one bottle, 주세요 = please give.",
    },
    {
      category: "vocabulary",
      question: "TOPIK I: Which word fits “I live in Seoul.” — 서울___ 살아요.",
      options: ["에서", "을", "는", "하고"],
      correctIndex: 0,
      explanation: "Place + 에서 살다 = live in (at) a place.",
    },
    {
      category: "grammar",
      question: "Past tense (polite): 어제 영화를 ___",
      options: ["봐요", "봤어요", "볼 거예요", "보고 싶어요"],
      correctIndex: 1,
      explanation: "봤어요 = watched (past). 봐요 = watch (present).",
    },
    {
      category: "reading",
      passage:
        "수진 씨는 매일 7시에 일어나요. 8시에 회사에 가요. 6시에 집에 와요.",
      question: "When does Sujin go to work?",
      options: ["6:00", "7:00", "8:00", "9:00"],
      correctIndex: 2,
      explanation: "8시에 회사에 가요 = goes to the company at 8.",
    },
    {
      category: "vocabulary",
      question: "Which is a TOPIK I place word?",
      options: ["병원", "행복", "예쁘다", "빨리"],
      correctIndex: 0,
      explanation: "병원 = hospital (noun/place). Others are adj/adverb.",
    },
    {
      category: "grammar",
      question: "비가 와서 우산을 가져왔어요. 서서 means…",
      options: ["because", "but", "and then", "if"],
      correctIndex: 0,
      explanation: "-아/어서 often gives reason: because it rains…",
    },
    {
      category: "reading",
      passage: "가: 주말에 뭐 해요? 나: 친구하고 산에 갈 거예요.",
      question: "What will the second speaker do on the weekend?",
      options: [
        "Go to the mountain with a friend",
        "Study at home",
        "Work at the office",
        "Sleep all day",
      ],
      correctIndex: 0,
      explanation: "주말 = weekend, 친구하고 = with friend, 산 = mountain.",
    },
    {
      category: "listening",
      passage: "[Listening] You hear: “버스 정류장이 앞에 있어요.”",
      question: "Where is the bus stop?",
      options: ["In front", "Behind", "Far away", "Underground"],
      correctIndex: 0,
      explanation: "앞에 = in front. 정류장 = bus stop.",
    },
    {
      category: "vocabulary",
      question: "Fill in: 배가 ___. (I’m hungry.)",
      options: ["고파요", "피곤해요", "바빠요", "아파요"],
      correctIndex: 0,
      explanation: "배가 고파요 = (my) stomach is hungry. 피곤 = tired, 아파 = hurt.",
    },
    {
      category: "grammar",
      question: "Compare: 이 책이 저 책보다 ___",
      options: ["좋아요", "좋은", "좋게", "좋고"],
      correctIndex: 0,
      explanation: "A보다 B = B is more … than A. 좋아요 = is good (predicate).",
    },
    {
      category: "reading",
      passage:
        "한국 음식을 좋아해요. 김치찌개는 매워요. 비빔밥은 안 매워요.",
      question: "Which dish is NOT spicy according to the text?",
      options: ["김치찌개", "비빔밥", "Both are spicy", "Neither is mentioned"],
      correctIndex: 1,
      explanation: "비빔밥은 안 매워요 = bibimbap is not spicy.",
    },
  ],
};

const categoryLabels: Record<ExerciseCategory, string> = {
  vocabulary: "Vocabulary",
  grammar: "Grammar",
  reading: "Reading",
  listening: "Listening",
  hangul: "Hangul",
};

export function getCategoryLabel(category?: ExerciseCategory): string | null {
  return category ? categoryLabels[category] : null;
}

export function getExercisesForSkill(skillId: string): PracticeExercise[] {
  return practiceExercisesBySkill[skillId] ?? [];
}

export function getExerciseCountForSkill(skillId: string): number {
  return getExercisesForSkill(skillId).length;
}
