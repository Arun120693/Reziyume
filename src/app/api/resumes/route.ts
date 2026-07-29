import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { defaultResumeData } from "@/lib/types/resume";

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
    } catch (e) {
      // ignore JSON parse error if body is empty
    }

    // Create a new blank resume in the database
    const resume = await prisma.resume.create({
      data: {
        userId: session.user.id,
        name: defaultResumeData.name,
        templateId: templateId,
        contact: defaultResumeData.contact as any,
        summary: defaultResumeData.summary,
        experience: defaultResumeData.experience as any,
        education: defaultResumeData.education as any,
        skills: defaultResumeData.skills as any,
        projects: defaultResumeData.projects as any,
        customSections: defaultResumeData.customSections as any,
        sectionOrder: defaultResumeData.sectionOrder as any,
        sectionVisibility: defaultResumeData.sectionVisibility as any,
        formatting: defaultResumeData.formatting as any,
      },
    });

    return NextResponse.json({ resume }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create resume:", error);
    return NextResponse.json({ message: "Error: " + (error.message || String(error)) }, { status: 500 });
  }
}

export async function GET(req: Request) {
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
