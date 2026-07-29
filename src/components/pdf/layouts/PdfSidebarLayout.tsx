import React from 'react';
import { Page, View } from '@react-pdf/renderer';
import { ResumeData } from '@/lib/types/resume';
import { TemplateConfig } from '../../preview/templates/registry';
import { createPdfStyles } from '../PdfShared';
import { PdfHeader } from './PdfHeader';
import { PdfMainContent } from './PdfMainContent';

interface PdfSidebarLayoutProps {
  data: ResumeData;
  config: TemplateConfig;
}

export const PdfSidebarLayout = ({ data, config }: PdfSidebarLayoutProps) => {
  const styles = createPdfStyles(config, data.formatting);
  
  return (
    <Page size="A4" style={[styles.page, { padding: 0, flexDirection: 'row' }]}>
      {/* Sidebar: 35% width, primary background */}
      <View style={[styles.columnSidebar, { width: '35%', backgroundColor: config.colors.primary, paddingTop: 40 }]}>
        <PdfHeader data={data} config={config} align="center" showPhoto={config.supportsPhoto !== false} lightText={true} />
      </View>

      {/* Main Content: 65% width */}
      <View style={[styles.columnMain, { width: '65%', paddingTop: 40 }]}>
        <PdfMainContent data={data} config={config} />
      </View>
    </Page>
  );
};
