import { z } from "zod";
export const jobStatuses = ["Saved", "Applied", "Interview", "Offer", "Rejected", "Withdrawn"] as const;
export const jobApplicationSchema = z.object({
  company: z.string().trim().min(1).max(200), role: z.string().trim().min(1).max(200),
  url: z.string().max(2000).refine(s => !s || /^https?:\/\//i.test(s), "Use an http or https URL"),
  status: z.enum(jobStatuses), notes: z.string().max(20000),
  appliedAt: z.string().datetime().nullable(),
});
