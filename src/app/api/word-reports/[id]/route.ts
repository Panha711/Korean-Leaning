import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const PatchSchema = z.object({
  status: z.enum(["PENDING", "RESOLVED", "REJECTED"]),
  adminNote: z.string().trim().max(1000).optional(),
});

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/word-reports/[id]">,
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const { status, adminNote } = parsed.data;

  const report = await prisma.wordReport.update({
    where: { id },
    data: {
      status,
      adminNote,
      resolvedAt: status === "PENDING" ? null : new Date(),
    },
  });

  return NextResponse.json({ report });
}

export async function DELETE(
  _request: Request,
  context: RouteContext<"/api/word-reports/[id]">,
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await context.params;
  await prisma.wordReport.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
