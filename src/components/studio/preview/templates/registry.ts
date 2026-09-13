export type LayoutType = 'single-column' | 'two-column-left' | 'two-column-right' | 'split-header' | 'centered' | 'photo-sidebar' | 'photo-banner' | 'photo-top-right' | 'photo-card' | 'photo-elegant' | 'photo-split-yellow' | 'photo-pink-border' | 'photo-dark-modern' | 'photo-overlap-green' | 'photo-dark-bubbles';
export type HeadingStyle = 'solid-bg' | 'underlined' | 'uppercase' | 'default';

export interface TemplateConfig {
  id: string;
  name: string;
  category: string;
  description: string;
  layout: LayoutType;
  recommendedFor?: string[];
  featured?: boolean;
  supportsPhoto: boolean; // whether this template prominently features a photo
  colors: {
    primary: string;
    background: string;
    text: string;
    secondaryText: string;
    border: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  styles: {
    headingStyle: HeadingStyle;
    spacing: 'compact' | 'normal' | 'relaxed';
    roundedPhoto: boolean;
  };
}

export const templates: TemplateConfig[] = [
{"id": "signal", "name": "Signal", "category": "Professional", "description": "A focused single-column design for engineering, data, and technical achievements.", "layout": "single-column", "supportsPhoto": false, "featured": true, "recommendedFor": ["Software engineering", "Data & analytics"], "colors": {"primary": "#233d64", "background": "#ffffff", "text": "#242b30", "secondaryText": "#52606a", "border": "#e2e6e5"}, "fonts": {"heading": "font-sans", "body": "font-sans"}, "styles": {"headingStyle": "uppercase", "spacing": "compact", "roundedPhoto": false}},
{"id": "executive", "name": "Executive", "category": "Professional", "description": "Refined serif typography and generous spacing for a career built on leadership.", "layout": "centered", "supportsPhoto": false, "featured": true, "recommendedFor": ["Leadership", "Consulting", "Finance"], "colors": {"primary": "#283e35", "background": "#ffffff", "text": "#242b30", "secondaryText": "#52606a", "border": "#e2e6e5"}, "fonts": {"heading": "font-serif", "body": "font-sans"}, "styles": {"headingStyle": "underlined", "spacing": "relaxed", "roundedPhoto": false}},
{"id": "launch", "name": "Launch", "category": "Minimalist", "description": "A clean, approachable foundation for internships, projects, and your first role.", "layout": "single-column", "supportsPhoto": false, "featured": true, "recommendedFor": ["Students & graduates", "Internships"], "colors": {"primary": "#245c50", "background": "#ffffff", "text": "#242b30", "secondaryText": "#52606a", "border": "#e2e6e5"}, "fonts": {"heading": "font-sans", "body": "font-sans"}, "styles": {"headingStyle": "underlined", "spacing": "normal", "roundedPhoto": false}},
{"id": "pivot", "name": "Pivot", "category": "Professional", "description": "Clear headings bring transferable skills and a new career direction into focus.", "layout": "single-column", "supportsPhoto": false, "featured": true, "recommendedFor": ["Career change", "Operations"], "colors": {"primary": "#623f55", "background": "#ffffff", "text": "#242b30", "secondaryText": "#52606a", "border": "#e2e6e5"}, "fonts": {"heading": "font-sans", "body": "font-sans"}, "styles": {"headingStyle": "uppercase", "spacing": "normal", "roundedPhoto": false}},
{"id": "folio", "name": "Folio", "category": "Creative", "description": "An editorial two-column composition for design, brand, and creative careers.", "layout": "two-column-right", "supportsPhoto": false, "featured": true, "recommendedFor": ["Design", "Marketing"], "colors": {"primary": "#a44e32", "background": "#ffffff", "text": "#242b30", "secondaryText": "#52606a", "border": "#e2e6e5"}, "fonts": {"heading": "font-serif", "body": "font-sans"}, "styles": {"headingStyle": "underlined", "spacing": "relaxed", "roundedPhoto": false}},
{"id": "blueprint", "name": "Blueprint", "category": "Modern", "description": "A crisp split header with confident blue accents for product and business roles.", "layout": "split-header", "supportsPhoto": false, "featured": true, "recommendedFor": ["Product management", "Business"], "colors": {"primary": "#264bb0", "background": "#ffffff", "text": "#242b30", "secondaryText": "#52606a", "border": "#e2e6e5"}, "fonts": {"heading": "font-sans", "body": "font-sans"}, "styles": {"headingStyle": "uppercase", "spacing": "normal", "roundedPhoto": false}},
  // ─── Existing templates (no photo) ───────────────────────────────────────
  {
    id: "onyx",
    name: "Onyx",
    category: "Professional",
    description: "A dark and striking split-header design for a bold impression.",
    layout: 'split-header',
    supportsPhoto: false,
    colors: { primary: '#18181b', background: '#ffffff', text: '#27272a', secondaryText: '#52525b', border: '#e4e4e7' },
    fonts: { heading: 'font-sans', body: 'font-sans' },
    styles: { headingStyle: 'underlined', spacing: 'normal', roundedPhoto: false }
  },
  {
    id: "diamond",
    name: "Diamond",
    category: "Modern",
    description: "Crystal clear and structured with an elegant two-column layout.",
    layout: 'two-column-left',
    supportsPhoto: false,
    colors: { primary: '#0ea5e9', background: '#ffffff', text: '#1e293b', secondaryText: '#475569', border: '#f1f5f9' },
    fonts: { heading: 'font-sans', body: 'font-sans' },
    styles: { headingStyle: 'uppercase', spacing: 'relaxed', roundedPhoto: true }
  },
  {
    id: "ruby",
    name: "Ruby",
    category: "Creative",
    description: "Vibrant accents and solid heading backgrounds for standout resumes.",
    layout: 'single-column',
    supportsPhoto: false,
    colors: { primary: '#e11d48', background: '#ffffff', text: '#1f2937', secondaryText: '#4b5563', border: '#ffe4e6' },
    fonts: { heading: 'font-serif', body: 'font-sans' },
    styles: { headingStyle: 'solid-bg', spacing: 'compact', roundedPhoto: false }
  },
  {
    id: "sapphire",
    name: "Sapphire",
    category: "Professional",
    description: "Deep, trustworthy blues in a perfectly balanced centered layout.",
    layout: 'centered',
    supportsPhoto: false,
    colors: { primary: '#1e3a8a', background: '#ffffff', text: '#334155', secondaryText: '#64748b', border: '#e2e8f0' },
    fonts: { heading: 'font-serif', body: 'font-serif' },
    styles: { headingStyle: 'underlined', spacing: 'normal', roundedPhoto: true }
  },
  {
    id: "emerald",
    name: "Emerald",
    category: "Modern",
    description: "Fresh, airy right-column layout emphasizing whitespace and clarity.",
    layout: 'two-column-right',
    supportsPhoto: false,
    colors: { primary: '#059669', background: '#ffffff', text: '#064e3b', secondaryText: '#047857', border: '#d1fae5' },
    fonts: { heading: 'font-sans', body: 'font-sans' },
    styles: { headingStyle: 'default', spacing: 'relaxed', roundedPhoto: true }
  },
  {
    id: "topaz",
    name: "Topaz",
    category: "Creative",
    description: "Warm, inviting design with crisp uppercase typography.",
    layout: 'single-column',
    supportsPhoto: false,
    colors: { primary: '#d97706', background: '#ffffff', text: '#292524', secondaryText: '#57534e', border: '#fef3c7' },
    fonts: { heading: 'font-sans', body: 'font-sans' },
    styles: { headingStyle: 'uppercase', spacing: 'compact', roundedPhoto: false }
  },
  {
    id: "amethyst",
    name: "Amethyst",
    category: "Creative",
    description: "Sophisticated split-column aesthetic with rich, deep purples.",
    layout: 'two-column-left',
    supportsPhoto: false,
    colors: { primary: '#7c3aed', background: '#ffffff', text: '#4c1d95', secondaryText: '#5b21b6', border: '#f3e8ff' },
    fonts: { heading: 'font-sans', body: 'font-sans' },
    styles: { headingStyle: 'solid-bg', spacing: 'normal', roundedPhoto: true }
  },
  {
    id: "quartz",
    name: "Quartz",
    category: "Minimalist",
    description: "Pure, minimal layout focusing exclusively on the content.",
    layout: 'single-column',
    supportsPhoto: false,
    colors: { primary: '#52525b', background: '#ffffff', text: '#18181b', secondaryText: '#3f3f46', border: '#e4e4e7' },
    fonts: { heading: 'font-mono', body: 'font-sans' },
    styles: { headingStyle: 'underlined', spacing: 'relaxed', roundedPhoto: false }
  },

  // ─── Photo Templates ───────────────────────────────────────────────────
  {
    id: "portrait",
    name: "Portrait",
    category: "Photo",
    description: "Dark sidebar with a large circular photo and bright contact details.",
    layout: 'photo-sidebar',
    supportsPhoto: true,
    colors: { primary: '#1e293b', background: '#ffffff', text: '#1e293b', secondaryText: '#64748b', border: '#f8fafc' },
    fonts: { heading: 'font-sans', body: 'font-sans' },
    styles: { headingStyle: 'default', spacing: 'normal', roundedPhoto: true }
  },
  {
    id: "lumiere",
    name: "Lumiere",
    category: "Photo",
    description: "Elegant French-inspired banner layout with a circular portrait photo.",
    layout: 'photo-banner',
    supportsPhoto: true,
    colors: { primary: '#b45309', background: '#ffffff', text: '#1c1917', secondaryText: '#57534e', border: '#fef3c7' },
    fonts: { heading: 'font-serif', body: 'font-sans' },
    styles: { headingStyle: 'underlined', spacing: 'relaxed', roundedPhoto: true }
  },
  {
    id: "herald",
    name: "Herald",
    category: "Photo",
    description: "Bold teal sidebar with a large square photo and clean white main content.",
    layout: 'photo-sidebar',
    supportsPhoto: true,
    colors: { primary: '#0d9488', background: '#ffffff', text: '#134e4a', secondaryText: '#6b7280', border: '#f0fdfa' },
    fonts: { heading: 'font-sans', body: 'font-sans' },
    styles: { headingStyle: 'uppercase', spacing: 'normal', roundedPhoto: false }
  },
  {
    id: "vogue",
    name: "Vogue",
    category: "Photo",
    description: "Fashion-forward top-right photo placement with bold serif name typography.",
    layout: 'photo-top-right',
    supportsPhoto: true,
    colors: { primary: '#be123c', background: '#ffffff', text: '#1f2937', secondaryText: '#6b7280', border: '#fff1f2' },
    fonts: { heading: 'font-serif', body: 'font-sans' },
    styles: { headingStyle: 'solid-bg', spacing: 'compact', roundedPhoto: false }
  },
  {
    id: "nova",
    name: "Nova",
    category: "Photo",
    description: "Modern card-style header with a circular photo, gradient accent, and clean body.",
    layout: 'photo-card',
    supportsPhoto: true,
    colors: { primary: '#4f46e5', background: '#ffffff', text: '#1e1b4b', secondaryText: '#6b7280', border: '#eef2ff' },
    fonts: { heading: 'font-sans', body: 'font-sans' },
    styles: { headingStyle: 'underlined', spacing: 'normal', roundedPhoto: true }
  },
  {
    id: "atelier",
    name: "Atelier",
    category: "Photo",
    description: "Luxe rose-gold palette with an elegant centered photo and refined typography.",
    layout: 'photo-elegant',
    supportsPhoto: true,
    colors: { primary: '#9f1239', background: '#fffbf7', text: '#1c1917', secondaryText: '#78716c', border: '#fce7f3' },
    fonts: { heading: 'font-serif', body: 'font-sans' },
    styles: { headingStyle: 'underlined', spacing: 'relaxed', roundedPhoto: true }
  },
  {
    id: "split-yellow",
    name: "Golden Split",
    category: "Photo",
    description: "Strong two-part design with a golden top header and dark divided content area.",
    layout: 'photo-split-yellow',
    supportsPhoto: true,
    colors: { primary: '#facc15', background: '#27272a', text: '#f4f4f5', secondaryText: '#a1a1aa', border: '#3f3f46' },
    fonts: { heading: 'font-sans', body: 'font-sans' },
    styles: { headingStyle: 'uppercase', spacing: 'relaxed', roundedPhoto: true }
  },
  {
    id: "pink-border",
    name: "Blush Border",
    category: "Photo",
    description: "Elegant layout wrapped in a soft pink border with a photo on the left.",
    layout: 'photo-pink-border',
    supportsPhoto: true,
    colors: { primary: '#be185d', background: '#ffffff', text: '#1f2937', secondaryText: '#4b5563', border: '#fce7f3' },
    fonts: { heading: 'font-serif', body: 'font-sans' },
    styles: { headingStyle: 'underlined', spacing: 'relaxed', roundedPhoto: false }
  },
  {
    id: "dark-modern",
    name: "Midnight Modern",
    category: "Photo",
    description: "High-contrast dark sidebar for photo and skills, with a clean white main column.",
    layout: 'photo-dark-modern',
    supportsPhoto: true,
    colors: { primary: '#000000', background: '#ffffff', text: '#171717', secondaryText: '#52525b', border: '#262626' },
    fonts: { heading: 'font-sans', body: 'font-sans' },
    styles: { headingStyle: 'solid-bg', spacing: 'normal', roundedPhoto: false }
  },
  {
    id: "overlap-green",
    name: "Forest Overlap",
    category: "Photo",
    description: "Creative beige and dark green split with a distinct overlapping summary box.",
    layout: 'photo-overlap-green',
    supportsPhoto: true,
    colors: { primary: '#064e3b', background: '#f5f5f4', text: '#292524', secondaryText: '#57534e', border: '#a8a29e' },
    fonts: { heading: 'font-sans', body: 'font-sans' },
    styles: { headingStyle: 'default', spacing: 'normal', roundedPhoto: true }
  },
  {
    id: "dark-bubbles",
    name: "Neon Bubbles",
    category: "Photo",
    description: "Dark canvas accented by glowing gradient bubbles for a vibrant creative look.",
    layout: 'photo-dark-bubbles',
    supportsPhoto: true,
    colors: { primary: '#f97316', background: '#09090b', text: '#fafafa', secondaryText: '#a1a1aa', border: '#27272a' },
    fonts: { heading: 'font-sans', body: 'font-sans' },
    styles: { headingStyle: 'underlined', spacing: 'relaxed', roundedPhoto: false }
  },
];

export function getTemplateConfig(id: string): TemplateConfig {
  return templates.find(t => t.id === id) || templates.find(t => t.id === "onyx")!;
}
