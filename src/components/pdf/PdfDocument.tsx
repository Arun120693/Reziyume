import React from 'react';
import { Document } from '@react-pdf/renderer';
import { ResumeData } from '@/lib/types/resume';
import { TemplateConfig } from '../studio/preview/templates/registry';
import { PdfTemplate } from './PdfTemplate';

interface PdfDocumentProps {
  data: ResumeData;
  config: TemplateConfig;
  pageSize?: "A4" | "LETTER";
}

export const PdfDocument = ({ data, config, pageSize = "A4" }: PdfDocumentProps) => {
  return (
    <Document title={`${data.name || 'Resume'}.pdf`}>
      <PdfTemplate data={data} config={config} pageSize={pageSize} />
    </Document>
  );
};
