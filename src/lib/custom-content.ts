import type {
  DailySentenceGroup,
  DailySentenceLine,
  DailySentencePlace,
} from "@/data/daily-sentences";
import {
  DAILY_SENTENCE_PLACE_LABELS,
  getDailySentencePlace,
} from "@/data/daily-sentences";

const WORDS_KEY = "learnnova-custom-words";
const WORD_OVERRIDES_KEY = "learnnova-word-overrides";
const WORD_FAVORITES_KEY = "learnnova-word-favorites";
const GRAMMAR_KEY = "learnnova-custom-grammar";
const DIALOGUES_KEY = "learnnova-custom-dialogues";

export const CUSTOM_ID_PREFIX = "custom-";

export interface CustomWord {
  id: string;
  korean: string;
  english: string;
  khmer: string;
  createdAt: number;
}

export interface CustomGrammar {
  id: string;
  korean: string;
  english: string;
  /** @deprecated Pattern gloss Khmer — not shown in UI; kept for older saves */
  khmer?: string;
  exampleKorean: string;
  exampleEnglish: string;
  exampleKhmer: string;
  createdAt: number;
}

export interface CustomDialogueInput {
  title: string;
  situation: string;
  place: DailySentencePlace;
  lines: DailySentenceLine[];
}

export type CustomDialogue = CustomDialogueInput & {
  id: string;
  createdAt: number;
};

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

function newId(kind: string) {
  return `${CUSTOM_ID_PREFIX}${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function isCustomContentId(id: string) {
  return id.startsWith(CUSTOM_ID_PREFIX);
}

// ─── Words ───────────────────────────────────────────────────────────────────

export function getCustomWords(): CustomWord[] {
  return readJson<CustomWord>(WORDS_KEY);
}

export function addCustomWord(
  word: Pick<CustomWord, "korean" | "english" | "khmer">,
): CustomWord {
  const items = getCustomWords();
  const entry: CustomWord = {
    id: newId("word"),
    korean: word.korean.trim(),
    english: word.english.trim(),
    khmer: word.khmer.trim(),
    createdAt: Date.now(),
  };
  writeJson(WORDS_KEY, [...items, entry]);
  return entry;
}

export function removeCustomWord(id: string) {
  writeJson(
    WORDS_KEY,
    getCustomWords().filter((w) => w.id !== id),
  );
}

export function updateCustomWord(
  id: string,
  word: Pick<CustomWord, "korean" | "english" | "khmer">,
): CustomWord | null {
  const items = getCustomWords();
  const index = items.findIndex((w) => w.id === id);
  if (index === -1) return null;
  const updated: CustomWord = {
    ...items[index],
    korean: word.korean.trim(),
    english: word.english.trim(),
    khmer: word.khmer.trim(),
  };
  const next = [...items];
  next[index] = updated;
  writeJson(WORDS_KEY, next);
  return updated;
}

// ─── Word overrides ──────────────────────────────────────────────────────────
// Personal edits to built-in EPS/TOPIK words, stored per-browser in localStorage.

export type WordOverride = {
  korean?: string;
  english?: string;
  khmer?: string;
};

export type WordOverrides = Record<string, WordOverride>;

function readWordOverrides(): WordOverrides {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(WORD_OVERRIDES_KEY);
    return raw ? (JSON.parse(raw) as WordOverrides) : {};
  } catch {
    return {};
  }
}

export function getWordOverrides(): WordOverrides {
  return readWordOverrides();
}

export function setWordOverride(id: string, override: WordOverride): WordOverrides {
  const all = readWordOverrides();
  const next: WordOverride = {};
  if (override.korean?.trim()) next.korean = override.korean.trim();
  if (override.english?.trim()) next.english = override.english.trim();
  if (override.khmer?.trim()) next.khmer = override.khmer.trim();
  all[id] = next;
  localStorage.setItem(WORD_OVERRIDES_KEY, JSON.stringify(all));
  return all;
}

export function removeWordOverride(id: string): WordOverrides {
  const all = readWordOverrides();
  delete all[id];
  localStorage.setItem(WORD_OVERRIDES_KEY, JSON.stringify(all));
  return all;
}

export function applyWordOverride<T extends { id: string; korean: string; english: string; khmer: string }>(
  word: T,
  overrides: WordOverrides,
): T {
  const o = overrides[word.id];
  if (!o) return word;
  return {
    ...word,
    korean: o.korean ?? word.korean,
    english: o.english ?? word.english,
    khmer: o.khmer ?? word.khmer,
  };
}

export function searchCustomWords(query: string, items = getCustomWords()) {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter(
    (w) =>
      w.korean.toLowerCase().includes(q) ||
      w.english.toLowerCase().includes(q) ||
      w.khmer.toLowerCase().includes(q),
  );
}

export type DisplayWord = {
  id: string;
  num: number;
  korean: string;
  english: string;
  khmer: string;
  isCustom?: boolean;
};

export function customWordsToDisplay(items: CustomWord[]): DisplayWord[] {
  return items.map((w, i) => ({
    id: w.id,
    num: i + 1,
    korean: w.korean,
    english: w.english,
    khmer: w.khmer,
    isCustom: true,
  }));
}

// ─── Word favorites ──────────────────────────────────────────────────────────

export interface FavoriteWord {
  id: string;
  korean: string;
  english: string;
  khmer: string;
  favoritedAt: number;
}

function favoritesKey(userId: string): string {
  return `${WORD_FAVORITES_KEY}:${userId}`;
}

export function getFavoriteWords(userId: string | null): FavoriteWord[] {
  if (!userId) return [];
  return readJson<FavoriteWord>(favoritesKey(userId));
}

export function isFavoriteWord(userId: string | null, id: string): boolean {
  return getFavoriteWords(userId).some((w) => w.id === id);
}

export function toggleFavoriteWord(
  userId: string,
  word: Pick<FavoriteWord, "id" | "korean" | "english" | "khmer">,
): FavoriteWord[] {
  const items = getFavoriteWords(userId);
  const exists = items.some((w) => w.id === word.id);
  const next = exists
    ? items.filter((w) => w.id !== word.id)
    : [
        ...items,
        {
          id: word.id,
          korean: word.korean,
          english: word.english,
          khmer: word.khmer,
          favoritedAt: Date.now(),
        },
      ];
  writeJson(favoritesKey(userId), next);
  return next;
}

// ─── Grammar ─────────────────────────────────────────────────────────────────

export function getCustomGrammar(): CustomGrammar[] {
  return readJson<CustomGrammar>(GRAMMAR_KEY);
}

export function addCustomGrammar(
  item: Pick<
    CustomGrammar,
    "korean" | "english" | "exampleKorean" | "exampleEnglish" | "exampleKhmer"
  >,
): CustomGrammar {
  const items = getCustomGrammar();
  const entry: CustomGrammar = {
    id: newId("grammar"),
    korean: item.korean.trim(),
    english: item.english.trim(),
    exampleKorean: item.exampleKorean.trim(),
    exampleEnglish: item.exampleEnglish.trim(),
    exampleKhmer: item.exampleKhmer.trim(),
    createdAt: Date.now(),
  };
  writeJson(GRAMMAR_KEY, [...items, entry]);
  return entry;
}

export function removeCustomGrammar(id: string) {
  writeJson(
    GRAMMAR_KEY,
    getCustomGrammar().filter((g) => g.id !== id),
  );
}

export function searchCustomGrammar(query: string, items = getCustomGrammar()) {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter(
    (g) =>
      g.korean.toLowerCase().includes(q) ||
      g.english.toLowerCase().includes(q) ||
      g.exampleKorean.toLowerCase().includes(q) ||
      g.exampleEnglish.toLowerCase().includes(q) ||
      (g.exampleKhmer ?? "").toLowerCase().includes(q) ||
      (g.khmer ?? "").toLowerCase().includes(q),
  );
}

export type DisplayGrammar = {
  id: string;
  num: number;
  korean: string;
  english: string;
  patternKhmer?: string;
  exampleKorean?: string;
  exampleEnglish?: string;
  exampleKhmer?: string;
  isCustom?: boolean;
};

export function customGrammarToDisplay(
  items: CustomGrammar[],
): DisplayGrammar[] {
  return items.map((g, i) => ({
    id: g.id,
    num: i + 1,
    korean: g.korean,
    english: g.english,
    patternKhmer: g.khmer?.trim() || undefined,
    exampleKorean: g.exampleKorean || undefined,
    exampleEnglish: g.exampleEnglish || undefined,
    exampleKhmer: g.exampleKhmer?.trim() || undefined,
    isCustom: true,
  }));
}

// ─── Daily dialogues ─────────────────────────────────────────────────────────

export function getCustomDialogues(): CustomDialogue[] {
  return readJson<CustomDialogue>(DIALOGUES_KEY);
}

export function addCustomDialogue(input: CustomDialogueInput): CustomDialogue {
  const items = getCustomDialogues();
  const entry: CustomDialogue = {
    id: newId("dialogue"),
    title: input.title.trim(),
    situation: input.situation.trim(),
    place: input.place,
    lines: input.lines.map((l) => ({
      speaker: l.speaker?.trim() || undefined,
      korean: l.korean.trim(),
      english: l.english.trim(),
      khmer: l.khmer?.trim() || undefined,
    })),
    createdAt: Date.now(),
  };
  writeJson(DIALOGUES_KEY, [...items, entry]);
  return entry;
}

export function removeCustomDialogue(id: string) {
  writeJson(
    DIALOGUES_KEY,
    getCustomDialogues().filter((d) => d.id !== id),
  );
}

export function customDialogueToGroup(
  d: CustomDialogue,
  index: number,
): DailySentenceGroup {
  return {
    id: d.id,
    num: index + 1,
    lesson: 0,
    title: d.title,
    situation: d.situation,
    place: d.place,
    lines: d.lines,
  };
}

export function mergeDialogueGroups(
  builtin: DailySentenceGroup[],
  custom: CustomDialogue[],
): DailySentenceGroup[] {
  const customGroups = custom.map((d, i) => customDialogueToGroup(d, i));
  return [...customGroups, ...builtin];
}

export function searchDialogueGroups(
  query: string,
  groups: DailySentenceGroup[],
  lineKhmer?: (groupId: string, lineIndex: number) => string,
) {
  const q = query.trim().toLowerCase();
  if (!q) return groups;
  return groups.filter((g) => {
    const place = getDailySentencePlace(g);
    const placeLabel = DAILY_SENTENCE_PLACE_LABELS[place].toLowerCase();
    return (
      g.title.toLowerCase().includes(q) ||
      g.situation.toLowerCase().includes(q) ||
      placeLabel.includes(q) ||
      g.lines.some((l, i) => {
        const khmer =
          l.khmer?.toLowerCase() ?? lineKhmer?.(g.id, i)?.toLowerCase() ?? "";
        return (
          l.korean.toLowerCase().includes(q) ||
          l.english.toLowerCase().includes(q) ||
          khmer.includes(q) ||
          (l.speaker?.toLowerCase().includes(q) ?? false)
        );
      })
    );
  });
}

export const DAILY_PLACE_OPTIONS = Object.entries(
  DAILY_SENTENCE_PLACE_LABELS,
) as [DailySentencePlace, string][];
