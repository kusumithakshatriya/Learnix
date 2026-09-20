/**
 * Learnix Centralized Theme
 * Unifies colors, spacing, borderRadius, typography, and shadow elevations.
 */

import { colors } from './colors';
import { spacing, borderRadius, typography } from './spacing';

export const theme = {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows: {
    sm: {
      shadowColor: colors.primary.darkest,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowColor: colors.primary.darkest,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },
    lg: {
      shadowColor: colors.primary.darkest,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.14,
      shadowRadius: 12,
      elevation: 8,
    },
    gold: {
      shadowColor: colors.accent.main,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 6,
    },
  },
} as const;

export type Theme = typeof theme;
export default theme;
