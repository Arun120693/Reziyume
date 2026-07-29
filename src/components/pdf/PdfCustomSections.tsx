import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { ResumeData } from '@/lib/types/resume';
import { TemplateConfig } from '../preview/templates/registry';
import { createPdfStyles } from './PdfShared';
import { PdfSectionHeading } from './PdfSectionHeading';
import { PdfHtmlRenderer } from './PdfHtmlRenderer';

interface PdfCustomSectionsProps {
  customSections: ResumeData['customSections'];
  config: TemplateConfig;
  formatting: ResumeData['formatting'];
}

export const PdfCustomSections = ({ customSections, config, formatting }: PdfCustomSectionsProps) => {
  const styles = createPdfStyles(config, formatting);

  if (!customSections || customSections.length === 0) return null;

  return (
    <>
      {customSections.map(section => {
        if (!section.items || section.items.length === 0) return null;
        
        return (
          <View key={section.id} style={styles.section}>
            <PdfSectionHeading title={section.title} config={config} formatting={formatting} />
            {section.items.map(item => (
              <View key={item.id} style={styles.itemContainer} wrap={false}>
                <View style={styles.itemHeader}>
                  <View>
                    <Text style={styles.itemTitle}>{item.name}</Text>
                    {item.subtitle && <Text style={styles.itemSubtitle}>{item.subtitle}</Text>}
                  </View>
                  {(item.startDate || item.endDate) && (
                    <Text style={styles.itemDates}>
                      {item.startDate} {item.startDate && item.endDate ? '-' : ''} {item.endDate}
                    </Text>
                  )}
                </View>
                {item.description && (
                  <PdfHtmlRenderer html={item.description} baseStyle={styles.itemDescription} />
                )}
              </View>
            ))}
          </View>
        );
      })}
    </>
  );
};
