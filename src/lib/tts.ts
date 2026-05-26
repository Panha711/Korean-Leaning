let ttsAudio: HTMLAudioElement | null = null;
let ttsPlayPromise: Promise<void> | null = null;

export function speakKorean(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return;
  if (typeof window === "undefined") return;

  if (ttsAudio) {
    const prev = ttsAudio;
    const prevPlay = ttsPlayPromise;
    ttsAudio = null;
    ttsPlayPromise = null;
    // Wait for the previous play() to settle before pausing — otherwise
    // Chrome rejects its play promise with AbortError.
    if (prevPlay) {
      prevPlay.then(() => prev.pause()).catch(() => {});
    } else {
      prev.pause();
    }
  }

  const audio = new Audio(
    `/api/tts?lang=ko&voice=Seoyeon&v=3&text=${encodeURIComponent(trimmed)}`,
  );
  ttsAudio = audio;
  const playPromise = audio.play();
  ttsPlayPromise = playPromise;
  playPromise.catch((err: unknown) => {
    // AbortError fires when another speak() interrupts this clip — expected.
    if (err instanceof DOMException && err.name === "AbortError") return;
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
