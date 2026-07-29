import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { ResumeData } from '@/lib/types/resume';
import { TemplateConfig } from '../studio/preview/templates/registry';
import { createPdfStyles } from './PdfShared';
import { PdfSectionHeading } from './PdfSectionHeading';
import { PdfHtmlRenderer } from './PdfHtmlRenderer';

interface PdfExperienceProps {
  experience: ResumeData['experience'];
  config: TemplateConfig;
  formatting: ResumeData['formatting'];
}

export const PdfExperience = ({ experience, config, formatting }: PdfExperienceProps) => {
  const styles = createPdfStyles(config, formatting);

  if (!experience || experience.length === 0) return null;

  return (
    <View style={styles.section}>
      <PdfSectionHeading title="Experience" config={config} formatting={formatting} />
      {experience.map((exp) => (
        <View key={exp.id} style={styles.itemContainer} wrap={false}>
          <View style={styles.itemHeader}>
            <View>
              <Text style={styles.itemTitle}>{exp.position}</Text>
              <Text style={styles.itemSubtitle}>
                {exp.company} {exp.location && `• ${exp.location}`}
              </Text>
            </View>
            <Text style={styles.itemDates}>
              {exp.startDate} - {exp.current ? "Present" : exp.endDate}
            </Text>
          </View>
          {exp.description && (
            <PdfHtmlRenderer html={exp.description} baseStyle={styles.itemDescription} />
          )}
        </View>
      ))}
    </View>
  );
};
