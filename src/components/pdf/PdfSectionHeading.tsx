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
      <View wrap={false} minPresenceAhead={40} style={styles.sectionHeadingSolid}>
        <Text minPresenceAhead={40} style={styles.sectionHeadingSolidText}>{title}</Text>
      </View>
    );
  }

  if (headingStyle === 'underlined') {
    return (
      <Text minPresenceAhead={40} style={styles.sectionHeadingUnderlined}>{title}</Text>
    );
  }

  if (headingStyle === 'uppercase') {
    return (
      <Text minPresenceAhead={40} style={styles.sectionHeadingUppercase}>{title}</Text>
    );
  }

  return (
    <Text minPresenceAhead={40} style={styles.sectionHeadingDefault}>{title}</Text>
  );
};
