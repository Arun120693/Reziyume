export interface Formatting {
  fontFamily: string;
  fontSize: string;
  margins: string;
  accentColor: string;
}

export interface ContactInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  photoBase64?: string;
}

export const hasProfilePhoto = (data?: ResumeData): boolean => {
  return Boolean(data?.contact?.photoBase64);
};

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: string; // e.g., 'Beginner', 'Intermediate', 'Expert'
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  technologies: string[];
}

export interface CustomSectionItem {
  id: string;
  name: string;
  subtitle: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export interface ResumeData {
  id: string;
  userId: string;
  name: string;
  templateId: string;
  contact: ContactInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  customSections: CustomSection[];
  sectionOrder: string[];
  sectionVisibility: Record<string, boolean>;
  formatting: Formatting;
  createdAt: string;
  updatedAt: string;
}

export const defaultContactInfo: ContactInfo = {
  fullName: "",
  jobTitle: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  website: "",
  photoBase64: "",
};

export const defaultFormatting: Formatting = {
  fontFamily: "Inter, sans-serif",
  fontSize: "medium",
  margins: "normal",
  accentColor: "", 
};

export const defaultResumeData: Omit<ResumeData, "id" | "userId" | "createdAt" | "updatedAt"> = {
  name: "Untitled Resume",
  templateId: "modern",
  contact: defaultContactInfo,
  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
  customSections: [],
  sectionOrder: ["experience", "education", "skills", "projects", "customSections"],
  sectionVisibility: {
    experience: true,
    education: true,
    skills: true,
    projects: true,
    customSections: true,
  },
  formatting: defaultFormatting,
};
