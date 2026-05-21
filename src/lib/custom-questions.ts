import type { QuizQuestion } from "@/types";
import type { PracticeExercise } from "@/data/practice-exercises";

const QUIZ_PREFIX = "learnnova-custom-quiz-";
const PRACTICE_PREFIX = "learnnova-custom-practice-";

function readJson<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function writeJson<T>(key: string, items: T[]) {
  localStorage.setItem(key, JSON.stringify(items));
}

export function getCustomQuizQuestions(quizId: string): QuizQuestion[] {
  return readJson<QuizQuestion>(`${QUIZ_PREFIX}${quizId}`);
}

export function addCustomQuizQuestion(
  quizId: string,
  question: Omit<QuizQuestion, "id">,
): QuizQuestion {
  const items = getCustomQuizQuestions(quizId);
  const entry: QuizQuestion = {
    ...question,
    id: `custom-${quizId}-${Date.now()}`,
  };
  writeJson(`${QUIZ_PREFIX}${quizId}`, [...items, entry]);
  return entry;
}

export function getCustomPracticeExercises(skillId: string): PracticeExercise[] {
  return readJson<PracticeExercise>(`${PRACTICE_PREFIX}${skillId}`);
}

export function addCustomPracticeExercise(
  skillId: string,
  exercise: Omit<PracticeExercise, "category"> & { category?: PracticeExercise["category"] },
): PracticeExercise {
  const items = getCustomPracticeExercises(skillId);
  const entry: PracticeExercise = {
    category: exercise.category ?? "vocabulary",
    ...exercise,
  };
  writeJson(`${PRACTICE_PREFIX}${skillId}`, [...items, entry]);
  return entry;
}
