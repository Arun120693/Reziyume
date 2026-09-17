import { ResumeData } from "./types/resume";

export const dummyResumeData: ResumeData = {
  id: "dummy",
  userId: "dummy_user",
  name: "Alex Morgan — Sample Resume",
  templateId: "executive",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  contact: {
    fullName: "Alex Morgan", jobTitle: "Senior Software Engineer",
    email: "alex.morgan@example.com", phone: "(415) 555-0142",
    location: "San Francisco, CA", linkedin: "", website: "", photoBase64: "",
  },
  summary: "Senior software engineer with 8 years of experience building thoughtful, reliable web products. Combines hands-on engineering with technical leadership to turn complex problems into fast, accessible experiences.",
  experience: [
    { id: "exp1", company: "Northstar Labs · Sample company", position: "Senior Software Engineer", startDate: "03/2022", endDate: "Present", current: true, location: "San Francisco, CA",
      description: "<ul><li>Improved application performance by 38% through targeted query optimization and a leaner rendering pipeline.</li><li>Led a team of 5 engineers to launch a customer workspace, reducing onboarding time from 3 days to 4 hours.</li><li>Introduced automated release checks that cut production regressions by 32%.</li></ul>" },
    { id: "exp2", company: "Fieldwork Digital · Sample company", position: "Software Engineer", startDate: "07/2018", endDate: "02/2022", current: false, location: "Austin, TX",
      description: "<ul><li>Built reusable interface components adopted across 4 product teams, shortening feature delivery by 25%.</li><li>Partnered with design and research to simplify checkout, increasing completion by 18%.</li><li>Mentored 3 early-career engineers through code reviews and weekly pairing sessions.</li></ul>" },
  ],
  education: [{ id: "edu1", school: "University of California, Davis", degree: "Bachelor of Science", fieldOfStudy: "Computer Science", startDate: "09/2014", endDate: "06/2018", current: false, location: "Davis, CA", description: "Focus: human-computer interaction and distributed systems." }],
  skills: ["TypeScript", "React", "Node.js", "PostgreSQL", "System design", "Team leadership"].map((name, i) => ({ id: `s${i}`, name, level: "" })),
  projects: [],
  customSections: [{ id: "extra", title: "Community", items: [{ id: "c1", name: "Engineering mentor", subtitle: "Volunteer", startDate: "", endDate: "", description: "Monthly portfolio reviews and interview practice for early-career developers." }] }],
  sectionOrder: ["experience", "skills", "education", "customSections"],
  sectionVisibility: {
    experience: true,
    education: true,
    skills: true,
    projects: false,
    customSections: true,
  },
  formatting: {
    fontFamily: "Inter, sans-serif",
    fontSize: "medium",
    margins: "normal",
    accentColor: "",
  }
};
