import React from 'react';
import { View, Text, Link, Image } from '@react-pdf/renderer';
import { ResumeData } from '@/lib/types/resume';
import { TemplateConfig } from '../../studio/preview/templates/registry';
import { createPdfStyles } from '../PdfShared';
import { PdfIcon } from '../PdfIcons';

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
  const iconColor = lightText ? '#f8fafc' : config.colors.secondaryText;

  return (
    <View style={[styles.headerContainer, align === 'center' ? { alignItems: 'center', textAlign: 'center', flexDirection: 'column' } : {}]}>
      {showPhoto && contact.photoBase64 && (
        // eslint-disable-next-line jsx-a11y/alt-text
        <Image src={contact.photoBase64} style={styles.photo} />
      )}
      <View style={[styles.headerTextContainer, align === 'center' ? { alignItems: 'center' } : {}]}>
        <Text style={[styles.nameText, lightText ? { color: '#ffffff' } : {}]}>
          {contact.fullName || 'Your Name'}
        </Text>
        <Text style={[styles.jobTitleText, lightText ? { color: '#f8fafc' } : {}]}>
          {contact.jobTitle || 'Professional Title'}
        </Text>
        <View style={[styles.contactContainer, align === 'center' ? { justifyContent: 'center' } : {}]}>
          {contact.email && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <PdfIcon name="email" color={iconColor} />
              <Link src={`mailto:${contact.email}`} style={[styles.contactText, lightText ? { color: '#f8fafc' } : {}]}>{contact.email}</Link>
            </View>
          )}
          {contact.phone && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <PdfIcon name="phone" color={iconColor} />
              <Link src={`tel:${contact.phone}`} style={[styles.contactText, lightText ? { color: '#f8fafc' } : {}]}>{contact.phone}</Link>
            </View>
          )}
          {contact.location && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <PdfIcon name="location" color={iconColor} />
              <Text style={[styles.contactText, lightText ? { color: '#f8fafc' } : {}]}>{contact.location}</Text>
            </View>
          )}
          {contact.linkedin && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <PdfIcon name="linkedin" color={iconColor} />
              <Link src={contact.linkedin.startsWith('http') ? contact.linkedin : `https://${contact.linkedin}`} style={[styles.contactText, lightText ? { color: '#f8fafc' } : {}]}>{contact.linkedin}</Link>
            </View>
          )}
          {contact.website && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <PdfIcon name="website" color={iconColor} />
              <Link src={contact.website.startsWith('http') ? contact.website : `https://${contact.website}`} style={[styles.contactText, lightText ? { color: '#f8fafc' } : {}]}>{contact.website}</Link>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
