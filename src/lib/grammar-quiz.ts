import { epsTopikGrammar } from "@/data/eps-topik-grammar";
import type { QuizQuestion } from "@/types";

type GrammarPoolItem = {
  id: string;
  num: number;
  korean: string;
  english: string;
};

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pickDistractors(
  target: GrammarPoolItem,
  pool: GrammarPoolItem[],
  count: number,
): string[] {
  const used = new Set([target.english.toLowerCase()]);
  const distractors: string[] = [];

  for (const item of shuffle(pool)) {
    if (item.id === target.id) continue;
    const key = item.english.toLowerCase();
    if (used.has(key)) continue;
    used.add(key);
    distractors.push(item.english);
    if (distractors.length >= count) break;
  }

  return distractors;
}

/** Random grammar quiz from EPS-TOPIK patterns (new set each time you start). */
export function buildGrammarQuizQuestions(count = 10): QuizQuestion[] {
  const pool = epsTopikGrammar;
  if (pool.length < 4) return [];

  const selected = shuffle(pool).slice(0, Math.min(count, pool.length));

  return selected.map((item, index) => {
    const distractors = pickDistractors(item, pool, 3);
    const options = shuffle([item.english, ...distractors]);
    const correctIndex = options.indexOf(item.english);

    return {
      id: `grammar-${item.id}-${index}`,
      question: `What does “${item.korean}” mean?`,
      options,
      correctIndex: correctIndex >= 0 ? correctIndex : 0,
      explanation: `${item.korean} = ${item.english}.`,
    };
  });
}
