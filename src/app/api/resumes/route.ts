import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { defaultResumeData } from "@/lib/types/resume";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let templateId = defaultResumeData.templateId;
    try {
      const body = await req.json();
      if (body.templateId) {
        templateId = body.templateId;
      }
    } catch {
      // ignore JSON parse error if body is empty
    }

    // Create a new blank resume in the database
    const resume = await prisma.resume.create({
      data: {
        userId: session.user.id,
        name: defaultResumeData.name,
        templateId: templateId,
        contact: defaultResumeData.contact as unknown as Prisma.InputJsonValue,
        summary: defaultResumeData.summary,
        experience: defaultResumeData.experience as unknown as Prisma.InputJsonValue,
        education: defaultResumeData.education as unknown as Prisma.InputJsonValue,
        skills: defaultResumeData.skills as unknown as Prisma.InputJsonValue,
        projects: defaultResumeData.projects as unknown as Prisma.InputJsonValue,
        customSections: defaultResumeData.customSections as unknown as Prisma.InputJsonValue,
        sectionOrder: defaultResumeData.sectionOrder as unknown as Prisma.InputJsonValue,
        sectionVisibility: defaultResumeData.sectionVisibility as unknown as Prisma.InputJsonValue,
        formatting: defaultResumeData.formatting as unknown as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({ resume }, { status: 201 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Failed to create resume:", error);
    return NextResponse.json({ message: "Error: " + (error.message || String(error)) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch all resumes for this user, ordered by most recently updated
    const resumes = await prisma.resume.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        name: true,
        templateId: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ resumes });
  } catch (error) {
    console.error("Failed to fetch resumes:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
