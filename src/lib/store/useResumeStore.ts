import { create } from 'zustand';
import { ResumeData, ContactInfo, Experience, Education, Skill, Project, CustomSection, Formatting } from '../types/resume';

interface ResumeStore {
  data: ResumeData | null;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  
  // Initialization
  setInitialData: (data: ResumeData) => void;
  setSaving: (isSaving: boolean) => void;
  markSaved: () => void;

  // Basic Updates
  updateName: (name: string) => void;
  updateTemplateId: (templateId: string) => void;
  updateSummary: (summary: string) => void;
  updateContact: (contact: Partial<ContactInfo>) => void;
  updateFormatting: (formatting: Partial<Formatting>) => void;

  // Array Updates (Experience)
  addExperience: (experience: Experience) => void;
  updateExperience: (id: string, experience: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  
  // Array Updates (Education)
  addEducation: (education: Education) => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  removeEducation: (id: string) => void;

  // Array Updates (Skills)
  addSkill: (skill: Skill) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  removeSkill: (id: string) => void;

  // Array Updates (Projects)
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;

  // Array Updates (Custom Sections)
  addCustomSection: (section: CustomSection) => void;
  updateCustomSection: (id: string, section: Partial<CustomSection>) => void;
  removeCustomSection: (id: string) => void;

  // Section Ordering and Visibility
  updateSectionOrder: (order: string[]) => void;
  updateSectionVisibility: (sectionId: string, visible: boolean) => void;
}

export const useResumeStore = create<ResumeStore>((set) => ({
  data: null,
  hasUnsavedChanges: false,
  isSaving: false,

  setInitialData: (data) => {
    console.log("======================================================");
    console.log("STAGE 4: Store (After setInitialData is called)");
    console.log("Summary:", !!data.summary);
    console.log("Experience Length:", data.experience?.length || 0);
    console.log("Education Length:", data.education?.length || 0);
    console.log("Skills Length:", data.skills?.length || 0);
    console.log("Projects Length:", data.projects?.length || 0);
    console.log("CustomSections Length:", data.customSections?.length || 0);
    console.log("======================================================");
    set({ data, hasUnsavedChanges: false });
  },
  setSaving: (isSaving) => set({ isSaving }),
  markSaved: () => set({ hasUnsavedChanges: false }),

  updateName: (name) => set((state) => ({
    data: state.data ? { ...state.data, name } : null,
    hasUnsavedChanges: true,
  })),

  updateTemplateId: (templateId) => set((state) => ({
    data: state.data ? { 
      ...state.data, 
      templateId,
      formatting: {
        ...state.data.formatting,
        accentColor: "" // Reset to template default
      }
    } : null,
    hasUnsavedChanges: true,
  })),

  updateSummary: (summary) => set((state) => ({
    data: state.data ? { ...state.data, summary } : null,
    hasUnsavedChanges: true,
  })),

  updateContact: (contact) => set((state) => ({
    data: state.data ? { ...state.data, contact: { ...state.data.contact, ...contact } } : null,
    hasUnsavedChanges: true,
  })),

  updateFormatting: (formatting) => set((state) => ({
    data: state.data ? { ...state.data, formatting: { ...state.data.formatting, ...formatting } } : null,
    hasUnsavedChanges: true,
  })),

  addExperience: (experience) => set((state) => ({
    data: state.data ? { ...state.data, experience: [...state.data.experience, experience] } : null,
    hasUnsavedChanges: true,
  })),
  
  updateExperience: (id, experience) => set((state) => ({
    data: state.data ? {
      ...state.data,
      experience: state.data.experience.map(exp => exp.id === id ? { ...exp, ...experience } : exp)
    } : null,
    hasUnsavedChanges: true,
  })),

  removeExperience: (id) => set((state) => ({
    data: state.data ? { ...state.data, experience: state.data.experience.filter(exp => exp.id !== id) } : null,
    hasUnsavedChanges: true,
  })),

  addEducation: (education) => set((state) => ({
    data: state.data ? { ...state.data, education: [...state.data.education, education] } : null,
    hasUnsavedChanges: true,
  })),

  updateEducation: (id, education) => set((state) => ({
    data: state.data ? {
      ...state.data,
      education: state.data.education.map(edu => edu.id === id ? { ...edu, ...education } : edu)
    } : null,
    hasUnsavedChanges: true,
  })),

  removeEducation: (id) => set((state) => ({
    data: state.data ? { ...state.data, education: state.data.education.filter(edu => edu.id !== id) } : null,
    hasUnsavedChanges: true,
  })),

  addSkill: (skill) => set((state) => ({
    data: state.data ? { ...state.data, skills: [...state.data.skills, skill] } : null,
    hasUnsavedChanges: true,
  })),

  updateSkill: (id, skill) => set((state) => ({
    data: state.data ? {
      ...state.data,
      skills: state.data.skills.map(s => s.id === id ? { ...s, ...skill } : s)
    } : null,
    hasUnsavedChanges: true,
  })),

  removeSkill: (id) => set((state) => ({
    data: state.data ? { ...state.data, skills: state.data.skills.filter(s => s.id !== id) } : null,
    hasUnsavedChanges: true,
  })),

  addProject: (project) => set((state) => ({
    data: state.data ? { ...state.data, projects: [...state.data.projects, project] } : null,
    hasUnsavedChanges: true,
  })),

  updateProject: (id, project) => set((state) => ({
    data: state.data ? {
      ...state.data,
      projects: state.data.projects.map(p => p.id === id ? { ...p, ...project } : p)
    } : null,
    hasUnsavedChanges: true,
  })),

  removeProject: (id) => set((state) => ({
    data: state.data ? { ...state.data, projects: state.data.projects.filter(p => p.id !== id) } : null,
    hasUnsavedChanges: true,
  })),

  addCustomSection: (section) => set((state) => ({
    data: state.data ? { ...state.data, customSections: [...state.data.customSections, section] } : null,
    hasUnsavedChanges: true,
  })),

  updateCustomSection: (id, section) => set((state) => ({
    data: state.data ? {
      ...state.data,
      customSections: state.data.customSections.map(s => s.id === id ? { ...s, ...section } : s)
    } : null,
    hasUnsavedChanges: true,
  })),

  removeCustomSection: (id) => set((state) => ({
    data: state.data ? { ...state.data, customSections: state.data.customSections.filter(s => s.id !== id) } : null,
    hasUnsavedChanges: true,
  })),

  updateSectionOrder: (order) => set((state) => ({
    data: state.data ? { ...state.data, sectionOrder: order } : null,
    hasUnsavedChanges: true,
  })),

  updateSectionVisibility: (sectionId, visible) => set((state) => ({
    data: state.data ? { 
      ...state.data, 
      sectionVisibility: { ...state.data.sectionVisibility, [sectionId]: visible } 
    } : null,
    hasUnsavedChanges: true,
  })),
}));
