import React from 'react';
import { Page, View } from '@react-pdf/renderer';
import { ResumeData, hasProfilePhoto } from '@/lib/types/resume';
import { TemplateConfig } from '../../studio/preview/templates/registry';
import { createPdfStyles } from '../PdfShared';
import { PdfHeader } from './PdfHeader';
import { PdfMainContent } from './PdfMainContent';

interface PdfTwoColumnLayoutProps {
  data: ResumeData;
  config: TemplateConfig;
}

export const PdfTwoColumnLayout = ({ data, config }: PdfTwoColumnLayoutProps) => {
  const styles = createPdfStyles(config, data.formatting);
  const isRight = config.layout === 'two-column-right';

  const Sidebar = () => (
    <View style={[styles.columnSidebar, { backgroundColor: config.colors.border }]}>
      <PdfHeader data={data} config={config} align="center" showPhoto={hasProfilePhoto(data)} />
    </View>
  );

  const Main = () => (
    <View style={styles.columnMain}>
      <PdfMainContent data={data} config={config} />
    </View>
  );

  return (
    <Page size="A4" style={[styles.page, { padding: 0, flexDirection: 'row' }]}>
      {isRight ? (
        <>
          {Main()}
          {Sidebar()}
        </>
      ) : (
        <>
          {Sidebar()}
          {Main()}
        </>
      )}
    </Page>
  );
};
