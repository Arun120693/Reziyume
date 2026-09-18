import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const resume = await prisma.resume.findFirst({ where: { id, user: { email: session.user.email } } });
  if (!resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  const body = await req.json().catch(() => ({}));
  const isPublic = body.public !== false;
  const expiresAt = typeof body.expiresAt === "string" && !Number.isNaN(Date.parse(body.expiresAt)) ? new Date(body.expiresAt) : null;
  const updated = await prisma.resume.update({ where: { id }, data: { isPublic, shareExpiresAt: isPublic ? expiresAt : resume.shareExpiresAt, shareToken: isPublic ? (resume.shareToken || crypto.randomBytes(18).toString("base64url")) : resume.shareToken }, select: { shareToken: true, isPublic: true, shareExpiresAt: true } });
  return NextResponse.json({ ...updated, url: updated.isPublic && updated.shareToken ? `/r/${updated.shareToken}` : null });
}
