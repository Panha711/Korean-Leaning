import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const PutSchema = z.object({
  korean: z.string().trim().max(500).optional(),
  english: z.string().trim().max(500).optional(),
  khmer: z.string().trim().max(500).optional(),
});

export async function PUT(
  request: Request,
  context: RouteContext<"/api/global-dialogue-line-overrides/[dialogueId]/[lineIndex]">,
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { dialogueId, lineIndex } = await context.params;
  const lineIndexNum = Number(lineIndex);
  if (!Number.isInteger(lineIndexNum) || lineIndexNum < 0) {
    return NextResponse.json({ error: "Invalid lineIndex" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = PutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const norm = (v?: string) => (v && v.trim() ? v.trim() : null);
  const data = {
    korean: norm(parsed.data.korean),
    english: norm(parsed.data.english),
    khmer: norm(parsed.data.khmer),
  };

  const override = await prisma.globalDialogueLineOverride.upsert({
    where: { dialogueId_lineIndex: { dialogueId, lineIndex: lineIndexNum } },
    create: {
      dialogueId,
      lineIndex: lineIndexNum,
      createdBy: user.id,
      ...data,
    },
    update: data,
  });

  return NextResponse.json({ override });
}

export async function DELETE(
  _request: Request,
  context: RouteContext<"/api/global-dialogue-line-overrides/[dialogueId]/[lineIndex]">,
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { dialogueId, lineIndex } = await context.params;
  const lineIndexNum = Number(lineIndex);
  if (!Number.isInteger(lineIndexNum) || lineIndexNum < 0) {
    return NextResponse.json({ error: "Invalid lineIndex" }, { status: 400 });
  }
  await prisma.globalDialogueLineOverride
    .delete({ where: { dialogueId_lineIndex: { dialogueId, lineIndex: lineIndexNum } } })
    .catch(() => null);
  return NextResponse.json({ ok: true });
}
