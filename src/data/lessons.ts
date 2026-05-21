import type { Lesson } from "@/types";

export const lessons: Lesson[] = [
  {
    id: "lesson-1",
    courseId: "korean-basics",
    title: "Hangul: Consonants & Vowels",
    duration: "18 min",
    completed: true,
    order: 1,
    content:
      "Hangul has 14 basic consonants and 10 basic vowels. Letters combine into syllable blocks (e.g. 한 = ㅎ+ㅏ+ㄴ). Once you know the symbols, Korean is very phonetic.",
    keyPoints: [
      "Each block = one syllable",
      "Consonants + vowels stack in the block",
      "Practice reading simple words aloud",
    ],
    examples: ["ㅎ+ㅏ+ㄴ = 한 (han)", "안녕 = an-nyeong (hi)"],
  },
  {
    id: "lesson-2",
    courseId: "korean-basics",
    title: "Greetings & Politeness",
    duration: "15 min",
    completed: true,
    order: 2,
    content:
      "Korean uses different formality levels. With strangers and teachers, use polite endings like -요 or -습니다.",
    keyPoints: [
      "안녕하세요 — hello (polite)",
      "감사합니다 — thank you",
      "Use 요 ending in daily polite speech",
    ],
    examples: [
      "안녕하세요 — Hello",
      "잘 지냈어요? — How have you been?",
    ],
  },
  {
    id: "lesson-3",
    courseId: "korean-phrases",
    title: "At the Café",
    duration: "12 min",
    completed: false,
    order: 1,
    content:
      "Useful patterns for ordering: ... 주세요 (please give me ...), 이거 (this), and numbers for sizes.",
    keyPoints: [
      "아메리카노 한 잔 주세요",
      "여기서 먹고 갈게요 — eat here",
      "계산서 주세요 — check please",
    ],
    examples: ["물 한 병 주세요 — One bottle of water, please"],
  },
  {
    id: "lesson-4",
    courseId: "korean-grammar",
    title: "Particles: 은/는, 이/가",
    duration: "20 min",
    completed: false,
    order: 1,
    content:
      "Topic markers (은/는) and subject markers (이/가) show what the sentence is about vs. who does the action.",
    keyPoints: [
      "저는 학생이에요 — I am a student",
      "책이 있어요 — There is a book",
      "Choose 은/는 after topic, 이/가 after subject",
    ],
    examples: ["한국어는 재미있어요 — Korean is fun"],
  },
];

export function getLessonsByCourseId(courseId: string): Lesson[] {
  return lessons
    .filter((l) => l.courseId === courseId)
    .sort((a, b) => a.order - b.order);
}

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id);
}
