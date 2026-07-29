import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { ResumeData } from '@/lib/types/resume';
import { TemplateConfig } from '../preview/templates/registry';
import { createPdfStyles } from './PdfShared';
import { PdfSectionHeading } from './PdfSectionHeading';
import { PdfHtmlRenderer } from './PdfHtmlRenderer';

interface PdfProjectsProps {
  projects: ResumeData['projects'];
  config: TemplateConfig;
  formatting: ResumeData['formatting'];
}

export const PdfProjects = ({ projects, config, formatting }: PdfProjectsProps) => {
  const styles = createPdfStyles(config, formatting);

  if (!projects || projects.length === 0) return null;

  return (
    <View style={styles.section}>
      <PdfSectionHeading title="Projects" config={config} formatting={formatting} />
      {projects.map((proj) => (
        <View key={proj.id} style={styles.itemContainer} wrap={false}>
          <View style={styles.itemHeader}>
            <View>
              <Text style={styles.itemTitle}>{proj.name}</Text>
              {proj.url && <Text style={styles.itemSubtitle}>{proj.url}</Text>}
            </View>
            <Text style={styles.itemDates}>
              {proj.startDate} - {proj.current ? "Present" : proj.endDate}
            </Text>
          </View>
          {proj.description && (
            <PdfHtmlRenderer html={proj.description} baseStyle={styles.itemDescription} />
          )}
        </View>
      ))}
    </View>
  );
};
