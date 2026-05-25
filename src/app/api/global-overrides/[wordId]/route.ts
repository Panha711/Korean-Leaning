import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const PutSchema = z.object({
  korean: z.string().trim().max(200).optional(),
  english: z.string().trim().max(500).optional(),
  khmer: z.string().trim().max(500).optional(),
});

export async function PUT(
  request: Request,
  context: RouteContext<"/api/global-overrides/[wordId]">,
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { wordId } = await context.params;

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

  const { korean, english, khmer } = parsed.data;
  const norm = (v?: string) => (v && v.trim() ? v.trim() : null);

  const override = await prisma.globalWordOverride.upsert({
    where: { wordId },
    create: {
      wordId,
      korean: norm(korean),
      english: norm(english),
      khmer: norm(khmer),
      createdBy: user.id,
    },
    update: {
      korean: norm(korean),
      english: norm(english),
      khmer: norm(khmer),
    },
  });

  return NextResponse.json({ override });
}

export async function DELETE(
  _request: Request,
  context: RouteContext<"/api/global-overrides/[wordId]">,
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { wordId } = await context.params;
  await prisma.globalWordOverride.delete({ where: { wordId } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
