"use client";

import { useCallback, useEffect, useState } from "react";

export type GlobalOverrideValue = {
  korean?: string;
  english?: string;
  khmer?: string;
};

export type GlobalOverrides = Record<string, GlobalOverrideValue>;

export function useGlobalWordOverrides() {
  const [overrides, setOverrides] = useState<GlobalOverrides>({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/global-overrides");
      if (!res.ok) {
        setOverrides({});
        return;
      }
      const data = (await res.json()) as { overrides?: GlobalOverrides };
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
    async (wordId: string, value: GlobalOverrideValue) => {
      const res = await fetch(`/api/global-overrides/${encodeURIComponent(wordId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Failed to save override");
      }
      setOverrides((prev) => ({ ...prev, [wordId]: value }));
    },
    [],
  );

  const removeOverride = useCallback(async (wordId: string) => {
    const res = await fetch(`/api/global-overrides/${encodeURIComponent(wordId)}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to remove override");
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[wordId];
      return next;
    });
  }, []);

  return { overrides, loading, setOverride, removeOverride, refresh };
}

export function applyGlobalOverride<
  T extends { id: string; korean: string; english: string; khmer: string },
>(word: T, overrides: GlobalOverrides): T {
  const o = overrides[word.id];
  if (!o) return word;
  return {
    ...word,
    korean: o.korean ?? word.korean,
    english: o.english ?? word.english,
    khmer: o.khmer ?? word.khmer,
  };
}
