import { StyleSheet, Font } from '@react-pdf/renderer';
import { TemplateConfig } from '../studio/preview/templates/registry';
import { ResumeData } from '@/lib/types/resume';

export const getFontFamily = (fontClass: string) => {
  return 'Helvetica';
};

export const getSpacing = (spacing: string) => {
  if (spacing === 'compact') return 6;
  if (spacing === 'relaxed') return 16;
  return 12; // normal
};

export const createPdfStyles = (config: TemplateConfig, formatting: ResumeData['formatting']) => {
  const activeColors = { ...config.colors, primary: formatting?.accentColor || config.colors.primary };
  
  const fontSizeBase = formatting?.fontSize === 'small' ? 9 : formatting?.fontSize === 'large' ? 12 : 10;
  
  const fontSizes = {
    contact: fontSizeBase - 1.5,
    description: fontSizeBase - 0.5,
    dates: fontSizeBase - 1,
    subtitle: fontSizeBase,
    title: fontSizeBase + 1,
    heading: fontSizeBase + 2,
    jobTitle: fontSizeBase + 2,
    name: fontSizeBase + 12,
  };
  const marginBase = formatting?.margins === 'narrow' ? 24 : formatting?.margins === 'wide' ? 64 : 48;

  return StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: activeColors.background,
      fontFamily: getFontFamily(config.fonts.body),
      fontSize: fontSizes.subtitle,
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
      height: 28,
      paddingLeft: 8,
      paddingRight: 8,
      marginBottom: 8,
    },
    sectionHeadingSolidText: {
      fontFamily: getFontFamily(config.fonts.heading),
      fontSize: fontSizes.heading,
      fontWeight: 'bold',
      color: activeColors.background,
    },
    sectionHeadingUnderlined: {
      fontFamily: getFontFamily(config.fonts.heading),
      fontSize: fontSizes.heading,
      fontWeight: 'bold',
      color: activeColors.primary,
      borderBottomWidth: 2,
      borderBottomColor: activeColors.primary,
      paddingBottom: 4,
      marginBottom: 8,
    },
    sectionHeadingUppercase: {
      fontFamily: getFontFamily(config.fonts.heading),
      fontSize: fontSizes.heading,
      fontWeight: 'bold',
      color: activeColors.primary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 8,
    },
    sectionHeadingDefault: {
      fontFamily: getFontFamily(config.fonts.heading),
      fontSize: fontSizes.heading,
      fontWeight: 'bold',
      color: activeColors.primary,
      marginBottom: 8,
    },
    
    // Core Layout
    columnSidebar: {
      width: '33.33%',
      padding: marginBase,
    },
    columnMain: {
      flex: 1,
      padding: marginBase,
    },
    headerDivider: {
      height: 2,
      backgroundColor: activeColors.primary,
      marginTop: 24,
      marginBottom: 24,
    },
    photo: {
      width: 80,
      height: 80,
      borderRadius: config.styles.roundedPhoto ? 40 : 6,
      objectFit: 'cover',
      borderWidth: 2,
      borderColor: activeColors.primary,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 24,
    },
    headerTextContainer: {
    },
    nameText: {
      fontFamily: getFontFamily(config.fonts.heading),
      fontSize: fontSizes.name,
      fontWeight: 'bold',
      letterSpacing: -0.5,
      color: activeColors.primary,
    },
    jobTitleText: {
      fontFamily: getFontFamily(config.fonts.heading),
      fontSize: fontSizes.jobTitle,
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
      fontSize: fontSizes.contact,
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
      fontSize: fontSizes.title,
      fontWeight: 'bold',
      color: activeColors.text,
    },
    itemSubtitle: {
      fontFamily: getFontFamily(config.fonts.body),
      fontSize: fontSizes.subtitle,
      color: activeColors.primary,
    },
    itemDates: {
      fontFamily: getFontFamily(config.fonts.body),
      fontSize: fontSizes.dates,
      color: activeColors.secondaryText,
      textAlign: 'right',
    },
    itemDescription: {
      fontFamily: getFontFamily(config.fonts.body),
      fontSize: fontSizes.description,
      color: activeColors.secondaryText,
      lineHeight: 1.625,
      marginTop: 6,
    },
    
    // Skills
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    skillBadge: {
      backgroundColor: activeColors.border,
      paddingHorizontal: 10,
      paddingVertical: 2,
      borderRadius: 4,
    },
    skillText: {
      color: activeColors.text,
      fontSize: fontSizes.description,
    },
  });
};
