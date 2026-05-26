import type { Quiz } from "@/types";

export const quizzes: Quiz[] = [
  {
    id: "quiz-vocab-1",
    title: "Daily Vocabulary",
    subject: "Korean",
    level: "Beginner",
    description: "10 random words from 400+ EPS vocabulary each time",
    timeLimit: 900,
    questionCount: 10,
    questions: [
      {
        id: "v1",
        question: "월요일 means…",
        options: ["Sunday", "Monday", "Friday", "Saturday"],
        correctIndex: 1,
        explanation: "월요일 = Monday.",
      },
      {
        id: "v2",
        question: "Which number is 오?",
        options: ["4", "5", "6", "7"],
        correctIndex: 1,
        explanation: "오 = 5 (Sino-Korean).",
      },
      {
        id: "v3",
        question: "어머니 means…",
        options: ["father", "mother", "older brother", "friend"],
        correctIndex: 1,
        explanation: "어머니 = mother, 아버지 = father.",
      },
      {
        id: "v4",
        question: "지금 means…",
        options: ["yesterday", "now", "tomorrow", "always"],
        correctIndex: 1,
        explanation: "지금 = now.",
      },
      {
        id: "v5",
        question: "Where do you buy medicine?",
        options: ["은행", "약국", "공원", "학교"],
        correctIndex: 1,
        explanation: "약국 = pharmacy.",
      },
      {
        id: "v6",
        question: "맛있어요 means the food is…",
        options: ["expensive", "delicious", "cold", "ready"],
        correctIndex: 1,
        explanation: "맛있어요 = (it) is delicious.",
      },
      {
        id: "v7",
        question: "커피 means…",
        options: ["tea", "coffee", "juice", "milk"],
        correctIndex: 1,
        explanation: "커피 = coffee (loanword).",
      },
      {
        id: "v8",
        question: "비가 와요 means…",
        options: ["It is sunny", "It is raining", "It is snowing", "It is hot"],
        correctIndex: 1,
        explanation: "비 = rain, 와요 = comes → it is raining.",
      },
      {
        id: "v9",
        question: "저는 학생이에요 means…",
        options: ["I am a student", "I am a teacher", "Goodbye", "Thank you"],
        correctIndex: 0,
        explanation: "저는 … 이에요 = I am …",
      },
      {
        id: "v10",
        question: "내일 means…",
        options: ["today", "yesterday", "tomorrow", "every day"],
        correctIndex: 2,
        explanation: "내일 = tomorrow, 어제 = yesterday.",
      },
    ],
  },
  {
    id: "quiz-grammar-1",
    title: "Grammar Essentials",
    subject: "Korean",
    level: "Beginner",
    description:
      "10 random questions from EPS-TOPIK grammar patterns each time you start",
    timeLimit: 900,
    questionCount: 10,
    questions: [],
  },
  {
    id: "quiz-topik-1-mock",
    title: "TOPIK I Mock Quiz",
    subject: "Korean",
    level: "TOPIK I",
    description:
      "15 random questions from TOPIK I vocabulary & grammar each time you start",
    timeLimit: 1200,
    questionCount: 15,
    questions: [],
  },
  {
    id: "quiz-topik-2-mock",
    title: "TOPIK II Mock Quiz",
    subject: "Korean",
    level: "TOPIK II",
    description:
      "15 random questions from TOPIK II vocabulary & grammar each time you start",
    timeLimit: 1200,
    questionCount: 15,
    questions: [],
  },
  {
    id: "quiz-favorites",
    title: "My Favorites",
    subject: "Korean",
    level: "Personal",
    description:
      "Quiz built from every word you favorited. Add favorites from the Words page.",
    timeLimit: 900,
    questionCount: 0,
    questions: [],
  },
];

export function getQuizById(id: string): Quiz | undefined {
  return quizzes.find((q) => q.id === id);
}

export function getQuizFeedback(
  percentage: number,
  quizTitle: string,
): string {
  if (percentage >= 80) {
    return `훌륭해요! You did very well on “${quizTitle}”. Review any missed items, then try a TOPIK I or II mock quiz when you are ready for more practice.`;
  }
  if (percentage >= 60) {
    return `Good effort on “${quizTitle}”. Read the explanations below, then retake this quiz or study vocabulary and grammar before your next attempt.`;
  }
  return `Keep going — 한국어 takes time! Review the answer explanations, focus on Hangul and basic particles, then try again. 화이팅!`;
}
