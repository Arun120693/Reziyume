import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ResumeStudio } from "@/components/studio/ResumeStudio";
import { ResumeData, defaultContactInfo, defaultFormatting } from "@/lib/types/resume";

export default async function StudioPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }

  const { id } = await params;

  const resume = await prisma.resume.findUnique({ where: { id } });

  if (!resume) notFound();
  if (resume.userId !== session.user.id) redirect("/dashboard");

  const initialData: ResumeData = {
    id: resume.id,
    userId: resume.userId,
    name: resume.name,
    templateId: resume.templateId,
    contact: (resume.contact as any) || defaultContactInfo,
    summary: resume.summary || "",
    experience: (resume.experience as any) || [],
    education: (resume.education as any) || [],
    skills: (resume.skills as any) || [],
    projects: (resume.projects as any) || [],
    customSections: (resume.customSections as any) || [],
    sectionOrder: (resume.sectionOrder as any) || ["experience", "education", "skills", "projects", "customSections"],
    sectionVisibility: (resume.sectionVisibility as any) || {
      experience: true, education: true, skills: true, projects: true, customSections: true,
    },
    formatting: (resume.formatting as any) || defaultFormatting,
    createdAt: resume.createdAt.toISOString(),
    updatedAt: resume.updatedAt.toISOString(),
  };

  return <ResumeStudio initialData={initialData} />;
}
