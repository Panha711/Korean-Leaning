import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured" },
      { status: 500 },
    );
  }

  let body: { korean?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const korean = typeof body.korean === "string" ? body.korean.trim() : "";
  if (!korean) {
    return NextResponse.json(
      { error: "Missing 'korean' field" },
      { status: 400 },
    );
  }
  if (korean.length > 200) {
    return NextResponse.json({ error: "Text too long" }, { status: 400 });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: `Translate this Korean word or phrase into English and Khmer. Return concise, dictionary-style translations only — no explanations, no romanization, no extra words.\n\nKorean: ${korean}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            english: { type: Type.STRING },
            khmer: { type: Type.STRING },
          },
          required: ["english", "khmer"],
        },
      },
    });

    const text = result.text;
    if (!text) {
      return NextResponse.json(
        { error: "Empty response from Gemini" },
        { status: 502 },
      );
    }

    const parsed = JSON.parse(text) as { english?: string; khmer?: string };
    return NextResponse.json({
      english: parsed.english?.trim() ?? "",
      khmer: parsed.khmer?.trim() ?? "",
    });
  } catch (err) {
    const raw = err instanceof Error ? err.message : "";
    const { status, message } = friendlyTranslateError(raw);
    return NextResponse.json({ error: message }, { status });
  }
}

function friendlyTranslateError(raw: string): {
  status: number;
  message: string;
} {
  // Gemini SDK errors arrive as a JSON string like
  //   {"error":{"code":429,"status":"RESOURCE_EXHAUSTED","message":"..."}}
  // Strip that wrapper so users don't see the raw payload in the UI.
  let code: number | undefined;
  let status: string | undefined;
  try {
    const parsed = JSON.parse(raw) as {
      error?: { code?: number; status?: string };
    };
    code = parsed.error?.code;
    status = parsed.error?.status;
  } catch {
    // raw was not JSON — fall through to text heuristics
  }

  const isQuota =
    code === 429 ||
    status === "RESOURCE_EXHAUSTED" ||
    /quota|rate.?limit|resource_exhausted/i.test(raw);
  if (isQuota) {
    return {
      status: 429,
      message:
        "The translation service is busy right now (daily free-tier limit reached). Please try again later or enter the translation manually.",
    };
  }
  return { status: 502, message: "Translation failed. Please try again." };
}
