import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { colors } from '../constants/colors';
import { spacing, borderRadius, typography } from '../constants/spacing';

export interface ErrorMessageProps {
  message?: string | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  variant?: 'banner' | 'inline';
  style?: StyleProp<ViewStyle>;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  onDismiss,
  variant = 'banner',
  style,
}) => {
  if (!message) return null;

  return (
    <View
      accessibilityRole="alert"
      style={[
        variant === 'banner' ? styles.bannerContainer : styles.inlineContainer,
        style,
      ]}
    >
      <View style={styles.contentRow}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>!</Text>
        </View>
        <Text style={styles.messageText}>{message}</Text>
        {onDismiss && (
          <TouchableOpacity
            onPress={onDismiss}
            accessibilityRole="button"
            accessibilityLabel="Dismiss error"
            style={styles.dismissButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.dismissText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel="Retry action"
          style={styles.retryButton}
        >
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: colors.status.errorLight,
    borderColor: colors.status.error,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginVertical: spacing.sm,
    width: '100%',
  },
  inlineContainer: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
    width: '100%',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.status.error,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  iconText: {
    color: colors.text.inverse,
    fontSize: 12,
    fontWeight: typography.fontWeights.bold,
    lineHeight: 14,
  },
  messageText: {
    flex: 1,
    fontSize: typography.fontSizes.sm,
    color: '#991B1B', // Dark red for strong contrast
    fontWeight: typography.fontWeights.medium,
    lineHeight: typography.lineHeights.sm,
  },
  dismissButton: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
  dismissText: {
    fontSize: typography.fontSizes.caption,
    color: colors.text.muted,
    fontWeight: typography.fontWeights.bold,
  },
  retryButton: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.xs,
    borderWidth: 1,
    borderColor: colors.status.error,
  },
  retryText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.semibold,
    color: colors.status.error,
  },
});

export default ErrorMessage;
