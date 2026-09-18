import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { resumeSnapshotSchema } from "@/lib/resumeSnapshot";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function owned(id: string) { const session = await getServerSession(authOptions); if (!session?.user?.email) return null; return prisma.resume.findFirst({ where: { id, user: { email: session.user.email } } }); }
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; if (!(await owned(id))) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(await prisma.resumeVersion.findMany({ where: { resumeId: id }, orderBy: { createdAt: "desc" }, take: 100, select: { id: true, label: true, createdAt: true } }));
}
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const resume = await owned(id); if (!resume) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const parsed = z.object({ label: z.string().trim().min(1).max(80), snapshot: resumeSnapshotSchema }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a name and valid resume." }, { status: 400 });
  const version = await prisma.resumeVersion.create({ data: { resumeId: id, ...parsed.data } });
  return NextResponse.json(version, { status: 201 });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resume = await owned(id);
  if (!resume) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const parsed = z.object({ versionId: z.string(), action: z.enum(["rename", "restore"]), label: z.string().trim().min(1).max(80).optional() }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const version = await prisma.resumeVersion.findFirst({ where: { id: parsed.data.versionId, resumeId: id } });
  if (!version) return NextResponse.json({ error: "Version not found" }, { status: 404 });
  if (parsed.data.action === "rename") {
    if (!parsed.data.label) return NextResponse.json({ error: "Enter a name" }, { status: 400 });
    await prisma.resumeVersion.update({ where: { id: version.id }, data: { label: parsed.data.label } });
    return NextResponse.json({ ok: true });
  }
  const snapshot = resumeSnapshotSchema.safeParse(version.snapshot);
  if (!snapshot.success) return NextResponse.json({ error: "This version cannot be restored." }, { status: 422 });
  try {
    const restored = await prisma.$transaction(async tx => {
      const current = await tx.resume.findFirstOrThrow({ where: { id, userId: resume.userId } });
      await tx.resumeVersion.create({ data: { resumeId: id, label: "Before restoring " + version.label.slice(0, 55), snapshot: resumeSnapshotSchema.parse(current) } });
      return tx.resume.update({ where: { id }, data: snapshot.data });
    }, { isolationLevel: "Serializable" });
    return NextResponse.json({ resume: restored });
  } catch {
    return NextResponse.json({ error: "The resume changed during restore. Please try again." }, { status: 409 });
  }
}
