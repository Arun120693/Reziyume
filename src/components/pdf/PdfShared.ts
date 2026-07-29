import { StyleSheet, Font } from '@react-pdf/renderer';
import { TemplateConfig } from '../preview/templates/registry';
import { ResumeData } from '@/lib/types/resume';

export const getFontFamily = (fontClass: string) => {
  return 'Helvetica';
};

export const getSpacing = (spacing: string) => {
  if (spacing === 'compact') return 4;
  if (spacing === 'relaxed') return 16;
  return 12; // normal
};

export const createPdfStyles = (config: TemplateConfig, formatting: ResumeData['formatting']) => {
  const activeColors = { ...config.colors, primary: formatting?.accentColor || config.colors.primary };
  
  const fontSizeBase = formatting?.fontSize === 'small' ? 9 : formatting?.fontSize === 'large' ? 12 : 10;
  const marginBase = formatting?.margins === 'narrow' ? 24 : formatting?.margins === 'wide' ? 64 : 48;

  return StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: activeColors.background,
      fontFamily: getFontFamily(config.fonts.body),
      fontSize: fontSizeBase,
      color: activeColors.text,
      padding: marginBase,
    },
    // Heading block
    section: {
      marginBottom: 20,
    },
    sectionHeadingSolid: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: activeColors.primary,
      height: 24,
      paddingLeft: 8,
      paddingRight: 8,
      marginBottom: 8,
    },
    sectionHeadingSolidText: {
      fontFamily: getFontFamily(config.fonts.heading),
      fontSize: fontSizeBase + 2,
      fontWeight: 'bold',
      color: activeColors.background,
    },
    sectionHeadingUnderlined: {
      fontFamily: getFontFamily(config.fonts.heading),
      fontSize: fontSizeBase + 2,
      fontWeight: 'bold',
      color: activeColors.primary,
      borderBottomWidth: 1.5,
      borderBottomColor: activeColors.primary,
      paddingBottom: 4,
      marginBottom: 8,
    },
    sectionHeadingUppercase: {
      fontFamily: getFontFamily(config.fonts.heading),
      fontSize: fontSizeBase + 2,
      fontWeight: 'bold',
      color: activeColors.primary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 8,
    },
    sectionHeadingDefault: {
      fontFamily: getFontFamily(config.fonts.heading),
      fontSize: fontSizeBase + 2,
      fontWeight: 'bold',
      color: activeColors.primary,
      marginBottom: 8,
    },
    
    // Core Layout
    columnSidebar: {
      padding: marginBase,
    },
    columnMain: {
      flex: 1,
      padding: marginBase,
    },
    headerDivider: {
      height: 2,
      backgroundColor: activeColors.primary,
      marginTop: 12,
      marginBottom: 24,
    },
    photo: {
      width: 80,
      height: 80,
      borderRadius: config.styles.roundedPhoto ? 40 : 8,
      marginRight: 24,
      objectFit: 'cover',
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerTextContainer: {
      flex: 1,
    },
    nameText: {
      fontFamily: getFontFamily(config.fonts.heading),
      fontSize: fontSizeBase + 14,
      fontWeight: 'bold',
      color: activeColors.primary,
    },
    jobTitleText: {
      fontFamily: getFontFamily(config.fonts.heading),
      fontSize: fontSizeBase + 2,
      color: activeColors.text,
      marginTop: 2,
    },
    contactContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 6,
      gap: 12,
    },
    contactText: {
      fontSize: fontSizeBase - 1.5,
      color: activeColors.secondaryText,
    },
    
    // Items
    itemContainer: {
      marginBottom: getSpacing(config.styles.spacing),
    },
    itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 2,
    },
    itemTitle: {
      fontFamily: getFontFamily(config.fonts.heading),
      fontSize: fontSizeBase + 1,
      fontWeight: 'bold',
      color: activeColors.text,
    },
    itemSubtitle: {
      fontFamily: getFontFamily(config.fonts.body),
      fontSize: fontSizeBase,
      color: activeColors.primary,
    },
    itemDates: {
      fontFamily: getFontFamily(config.fonts.body),
      fontSize: fontSizeBase - 1,
      color: activeColors.secondaryText,
      textAlign: 'right',
    },
    itemDescription: {
      fontFamily: getFontFamily(config.fonts.body),
      fontSize: fontSizeBase - 0.5,
      color: activeColors.secondaryText,
      lineHeight: 1.4,
      marginTop: 4,
    },
    
    // Skills
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    skillBadge: {
      backgroundColor: activeColors.border,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },
    skillText: {
      color: activeColors.text,
      fontSize: fontSizeBase - 0.5,
    },
  });
};
