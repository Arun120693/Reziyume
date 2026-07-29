import React from 'react';
import { Page, View, Image, Text, Link } from '@react-pdf/renderer';
import { ResumeData } from '@/lib/types/resume';
import { TemplateConfig } from '../../preview/templates/registry';
import { createPdfStyles } from '../PdfShared';
import { PdfMainContent } from './PdfMainContent';
import { PdfHeader } from './PdfHeader';

interface PdfHeaderLayoutProps {
  data: ResumeData;
  config: TemplateConfig;
}

export const PdfHeaderLayout = ({ data, config }: PdfHeaderLayoutProps) => {
  const styles = createPdfStyles(config, data.formatting);
  const { layout, colors } = config;
  
  const isSplitHeader = layout === 'split-header';
  const isPhotoBanner = layout === 'photo-banner';
  const isPhotoCard = layout === 'photo-card';
  const isPhotoElegant = layout === 'photo-elegant';
  const isPhotoTopRight = layout === 'photo-top-right';

  const renderCustomHeader = () => {
    // Basic wrapper with background for card/banner
    const headerStyle: any = {
      padding: 40,
      paddingBottom: 20,
    };

    if (isPhotoCard) {
      // Linear gradient approximation with a light background
      headerStyle.backgroundColor = '#f8fafc'; 
    }

    if (isPhotoTopRight || isSplitHeader) {
      return (
        <View style={[{ padding: 40, paddingBottom: 20, flexDirection: 'row', justifyContent: 'space-between' }]}>
          <View style={{ flex: 1 }}>
            <PdfHeader data={data} config={config} showPhoto={false} />
          </View>
          {data.contact.photoBase64 && config.supportsPhoto !== false && (
            <Image src={data.contact.photoBase64} style={[styles.photo, { marginLeft: 20, marginRight: 0 }]} />
          )}
        </View>
      );
    }

    // Centered variants (banner, elegant)
    if (isPhotoBanner || isPhotoElegant) {
      return (
        <View style={{ padding: 40, paddingBottom: 20, alignItems: 'center' }}>
          <PdfHeader data={data} config={config} align="center" showPhoto={true} />
        </View>
      );
    }

    // Default fallback to card style
    return (
      <View style={headerStyle}>
        <PdfHeader data={data} config={config} align="left" showPhoto={true} />
      </View>
    );
  };

  return (
    <Page size="A4" style={[styles.page, { padding: 0 }]}>
      {renderCustomHeader()}
      {isSplitHeader && <View style={[styles.headerDivider, { marginHorizontal: 40, marginTop: 0 }]} />}
      {isPhotoElegant && <View style={[styles.headerDivider, { marginHorizontal: 40, marginTop: 10, alignSelf: 'center', width: '80%' }]} />}
      <View style={{ padding: 40, paddingTop: 10 }}>
        <PdfMainContent data={data} config={config} />
      </View>
    </Page>
  );
};
