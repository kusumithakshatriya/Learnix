/**
 * Learnix Color Palette
 * Visual Identity:
 * - Primary: Deep Navy / Dark Blue
 * - Accent: Warm Gold
 * - Backgrounds: Clean White and Light Gray
 * - Semantic colors for feedback and statuses
 */

export const colors = {
  // Brand Primary (Navy)
  primary: {
    darkest: '#0A192F', // Deep midnight navy
    main: '#0F2137',    // Brand primary navy
    light: '#1E3A8A',   // Lighter navy accent
    soft: '#2A4365',    // Soft slate navy
    tint: '#EBF4FF',    // Ultra-light navy tint for highlights
  },

  // Brand Accent (Gold)
  accent: {
    main: '#F59E0B',    // Brand warm gold
    dark: '#D97706',    // Dark gold for text contrast
    light: '#FBBF24',   // Bright gold for highlights
    subtle: '#FEF3C7',  // Soft gold tint for badges / tags
    goldText: '#92400E', // High-contrast gold text
  },

  // Backgrounds
  background: {
    primary: '#FFFFFF',   // Pure white for cards, inputs, surfaces
    secondary: '#F8FAFC', // Slate 50 for page backgrounds
    tertiary: '#F1F5F9',  // Slate 100 for secondary cards / chips
    overlay: 'rgba(10, 25, 47, 0.4)', // Dim overlay for modals
  },

  // Text Colors
  text: {
    primary: '#0F172A',   // Slate 900 - Headings & primary body
    secondary: '#334155', // Slate 700 - Subtitles & descriptive text
    muted: '#64748B',     // Slate 500 - Labels, hints, placeholders
    subtle: '#94A3B8',    // Slate 400 - Disabled / subtle hints
    inverse: '#FFFFFF',   // White text on dark backgrounds
    accent: '#D97706',    // Gold text
  },

  // Borders & Dividers
  border: {
    light: '#E2E8F0',     // Default card & input borders
    medium: '#CBD5E1',    // Hover & emphasized borders
    focus: '#0F2137',     // Active input border
    goldFocus: '#F59E0B', // Accent input border
    divider: '#EDF2F7',   // Subtle divider lines
  },

  // Semantic Status Colors
  status: {
    success: '#10B981',
    successLight: '#D1FAE5',
    error: '#EF4444',
    errorLight: '#FEE2E2',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    info: '#3B82F6',
    infoLight: '#DBEAFE',
  },

  // Auth Accent (Modern Purple / Indigo & Lavender for Authentication UI)
  auth: {
    indigo: '#5146E5',
    indigoDark: '#4338CA',
    indigoLight: '#6366F1',
    lavender: '#F4F3FF',
    lavenderLight: '#F8F7FF',
    lavenderBorder: '#E0E0FC',
    segmentBg: '#ECEBFA',
    charcoalBg: '#0A192F',
  },
} as const;

export type ColorsType = typeof colors;
