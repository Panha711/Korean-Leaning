import { NextRequest, NextResponse } from "next/server";
import {
  isMyMemoryQuotaMessage,
  myMemoryQuotaErrorMessage,
  stripMyMemoryArtifacts,
} from "@/lib/mymemory";

export async function GET(request: NextRequest) {
  const text = request.nextUrl.searchParams.get("text")?.trim();
  const langpair = request.nextUrl.searchParams.get("langpair") ?? "en|km";

  if (!text) {
    return NextResponse.json({ error: "Missing text parameter" }, { status: 400 });
  }

  if (text.length > 500) {
    return NextResponse.json({ error: "Text too long" }, { status: 400 });
  }

  try {
    const params = new URLSearchParams({
      q: text,
      langpair,
    });
    const email = process.env.MYMEMORY_EMAIL?.trim();
    if (email) {
      params.set("de", email);
    }

    const url = `https://api.mymemory.translated.net/get?${params.toString()}`;
    const res = await fetch(url, { next: { revalidate: 0 } });
    const data = await res.json();

    if (data.responseStatus !== 200) {
      return NextResponse.json(
        { error: data.responseDetails || "Translation failed" },
        { status: 502 },
      );
    }

    const raw = String(data.responseData?.translatedText ?? "");

    if (isMyMemoryQuotaMessage(raw)) {
      return NextResponse.json(
        { error: myMemoryQuotaErrorMessage(raw) },
        { status: 429 },
      );
    }

    const translated =
      langpair === "en|km" ? stripMyMemoryArtifacts(raw) : raw.trim();

    if (!translated || isMyMemoryQuotaMessage(translated)) {
      return NextResponse.json(
        { error: myMemoryQuotaErrorMessage(raw) },
        { status: 429 },
      );
    }

    return NextResponse.json({ translated });
  } catch {
    return NextResponse.json({ error: "Translation service unavailable" }, { status: 502 });
  }
}
