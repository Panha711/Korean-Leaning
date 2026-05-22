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
    const message = err instanceof Error ? err.message : "Translation failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
