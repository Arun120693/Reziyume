import React from 'react';
import { Page, View } from '@react-pdf/renderer';
import { ResumeData } from '@/lib/types/resume';
import { TemplateConfig } from '../../preview/templates/registry';
import { createPdfStyles } from '../PdfShared';
import { PdfHeader } from './PdfHeader';
import { PdfMainContent } from './PdfMainContent';

interface PdfSingleColumnLayoutProps {
  data: ResumeData;
  config: TemplateConfig;
}

export const PdfSingleColumnLayout = ({ data, config }: PdfSingleColumnLayoutProps) => {
  const styles = createPdfStyles(config, data.formatting);
  const isCentered = config.layout === 'centered';

  return (
    <Page size="A4" style={styles.page}>
      <PdfHeader data={data} config={config} align={isCentered ? 'center' : 'left'} showPhoto={config.supportsPhoto !== false} />
      {isCentered && <View style={styles.headerDivider} />}
      <PdfMainContent data={data} config={config} />
    </Page>
  );
};
