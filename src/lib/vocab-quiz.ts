import { epsTopikVocabulary, type EpsVocabWord } from "@/data/eps-topik-vocabulary";
import type { QuizQuestion } from "@/types";

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pickDistractors(
  target: EpsVocabWord,
  pool: EpsVocabWord[],
  count: number,
): string[] {
  const used = new Set([target.english.toLowerCase()]);
  const distractors: string[] = [];

  for (const word of shuffle(pool)) {
    if (word.id === target.id) continue;
    const key = word.english.toLowerCase();
    if (used.has(key)) continue;
    used.add(key);
    distractors.push(word.english);
    if (distractors.length >= count) break;
  }

  return distractors;
}

/** Build a random vocabulary quiz from the full EPS word list. */
export function buildRandomVocabQuizQuestions(count = 10): QuizQuestion[] {
  const pool = epsTopikVocabulary;
  if (pool.length < 4) return [];

  const selected = shuffle(pool).slice(0, Math.min(count, pool.length));

  return selected.map((word, index) => {
    const distractors = pickDistractors(word, pool, 3);
    const options = shuffle([word.english, ...distractors]);
    const correctIndex = options.indexOf(word.english);

    return {
      id: `vocab-${word.id}-${index}`,
      question: `${word.korean} means…`,
      options,
      correctIndex: correctIndex >= 0 ? correctIndex : 0,
      explanation: `${word.korean} = ${word.english}.`,
    };
  });
}
