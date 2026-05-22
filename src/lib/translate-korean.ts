/** Translate a Korean word into English + Khmer via Gemini server route. */
export async function translateKoreanWord(
  korean: string,
): Promise<{ english: string; khmer: string }> {
  const trimmed = korean.trim();
  if (!trimmed) return { english: "", khmer: "" };

  const res = await fetch("/api/translate-word", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ korean: trimmed }),
  });
  const data = (await res.json()) as {
    english?: string;
    khmer?: string;
    error?: string;
  };

  if (!res.ok) {
    throw new Error(data.error || "Translation failed");
  }

  return { english: data.english ?? "", khmer: data.khmer ?? "" };
}
