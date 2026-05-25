"use client";

import { useCallback, useEffect, useState } from "react";

export type DialogueLineOverrideValue = {
  korean?: string;
  english?: string;
  khmer?: string;
};

export type DialogueLineOverrides = Record<string, DialogueLineOverrideValue>;

export function dialogueLineKey(dialogueId: string, lineIndex: number) {
  return `${dialogueId}::${lineIndex}`;
}

export function useGlobalDialogueLineOverrides() {
  const [overrides, setOverrides] = useState<DialogueLineOverrides>({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/global-dialogue-line-overrides");
      if (!res.ok) {
        setOverrides({});
        return;
      }
      const data = (await res.json()) as { overrides?: DialogueLineOverrides };
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
    async (
      dialogueId: string,
      lineIndex: number,
      value: DialogueLineOverrideValue,
    ) => {
      const res = await fetch(
        `/api/global-dialogue-line-overrides/${encodeURIComponent(dialogueId)}/${lineIndex}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(value),
        },
      );
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Failed to save line override");
      }
      setOverrides((prev) => ({
        ...prev,
        [dialogueLineKey(dialogueId, lineIndex)]: value,
      }));
    },
    [],
  );

  return { overrides, loading, setOverride, refresh };
}
