import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { CoreTemplate } from "@/components/studio/preview/templates/CoreTemplate";
import { getTemplateConfig } from "@/components/studio/preview/templates/registry";
import { ResumeData } from "@/lib/types/resume";

export default async function SharedResume({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const resume = await prisma.resume.findFirst({ where: { shareToken: token, isPublic: true } });
  if (!resume) notFound();
  const data = { ...resume, contact: resume.contact, summary: resume.summary, experience: resume.experience, education: resume.education, skills: resume.skills, projects: resume.projects, customSections: resume.customSections, sectionOrder: resume.sectionOrder, sectionVisibility: resume.sectionVisibility, formatting: resume.formatting } as unknown as ResumeData;
  const config = getTemplateConfig(data.templateId);
  return <main className="min-h-screen bg-stone-100 px-4 py-10"><div className="mx-auto max-w-[900px] overflow-hidden bg-white shadow-xl"><CoreTemplate data={data} config={config} /></div><p className="mt-5 text-center text-xs text-slate-500">Created with Reziyume</p></main>;
}
