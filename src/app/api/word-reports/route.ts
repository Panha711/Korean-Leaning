import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const CreateSchema = z.object({
  wordId: z.string().trim().min(1).max(80),
  wordKorean: z.string().trim().min(1).max(200),
  wordEnglish: z.string().trim().min(1).max(500),
  wordKhmer: z.string().trim().max(500).default(""),
  suggestedKorean: z.string().trim().max(200).optional(),
  suggestedEnglish: z.string().trim().max(500).optional(),
  suggestedKhmer: z.string().trim().max(500).optional(),
  reason: z.string().trim().max(1000).default(""),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  try {
    const report = await prisma.wordReport.create({
      data: {
        userId: user.id,
        ...parsed.data,
      },
    });
    return NextResponse.json({ report });
  } catch (err) {
    console.error("POST /api/word-reports failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create report" },
      { status: 500 },
    );
  }
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = user.role === "ADMIN";

  const reports = await prisma.wordReport.findMany({
    where: isAdmin ? undefined : { userId: user.id },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: isAdmin
      ? { user: { select: { id: true, name: true, email: true } } }
      : undefined,
  });

  return NextResponse.json({ reports, viewerRole: user.role });
}
