import { prisma } from './src/lib/prisma';
import { defaultResumeData } from './src/lib/types/resume';

async function main() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) throw new Error("No user found");
    
    console.log("Creating for user", user.id);
    
    const resume = await prisma.resume.create({
      data: {
        userId: user.id,
        name: defaultResumeData.name,
        templateId: defaultResumeData.templateId,
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
    console.log("Success", resume.id);
  } catch (e) {
    console.error("ERROR:");
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
