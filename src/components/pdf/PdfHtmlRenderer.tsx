import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

interface PdfHtmlRendererProps {
  html: string;
  baseStyle?: any;
}

const styles = StyleSheet.create({
  p: {
    marginBottom: 4,
  },
  ul: {
    marginBottom: 4,
  },
  liContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  bullet: {
    width: 10,
    fontSize: 10,
    marginTop: 1,
  },
  liContent: {
    flex: 1,
  }
});

// A very simple parser tailored for the output of react-quill
export const PdfHtmlRenderer = ({ html, baseStyle }: PdfHtmlRendererProps) => {
  if (!html) return null;

  // Clean the HTML similarly to CoreTemplate
  let clean = html;
  clean = clean.replace(/<br\s*\/?>/gi, '\n');
  
  // Convert basic tags to simple tokens for splitting
  clean = clean.replace(/<p[^>]*>/gi, '[P]');
  clean = clean.replace(/<\/p>/gi, '[/P]');
  clean = clean.replace(/<ul[^>]*>/gi, '[UL]');
  clean = clean.replace(/<\/ul>/gi, '[/UL]');
  clean = clean.replace(/<li[^>]*>/gi, '[LI]');
  clean = clean.replace(/<\/li>/gi, '[/LI]');
  clean = clean.replace(/<strong[^>]*>/gi, '[B]');
  clean = clean.replace(/<\/strong>/gi, '[/B]');
  clean = clean.replace(/<em[^>]*>/gi, '[I]');
  clean = clean.replace(/<\/em>/gi, '[/I]');

  // Remove any remaining HTML tags
  clean = clean.replace(/<[^>]+>/g, '');

  const blocks = clean.split(/(?=\[P\]|\[UL\]|\[\/UL\])/).filter(Boolean);

  let inList = false;

  return (
    <View style={baseStyle}>
      {blocks.map((block, idx) => {
        if (block.startsWith('[UL]')) {
          inList = true;
          const content = block.replace('[UL]', '').trim();
          if (!content) return null;
          block = content; // process the rest as list items if any
        }
        if (block.startsWith('[/UL]')) {
          inList = false;
          const content = block.replace('[/UL]', '').trim();
          if (!content) return null;
          block = content;
        }

        if (inList || block.includes('[LI]')) {
          const items = block.split(/(?=\[LI\])/).filter(Boolean);
          return (
            <View key={idx} style={styles.ul}>
              {items.map((item, iIdx) => {
                let text = item.replace(/\[\/?LI\]/g, '').trim();
                text = text.replace(/^(?:&middot;|&bull;|&#183;|&#8226;|˚|°|◦|·|•|-|\*)\s*/i, ''); // Strip existing bullets
                if (!text) return null;
                return (
                  <View key={iIdx} style={styles.liContainer}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.liContent}>{text}</Text>
                  </View>
                );
              })}
            </View>
          );
        }

        // Paragraphs
        let text = block.replace(/\[\/?P\]/g, '').trim();
        if (!text) return null;
        return (
          <View key={idx} style={styles.p}>
            <Text>{text}</Text>
          </View>
        );
      })}
    </View>
  );
};
