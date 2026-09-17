import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions); if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params; const source = await prisma.resume.findFirst({ where: { id, user: { email: session.user.email } } });
  if (!source) return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  const duplicate = await prisma.resume.create({ data: { userId: source.userId, name: `${source.name} copy`, contact: JSON.parse(JSON.stringify(source.contact)), summary: source.summary, experience: JSON.parse(JSON.stringify(source.experience)), education: JSON.parse(JSON.stringify(source.education)), skills: JSON.parse(JSON.stringify(source.skills)), projects: JSON.parse(JSON.stringify(source.projects)), customSections: JSON.parse(JSON.stringify(source.customSections)), sectionOrder: JSON.parse(JSON.stringify(source.sectionOrder)), sectionVisibility: source.sectionVisibility ? JSON.parse(JSON.stringify(source.sectionVisibility)) : undefined, formatting: source.formatting ? JSON.parse(JSON.stringify(source.formatting)) : undefined, templateId: source.templateId } });
  return NextResponse.json(duplicate, { status: 201 });
}
