import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const PutSchema = z.object({
  korean: z.string().trim().max(300).optional(),
  english: z.string().trim().max(500).optional(),
  patternKhmer: z.string().trim().max(500).optional(),
  exampleKorean: z.string().trim().max(500).optional(),
  exampleEnglish: z.string().trim().max(500).optional(),
  exampleKhmer: z.string().trim().max(500).optional(),
});

export async function PUT(
  request: Request,
  context: RouteContext<"/api/global-grammar-overrides/[grammarId]">,
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { grammarId } = await context.params;

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
    patternKhmer: norm(parsed.data.patternKhmer),
    exampleKorean: norm(parsed.data.exampleKorean),
    exampleEnglish: norm(parsed.data.exampleEnglish),
    exampleKhmer: norm(parsed.data.exampleKhmer),
  };

  const override = await prisma.globalGrammarOverride.upsert({
    where: { grammarId },
    create: { grammarId, createdBy: user.id, ...data },
    update: data,
  });

  return NextResponse.json({ override });
}

export async function DELETE(
  _request: Request,
  context: RouteContext<"/api/global-grammar-overrides/[grammarId]">,
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { grammarId } = await context.params;
  await prisma.globalGrammarOverride.delete({ where: { grammarId } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
