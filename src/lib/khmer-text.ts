/** Normalize Khmer for display (NFC, strip zero-width chars, known fixes). */
export function normalizeKhmer(text: string): string {
  return text
    .replace(/[\u200B-\u200D\uFEFF\u00A0]/g, "")
    .replace(/មឺុន/g, "ម៉ឺន")
    .replace(/\s+/g, " ")
    .trim()
    .normalize("NFC");
}
