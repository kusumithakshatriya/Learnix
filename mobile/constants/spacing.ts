/**
 * Learnix Spacing & Typography Scales
 */

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const typography = {
  fontSizes: {
    xs: 11,
    caption: 12,
    sm: 14,
    body: 16,
    subhead: 18,
    title: 22,
    h2: 26,
    h1: 32,
    hero: 40,
  },
  lineHeights: {
    xs: 14,
    caption: 16,
    sm: 20,
    body: 24,
    subhead: 26,
    title: 30,
    h2: 34,
    h1: 40,
    hero: 48,
  },
  fontWeights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extraBold: '800' as const,
  },
} as const;

export type SpacingType = typeof spacing;
export type BorderRadiusType = typeof borderRadius;
export type TypographyType = typeof typography;
