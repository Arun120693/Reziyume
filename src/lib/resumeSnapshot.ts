import { z } from "zod";
const short = z.string().max(500);
const description = z.string().max(50000);
const dates = { startDate: short, endDate: short };
// Never include account ownership, sharing credentials, or database timestamps.
export const resumeSnapshotSchema = z.object({
  name: short, templateId: short,
  contact: z.object({ fullName: short, jobTitle: short, email: short, phone: short, location: short, linkedin: short, website: short, photoBase64: z.string().max(6000000).optional() }),
  summary: description,
  experience: z.array(z.object({ id: short, company: short, position: short, ...dates, current: z.boolean(), location: short, description })).max(100),
  education: z.array(z.object({ id: short, school: short, degree: short, fieldOfStudy: short, ...dates, current: z.boolean(), location: short, description })).max(100),
  skills: z.array(z.object({ id: short, name: short, level: short })).max(300),
  projects: z.array(z.object({ id: short, name: short, description, url: short, technologies: z.array(short).max(100) })).max(100),
  customSections: z.array(z.object({ id: short, title: short, items: z.array(z.object({ id: short, name: short, subtitle: short, ...dates, description })).max(100) })).max(50),
  sectionOrder: z.array(short).max(50), sectionVisibility: z.record(z.string(), z.boolean()),
  formatting: z.object({ fontFamily: short, fontSize: short, margins: short, accentColor: short }),
});
