import React from 'react';
import { View, Text, Link, Image } from '@react-pdf/renderer';
import { ResumeData } from '@/lib/types/resume';
import { TemplateConfig } from '../../preview/templates/registry';
import { createPdfStyles } from '../PdfShared';

interface PdfHeaderProps {
  data: ResumeData;
  config: TemplateConfig;
  align?: 'left' | 'center' | 'right';
  showPhoto?: boolean;
  lightText?: boolean;
}

export const PdfHeader = ({ data, config, align = 'left', showPhoto = true, lightText = false }: PdfHeaderProps) => {
  const styles = createPdfStyles(config, data.formatting);
  const { contact } = data;

  return (
    <View style={[styles.headerContainer, align === 'center' && { alignItems: 'center', textAlign: 'center' }]}>
      {showPhoto && contact.photoBase64 && (
        <Image src={contact.photoBase64} style={[styles.photo, align === 'center' && { marginBottom: 12, marginRight: 0 }]} />
      )}
      <View style={[styles.headerTextContainer, align === 'center' && { alignItems: 'center' }]}>
        <Text style={[styles.nameText, lightText && { color: '#ffffff' }]}>
          {contact.fullName || 'Your Name'}
        </Text>
        <Text style={[styles.jobTitleText, lightText && { color: '#f8fafc' }]}>
          {contact.jobTitle || 'Professional Title'}
        </Text>
        <View style={[styles.contactContainer, align === 'center' && { justifyContent: 'center' }]}>
          {contact.email && <Link src={`mailto:${contact.email}`} style={[styles.contactText, lightText && { color: '#f8fafc' }]}>✉ {contact.email}</Link>}
          {contact.phone && <Link src={`tel:${contact.phone}`} style={[styles.contactText, lightText && { color: '#f8fafc' }]}>☎ {contact.phone}</Link>}
          {contact.location && <Text style={[styles.contactText, lightText && { color: '#f8fafc' }]}>📍 {contact.location}</Text>}
          {contact.linkedin && <Link src={contact.linkedin.startsWith('http') ? contact.linkedin : `https://${contact.linkedin}`} style={[styles.contactText, lightText && { color: '#f8fafc' }]}>in {contact.linkedin}</Link>}
          {contact.website && <Link src={contact.website.startsWith('http') ? contact.website : `https://${contact.website}`} style={[styles.contactText, lightText && { color: '#f8fafc' }]}>🌐 {contact.website}</Link>}
        </View>
      </View>
    </View>
  );
};
