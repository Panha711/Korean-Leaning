"use client";

import { useCallback, useEffect, useState } from "react";

export type GlobalGrammarOverrideValue = {
  korean?: string;
  english?: string;
  patternKhmer?: string;
  exampleKorean?: string;
  exampleEnglish?: string;
  exampleKhmer?: string;
};

export type GlobalGrammarOverrides = Record<string, GlobalGrammarOverrideValue>;

export function useGlobalGrammarOverrides() {
  const [overrides, setOverrides] = useState<GlobalGrammarOverrides>({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/global-grammar-overrides");
      if (!res.ok) {
        setOverrides({});
        return;
      }
      const data = (await res.json()) as { overrides?: GlobalGrammarOverrides };
      setOverrides(data.overrides ?? {});
    } catch {
      setOverrides({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const setOverride = useCallback(
    async (grammarId: string, value: GlobalGrammarOverrideValue) => {
      const res = await fetch(
        `/api/global-grammar-overrides/${encodeURIComponent(grammarId)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(value),
        },
      );
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Failed to save grammar override");
      }
      setOverrides((prev) => ({ ...prev, [grammarId]: value }));
    },
    [],
  );

  return { overrides, loading, setOverride, refresh };
}

export function applyGlobalGrammarOverride<
  T extends {
    id: string;
    korean: string;
    english: string;
    patternKhmer?: string;
    exampleKorean?: string;
    exampleEnglish?: string;
    exampleKhmer?: string;
  },
>(grammar: T, overrides: GlobalGrammarOverrides): T {
  const o = overrides[grammar.id];
  if (!o) return grammar;
  return {
    ...grammar,
    korean: o.korean ?? grammar.korean,
    english: o.english ?? grammar.english,
    patternKhmer: o.patternKhmer ?? grammar.patternKhmer,
    exampleKorean: o.exampleKorean ?? grammar.exampleKorean,
    exampleEnglish: o.exampleEnglish ?? grammar.exampleEnglish,
    exampleKhmer: o.exampleKhmer ?? grammar.exampleKhmer,
  };
}
