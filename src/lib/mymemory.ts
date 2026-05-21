/** MyMemory embeds quota warnings inside translatedText while still returning HTTP 200. */
export function isMyMemoryQuotaMessage(text: string): boolean {
  return /MYMEMORY\s+WARNING/i.test(text) || /USAGELIMITS\.PHP/i.test(text);
}

export function myMemoryQuotaErrorMessage(raw: string): string {
  const timeMatch = raw.match(
    /NEXT AVAILABLE IN\s+((?:\d+\s+HOURS?\s+)?(?:\d+\s+MINUTES?\s+)?(?:\d+\s+SECONDS?)?)/i,
  );
  const when = timeMatch?.[1]?.replace(/\s+/g, " ").trim();
  if (when) {
    return `Daily free translation limit reached. Try again in ${when.toLowerCase()}, or type Khmer manually.`;
  }
  return "Daily free translation limit reached. Try again later, or type Khmer manually.";
}

export function stripMyMemoryArtifacts(text: string): string {
  return text
    .replace(/MYMEMORY\s+WARNING[\s\S]*/gi, "")
    .replace(/\(link[^)]*\)/gi, "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .normalize("NFC");
}
