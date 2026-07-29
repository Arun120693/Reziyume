import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { ResumeData } from '@/lib/types/resume';
import { TemplateConfig } from '../preview/templates/registry';
import { createPdfStyles } from './PdfShared';
import { PdfSectionHeading } from './PdfSectionHeading';

interface PdfSkillsProps {
  skills: ResumeData['skills'];
  config: TemplateConfig;
  formatting: ResumeData['formatting'];
}

export const PdfSkills = ({ skills, config, formatting }: PdfSkillsProps) => {
  const styles = createPdfStyles(config, formatting);

  if (!skills || skills.length === 0) return null;

  return (
    <View style={styles.section}>
      <PdfSectionHeading title="Skills" config={config} formatting={formatting} />
      <View style={styles.skillsContainer}>
        {skills.map((skill) => (
          <View key={skill.id} style={styles.skillBadge}>
            <Text style={styles.skillText}>
              {skill.name} {skill.level && `(${skill.level})`}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};
