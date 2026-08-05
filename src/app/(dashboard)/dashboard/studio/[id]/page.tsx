import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ResumeStudio } from "@/components/studio/ResumeStudio";
import { ResumeData, defaultContactInfo, defaultFormatting, ContactInfo, Experience, Education, Skill, Project, CustomSection, Formatting } from "@/lib/types/resume";

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
    contact: (resume.contact as unknown as ContactInfo) || defaultContactInfo,
    summary: resume.summary || "",
    experience: (resume.experience as unknown as Experience[]) || [],
    education: (resume.education as unknown as Education[]) || [],
    skills: (resume.skills as unknown as Skill[]) || [],
    projects: (resume.projects as unknown as Project[]) || [],
    customSections: (resume.customSections as unknown as CustomSection[]) || [],
    sectionOrder: (resume.sectionOrder as unknown as string[]) || ["experience", "education", "skills", "projects", "customSections"],
    sectionVisibility: (resume.sectionVisibility as unknown as Record<string, boolean>) || {
      experience: true, education: true, skills: true, projects: true, customSections: true,
    },
    formatting: (resume.formatting as unknown as Formatting) || defaultFormatting,
    createdAt: resume.createdAt.toISOString(),
    updatedAt: resume.updatedAt.toISOString(),
  };

  return <ResumeStudio initialData={initialData} />;
}
