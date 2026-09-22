import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
  View,
} from 'react-native';
import { colors } from '../constants/colors';
import { spacing, borderRadius, typography } from '../constants/spacing';
import { theme } from '../constants/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'indigo' | 'social';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  fullRounded?: boolean;
  testID?: string;
  accessibilityLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  fullWidth = true,
  fullRounded = false,
  testID,
  accessibilityLabel,
}) => {
  const isInteractive = !disabled && !loading;

  return (
    <TouchableOpacity
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: !isInteractive, busy: loading }}
      activeOpacity={0.75}
      onPress={isInteractive ? onPress : undefined}
      disabled={!isInteractive}
      style={[
        styles.base,
        sizeStyles[size],
        variantStyles[variant].container,
        fullWidth && styles.fullWidth,
        fullRounded && styles.fullRounded,
        disabled && styles.disabledContainer,
        variant === 'primary' && !disabled && theme.shadows.sm,
        variant === 'secondary' && !disabled && theme.shadows.gold,
        variant === 'indigo' && !disabled && theme.shadows.md,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variantStyles[variant].spinnerColor}
        />
      ) : (
        <View style={styles.contentRow}>
          {leftIcon && <View style={styles.leftIconWrapper}>{leftIcon}</View>}
          <Text
            style={[
              styles.baseText,
              textSizeStyles[size],
              variantStyles[variant].text,
              disabled && styles.disabledText,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightIcon && <View style={styles.rightIconWrapper}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  fullRounded: {
    borderRadius: borderRadius.full,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIconWrapper: {
    marginRight: spacing.sm,
  },
  rightIconWrapper: {
    marginLeft: spacing.sm,
  },
  baseText: {
    fontWeight: typography.fontWeights.semibold,
    textAlign: 'center',
  },
  disabledContainer: {
    backgroundColor: colors.background.tertiary,
    borderColor: colors.border.light,
    elevation: 0,
    shadowOpacity: 0,
  },
  disabledText: {
    color: colors.text.subtle,
  },
});

const sizeStyles = StyleSheet.create({
  small: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    minHeight: 36,
  },
  medium: {
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
  },
  large: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 56,
  },
});

const textSizeStyles = StyleSheet.create({
  small: {
    fontSize: typography.fontSizes.sm,
    lineHeight: typography.lineHeights.sm,
  },
  medium: {
    fontSize: typography.fontSizes.body,
    lineHeight: typography.lineHeights.body,
  },
  large: {
    fontSize: typography.fontSizes.subhead,
    lineHeight: typography.lineHeights.subhead,
    fontWeight: typography.fontWeights.bold,
  },
});

const variantStyles: Record<
  ButtonVariant,
  {
    container: ViewStyle;
    text: TextStyle;
    spinnerColor: string;
  }
> = {
  primary: {
    container: {
      backgroundColor: colors.primary.main,
      borderWidth: 1,
      borderColor: colors.primary.main,
    },
    text: {
      color: colors.text.inverse,
    },
    spinnerColor: colors.text.inverse,
  },
  secondary: {
    container: {
      backgroundColor: colors.accent.main,
      borderWidth: 1,
      borderColor: colors.accent.dark,
    },
    text: {
      color: colors.primary.darkest,
      fontWeight: typography.fontWeights.bold,
    },
    spinnerColor: colors.primary.darkest,
  },
  outline: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.primary.main,
    },
    text: {
      color: colors.primary.main,
    },
    spinnerColor: colors.primary.main,
  },
  ghost: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    text: {
      color: colors.primary.main,
    },
    spinnerColor: colors.primary.main,
  },
  indigo: {
    container: {
      backgroundColor: colors.auth.indigo,
      borderWidth: 1,
      borderColor: colors.auth.indigoDark,
    },
    text: {
      color: colors.text.inverse,
      fontWeight: typography.fontWeights.bold,
    },
    spinnerColor: colors.text.inverse,
  },
  social: {
    container: {
      backgroundColor: colors.background.primary,
      borderWidth: 1.5,
      borderColor: colors.border.light,
    },
    text: {
      color: colors.text.primary,
      fontWeight: typography.fontWeights.semibold,
    },
    spinnerColor: colors.primary.main,
  },
};

export default Button;
