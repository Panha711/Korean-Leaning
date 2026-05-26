let ttsAudio: HTMLAudioElement | null = null;

export function speakKorean(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return;
  if (typeof window === "undefined") return;

  if (ttsAudio) {
    ttsAudio.pause();
    ttsAudio = null;
  }
  const audio = new Audio(
    `/api/tts?lang=ko&voice=Seoyeon&v=3&text=${encodeURIComponent(trimmed)}`,
  );
  ttsAudio = audio;
  audio.play().catch((err) => {
    console.error("[TTS] playback failed:", err);
  });
}

const HANGUL_RANGES = /[가-힯ᄀ-ᇿ㄰-㆏ꥠ-꥿ힰ-퟿]/;

export function hasKorean(text: string): boolean {
  return HANGUL_RANGES.test(text);
}

export function extractKorean(text: string): string {
  const matches = text.match(
    /[가-힯ᄀ-ᇿ㄰-㆏ꥠ-꥿ힰ-퟿\s.,!?~…"'()-]+/g,
  );
  if (!matches) return "";
  return matches
    .map((s) => s.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}
