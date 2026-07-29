import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { ResumeData } from '@/lib/types/resume';
import { TemplateConfig } from '../preview/templates/registry';
import { createPdfStyles } from './PdfShared';
import { PdfSectionHeading } from './PdfSectionHeading';
import { PdfHtmlRenderer } from './PdfHtmlRenderer';

interface PdfEducationProps {
  education: ResumeData['education'];
  config: TemplateConfig;
  formatting: ResumeData['formatting'];
}

export const PdfEducation = ({ education, config, formatting }: PdfEducationProps) => {
  const styles = createPdfStyles(config, formatting);

  if (!education || education.length === 0) return null;

  return (
    <View style={styles.section}>
      <PdfSectionHeading title="Education" config={config} formatting={formatting} />
      {education.map((edu) => (
        <View key={edu.id} style={styles.itemContainer} wrap={false}>
          <View style={styles.itemHeader}>
            <View>
              <Text style={styles.itemTitle}>
                {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
              </Text>
              <Text style={styles.itemSubtitle}>
                {edu.school} {edu.location && `• ${edu.location}`}
              </Text>
            </View>
            <Text style={styles.itemDates}>
              {edu.startDate} - {edu.current ? "Present" : edu.endDate}
            </Text>
          </View>
          {edu.description && (
            <PdfHtmlRenderer html={edu.description} baseStyle={styles.itemDescription} />
          )}
        </View>
      ))}
    </View>
  );
};
