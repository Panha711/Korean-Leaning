"use client";

import { useCallback, useEffect, useState } from "react";
import {
  addCustomDialogue,
  addCustomGrammar,
  addCustomWord,
  getCustomDialogues,
  getCustomGrammar,
  getCustomWords,
  removeCustomDialogue,
  removeCustomGrammar,
  removeCustomWord,
  type CustomDialogue,
  type CustomDialogueInput,
  type CustomGrammar,
  type CustomWord,
} from "@/lib/custom-content";

function useStoredList<T>(
  read: () => T[],
  remove: (id: string) => void,
) {
  const [items, setItems] = useState<T[]>([]);

  const refresh = useCallback(() => {
    setItems(read());
  }, [read]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const removeItem = useCallback(
    (id: string) => {
      remove(id);
      refresh();
    },
    [remove, refresh],
  );

  return { items, refresh, removeItem };
}

export function useCustomWords() {
  const { items, refresh, removeItem } = useStoredList(getCustomWords, removeCustomWord);

  const add = useCallback(
    (word: Pick<CustomWord, "korean" | "english" | "khmer">) => {
      const entry = addCustomWord(word);
      refresh();
      return entry;
    },
    [refresh],
  );

  return { words: items, addWord: add, removeWord: removeItem, refresh };
}

export function useCustomGrammar() {
  const { items, refresh, removeItem } = useStoredList(getCustomGrammar, removeCustomGrammar);

  const add = useCallback(
    (item: Pick<
      CustomGrammar,
      "korean" | "english" | "exampleKorean" | "exampleEnglish" | "exampleKhmer"
    >) => {
      const entry = addCustomGrammar(item);
      refresh();
      return entry;
    },
    [refresh],
  );

  return { grammar: items, addGrammar: add, removeGrammar: removeItem, refresh };
}

export function useCustomDialogues() {
  const { items, refresh, removeItem } = useStoredList(getCustomDialogues, removeCustomDialogue);

  const add = useCallback(
    (input: CustomDialogueInput) => {
      const entry = addCustomDialogue(input);
      refresh();
      return entry;
    },
    [refresh],
  );

  return { dialogues: items, addDialogue: add, removeDialogue: removeItem, refresh };
}
