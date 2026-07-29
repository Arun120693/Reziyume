import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { TemplateConfig } from '../studio/preview/templates/registry';
import { createPdfStyles } from './PdfShared';
import { ResumeData } from '@/lib/types/resume';

interface PdfSectionHeadingProps {
  title: string;
  config: TemplateConfig;
  formatting: ResumeData['formatting'];
}

export const PdfSectionHeading = ({ title, config, formatting }: PdfSectionHeadingProps) => {
  const styles = createPdfStyles(config, formatting);
  const { headingStyle } = config.styles;

  if (headingStyle === 'solid-bg') {
    return (
      <View style={styles.sectionHeadingSolid}>
        <Text style={styles.sectionHeadingSolidText}>{title}</Text>
      </View>
    );
  }

  if (headingStyle === 'underlined') {
    return (
      <Text style={styles.sectionHeadingUnderlined}>{title}</Text>
    );
  }

  if (headingStyle === 'uppercase') {
    return (
      <Text style={styles.sectionHeadingUppercase}>{title}</Text>
    );
  }

  return (
    <Text style={styles.sectionHeadingDefault}>{title}</Text>
  );
};
