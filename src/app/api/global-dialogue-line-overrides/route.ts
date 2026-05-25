import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await prisma.globalDialogueLineOverride.findMany({
    select: {
      dialogueId: true,
      lineIndex: true,
      korean: true,
      english: true,
      khmer: true,
    },
  });

  const overrides: Record<
    string,
    { korean?: string; english?: string; khmer?: string }
  > = {};
  for (const r of rows) {
    overrides[`${r.dialogueId}::${r.lineIndex}`] = {
      korean: r.korean ?? undefined,
      english: r.english ?? undefined,
      khmer: r.khmer ?? undefined,
    };
  }

  return NextResponse.json({ overrides });
}
