import { ResumeData } from "./types/resume";

export const dummyResumeData: ResumeData = {
  id: "dummy",
  userId: "dummy_user",
  name: "James Appleseed",
  templateId: "apollo",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  contact: {
    fullName: "James Appleseed",
    jobTitle: "Head Cashier",
    email: "james.appleseed@resume.com",
    phone: "(555) 555-5555",
    location: "1234 Main St, San Francisco, CA",
    linkedin: "",
    website: "",
    photoBase64: "", // Omit photo for classic ATS look, or can add a placeholder
  },
  summary: "Head Cashier with over 7 years of experience in providing excellent customer service, handling daily accounts and maintaining inventory. Aiming to use my knowledge and expertise to effectively fill the managerial role in your store. Possesses a Bachelor's degree in Arts.",
  experience: [
    {
      id: "exp1",
      company: "Barnes & Noble",
      position: "Cashier and Key Holder",
      startDate: "09/2016",
      endDate: "Present",
      current: true,
      location: "Syracuse, New York",
      description: "• Expertise in business administration, record keeping, planning, policies, procedures, researching, scheduling, and related responsibilities to ensure productive operations\n• Open and close the registers, assisting in the training of 6 new cashiers, monitoring cash limits and ensuring quality customer service at all times"
    },
    {
      id: "exp2",
      company: "Best Buy",
      position: "Cashier",
      startDate: "05/2014",
      endDate: "08/2016",
      current: false,
      location: "Syracuse, New York",
      description: "• Operate POS cash register, handling 92 transactions on average daily, and count money in cash drawers to ensure the amount is correct\n• Develop reputation for prompt, efficient service with high level of accuracy, receiving top ratings during all 2 years in the store\n• Maintain thorough knowledge of store merchandise, and responsible for selling in-store credit cards"
    }
  ],
  education: [
    {
      id: "edu1",
      school: "State High School",
      degree: "High School Diploma",
      fieldOfStudy: "General Studies",
      startDate: "09/2010",
      endDate: "05/2014",
      current: false,
      location: "Rome, Lazio",
      description: "• Expertise in business administration, record keeping, planning, policies, procedures, researching, scheduling, and related responsibilities to ensure productive operations\n• Open and close the registers, assisting in the training of 6 new cashiers, monitoring cash limits and ensuring quality customer service at all times"
    }
  ],
  skills: [
    { id: "s1", name: "Accuracy", level: "" },
    { id: "s2", name: "Computer Skills", level: "" },
    { id: "s3", name: "Product Knowledge", level: "" },
    { id: "s4", name: "Memorization", level: "" },
    { id: "s5", name: "Job Safety", level: "" },
    { id: "s6", name: "Loss prevention techniques", level: "" },
  ],
  projects: [],
  customSections: [
    {
      id: "lang1",
      title: "Languages",
      items: [
        {
          id: "li1",
          name: "Arabic",
          subtitle: "Native Speaker",
          startDate: "",
          endDate: "",
          description: ""
        },
        {
          id: "li2",
          name: "Cantonese",
          subtitle: "Fluent",
          startDate: "",
          endDate: "",
          description: ""
        }
      ]
    }
  ],
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
