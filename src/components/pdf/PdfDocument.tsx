import React from 'react';
import { Document } from '@react-pdf/renderer';
import { ResumeData } from '@/lib/types/resume';
import { TemplateConfig } from '../studio/preview/templates/registry';
import { PdfTemplate } from './PdfTemplate';

interface PdfDocumentProps {
  data: ResumeData;
  config: TemplateConfig;
}

export const PdfDocument = ({ data, config }: PdfDocumentProps) => {
  return (
    <Document title={`${data.name || 'Resume'}.pdf`}>
      <PdfTemplate data={data} config={config} />
    </Document>
  );
};
