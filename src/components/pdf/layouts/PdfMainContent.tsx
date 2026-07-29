import React from 'react';
import { ResumeData } from '@/lib/types/resume';
import { TemplateConfig } from '../../preview/templates/registry';
import { PdfSummary } from '../PdfSummary';
import { PdfExperience } from '../PdfExperience';
import { PdfEducation } from '../PdfEducation';
import { PdfSkills } from '../PdfSkills';
import { PdfProjects } from '../PdfProjects';
import { PdfCustomSections } from '../PdfCustomSections';

interface PdfMainContentProps {
  data: ResumeData;
  config: TemplateConfig;
  sections?: string[]; // Optional override for two-column splits
}

export const PdfMainContent = ({ data, config, sections = data.sectionOrder }: PdfMainContentProps) => {
  return (
    <>
      {sections.map((sectionId) => {
        switch (sectionId) {
          case 'summary':
            return <PdfSummary key="summary" summary={data.summary} config={config} formatting={data.formatting} />;
          case 'experience':
            return <PdfExperience key="experience" experience={data.experience} config={config} formatting={data.formatting} />;
          case 'education':
            return <PdfEducation key="education" education={data.education} config={config} formatting={data.formatting} />;
          case 'skills':
            return <PdfSkills key="skills" skills={data.skills} config={config} formatting={data.formatting} />;
          case 'projects':
            return <PdfProjects key="projects" projects={data.projects} config={config} formatting={data.formatting} />;
          case 'customSections':
            return <PdfCustomSections key="custom" customSections={data.customSections} config={config} formatting={data.formatting} />;
          default:
            return null;
        }
      })}
    </>
  );
};
