import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function owned(id: string) { const session = await getServerSession(authOptions); if (!session?.user?.email) return null; return prisma.resume.findFirst({ where: { id, user: { email: session.user.email } } }); }
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; if (!(await owned(id))) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(await prisma.resumeVersion.findMany({ where: { resumeId: id }, orderBy: { createdAt: "desc" }, take: 30, select: { id: true, label: true, createdAt: true, snapshot: true } }));
}
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const resume = await owned(id); if (!resume) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await req.json().catch(() => ({}));
  const version = await prisma.resumeVersion.create({ data: { resumeId: id, label: typeof body.label === "string" ? body.label.slice(0, 80) : "Saved version", snapshot: resume } });
  return NextResponse.json(version, { status: 201 });
}
