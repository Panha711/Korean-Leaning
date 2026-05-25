import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await prisma.globalGrammarOverride.findMany({
    select: {
      grammarId: true,
      korean: true,
      english: true,
      patternKhmer: true,
      exampleKorean: true,
      exampleEnglish: true,
      exampleKhmer: true,
    },
  });

  const overrides: Record<
    string,
    {
      korean?: string;
      english?: string;
      patternKhmer?: string;
      exampleKorean?: string;
      exampleEnglish?: string;
      exampleKhmer?: string;
    }
  > = {};
  for (const r of rows) {
    overrides[r.grammarId] = {
      korean: r.korean ?? undefined,
      english: r.english ?? undefined,
      patternKhmer: r.patternKhmer ?? undefined,
      exampleKorean: r.exampleKorean ?? undefined,
      exampleEnglish: r.exampleEnglish ?? undefined,
      exampleKhmer: r.exampleKhmer ?? undefined,
    };
  }

  return NextResponse.json({ overrides });
}
