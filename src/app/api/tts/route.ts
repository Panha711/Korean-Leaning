import { NextRequest, NextResponse } from "next/server";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function tryUpstream(
  url: string,
  init?: RequestInit,
): Promise<Response | null> {
  try {
    const res = await fetch(url, init);
    const contentType = res.headers.get("content-type") ?? "";
    if (!res.ok || !res.body || !contentType.toLowerCase().includes("audio")) {
      console.error(
        `[TTS] upstream rejected: status=${res.status} content-type="${contentType}" url=${url}`,
      );
      return null;
    }
    return res;
  } catch (err) {
    console.error("[TTS] upstream threw:", err, "url=", url);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const text = request.nextUrl.searchParams.get("text")?.trim();
  const lang = request.nextUrl.searchParams.get("lang") ?? "ko";
  const voice =
    request.nextUrl.searchParams.get("voice")?.trim() || "Seoyeon";

  if (!text) {
    return NextResponse.json({ error: "Missing text parameter" }, { status: 400 });
  }
  if (text.length > 200) {
    return NextResponse.json({ error: "Text too long" }, { status: 400 });
  }

  // 1. StreamElements (Amazon Polly) — has female Korean (Seoyeon).
  const seUrl = `https://api.streamelements.com/kappa/v2/speech?voice=${encodeURIComponent(
    voice,
  )}&text=${encodeURIComponent(text)}`;
  const seRes = await tryUpstream(seUrl, {
    headers: {
      "User-Agent": UA,
      Accept: "audio/mpeg, audio/*;q=0.9, */*;q=0.5",
    },
  });

  // 2. Google Translate TTS fallback.
  const gRes =
    seRes ??
    (await tryUpstream(
      `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
        text,
      )}&tl=${encodeURIComponent(lang)}&client=tw-ob`,
      {
        headers: {
          "User-Agent": UA,
          Referer: "https://translate.google.com/",
          Accept: "audio/mpeg, audio/*;q=0.9, */*;q=0.5",
        },
      },
    ));

  if (!gRes) {
    return NextResponse.json(
      { error: "All TTS providers failed" },
      { status: 502 },
    );
  }

  return new NextResponse(gRes.body, {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
