import { topikIGrammar } from "@/data/topik-i-grammar";
import { topikIVocabulary } from "@/data/topik-i-vocabulary";
import {
  pickEnglishDistractors,
  pickRandomSample,
  shuffle,
} from "@/lib/quiz-random";
import type { QuizQuestion } from "@/types";

function vocabQuestion(
  word: (typeof topikIVocabulary)[number],
  pool: typeof topikIVocabulary,
  index: number,
): QuizQuestion {
  const distractors = pickEnglishDistractors(word, pool, 3);
  const options = shuffle([word.english, ...distractors]);
  const correctIndex = options.indexOf(word.english);

  return {
    id: `topik-v-${word.id}-${index}-${Date.now()}`,
    question: `${word.korean} means…`,
    options,
    correctIndex: correctIndex >= 0 ? correctIndex : 0,
    explanation: `${word.korean} = ${word.english}.`,
  };
}

function grammarQuestion(
  item: (typeof topikIGrammar)[number],
  pool: typeof topikIGrammar,
  index: number,
): QuizQuestion {
  const distractors = pickEnglishDistractors(item, pool, 3);
  const options = shuffle([item.english, ...distractors]);
  const correctIndex = options.indexOf(item.english);
  const passage = item.exampleKorean || undefined;

  return {
    id: `topik-g-${item.id}-${index}-${Date.now()}`,
    question: passage
      ? `Which meaning fits the grammar “${item.korean}” in this sentence?`
      : `What does “${item.korean}” mean?`,
    passage,
    options,
    correctIndex: correctIndex >= 0 ? correctIndex : 0,
    explanation: `${item.korean} = ${item.english}.`,
  };
}

/** Random TOPIK I mock: 10 vocabulary + 5 grammar (new set each time you start). */
export function buildTopikIQuizQuestions(count = 15): QuizQuestion[] {
  const vocabPool = topikIVocabulary;
  const grammarPool = topikIGrammar;
  if (vocabPool.length < 4) return [];

  const vocabCount = Math.min(10, count, vocabPool.length);
  const grammarCount = Math.min(
    count - vocabCount,
    grammarPool.length,
    Math.max(0, count - vocabCount),
  );

  const vocabSlice = pickRandomSample(vocabPool, vocabCount);
  const grammarSlice = pickRandomSample(grammarPool, grammarCount);

  const vocabQs = vocabSlice.map((w, i) => vocabQuestion(w, vocabPool, i));
  const grammarQs = grammarSlice.map((g, i) =>
    grammarQuestion(g, grammarPool, i),
  );

  return shuffle([...vocabQs, ...grammarQs]).slice(0, count);
}
