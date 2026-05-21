/** Translate English → Khmer via server API (MyMemory proxy). */
export async function translateEnglishToKhmer(text: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return "";

  const res = await fetch(
    `/api/translate?${new URLSearchParams({ text: trimmed, langpair: "en|km" })}`,
  );
  const data = (await res.json()) as { translated?: string; error?: string };

  if (!res.ok) {
    throw new Error(data.error || "Translation failed");
  }

  return data.translated ?? "";
}
