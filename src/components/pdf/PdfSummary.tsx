import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { ResumeData } from '@/lib/types/resume';
import { TemplateConfig } from '../preview/templates/registry';
import { createPdfStyles } from './PdfShared';
import { PdfSectionHeading } from './PdfSectionHeading';
import { PdfHtmlRenderer } from './PdfHtmlRenderer';

interface PdfSummaryProps {
  summary: string;
  config: TemplateConfig;
  formatting: ResumeData['formatting'];
}

export const PdfSummary = ({ summary, config, formatting }: PdfSummaryProps) => {
  const styles = createPdfStyles(config, formatting);

  if (!summary) return null;

  return (
    <View style={styles.section}>
      <PdfSectionHeading title="Professional Summary" config={config} formatting={formatting} />
      <PdfHtmlRenderer html={summary} baseStyle={styles.itemDescription} />
    </View>
  );
};
