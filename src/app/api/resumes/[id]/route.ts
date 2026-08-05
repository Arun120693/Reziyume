import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const resume = await prisma.resume.findUnique({
      where: {
        id,
      },
    });

    if (!resume) {
      return NextResponse.json({ message: "Resume not found" }, { status: 404 });
    }

    // Ensure the resume belongs to the logged-in user
    if (resume.userId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ resume });
  } catch (error) {
    console.error("Failed to fetch resume:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    // Verify ownership first
    const existingResume = await prisma.resume.findUnique({
      where: { id },
    });

    if (!existingResume) {
      return NextResponse.json({ message: "Resume not found" }, { status: 404 });
    }

    if (existingResume.userId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Update the resume with the provided data
    const updatedResume = await prisma.resume.update({
      where: { id },
      data: {
        name: body.name,
        templateId: body.templateId,
        contact: body.contact,
        summary: body.summary,
        experience: body.experience,
        education: body.education,
        skills: body.skills,
        projects: body.projects,
        customSections: body.customSections,
        sectionOrder: body.sectionOrder,
        sectionVisibility: body.sectionVisibility,
        formatting: body.formatting,
      },
    });

    return NextResponse.json({ resume: updatedResume });
  } catch (error) {
    console.error("Failed to update resume:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
