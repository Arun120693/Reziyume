import React from 'react';
import { ResumeData } from '@/lib/types/resume';
import { TemplateConfig } from '../studio/preview/templates/registry';
import { PdfSingleColumnLayout } from './layouts/PdfSingleColumnLayout';
import { PdfTwoColumnLayout } from './layouts/PdfTwoColumnLayout';
import { PdfSidebarLayout } from './layouts/PdfSidebarLayout';
import { PdfHeaderLayout } from './layouts/PdfHeaderLayout';

interface PdfTemplateProps {
  data: ResumeData;
  config: TemplateConfig;
}

export const PdfTemplate = ({ data, config }: PdfTemplateProps) => {
  const { layout } = config;

  // Route to the generic layout primitive
  switch (layout) {
    case 'two-column-left':
    case 'two-column-right':
      return <PdfTwoColumnLayout data={data} config={config} />;
      
    case 'photo-sidebar':
      return <PdfSidebarLayout data={data} config={config} />;
      
    case 'split-header':
    case 'photo-banner':
    case 'photo-top-right':
    case 'photo-card':
    case 'photo-elegant':
      return <PdfHeaderLayout data={data} config={config} />;
      
    case 'single-column':
    case 'centered':
    default:
      return <PdfSingleColumnLayout data={data} config={config} />;
  }
};
