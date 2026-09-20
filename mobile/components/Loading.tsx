import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { colors } from '../constants/colors';
import { spacing, typography } from '../constants/spacing';

export interface LoadingProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
  fullScreen?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'Loading...',
  size = 'large',
  color = colors.primary.main,
  fullScreen = false,
  style,
}) => {
  return (
    <View
      style={[
        styles.container,
        fullScreen && styles.fullScreenContainer,
        style,
      ]}
      accessibilityRole="progressbar"
      accessibilityLabel={message}
    >
      <ActivityIndicator size={size} color={color} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreenContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    zIndex: 999,
  },
  message: {
    marginTop: spacing.md,
    fontSize: typography.fontSizes.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeights.medium,
    textAlign: 'center',
  },
});

export default Loading;
