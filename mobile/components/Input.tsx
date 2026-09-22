import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardTypeOptions,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '../constants/colors';
import { spacing, borderRadius, typography } from '../constants/spacing';
import { EyeIcon } from './AuthIcons';

export interface InputProps {
  label?: string;
  labelRight?: React.ReactNode;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  showEyeIcon?: boolean;
  error?: string;
  helperText?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  labelRight,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  showEyeIcon = false,
  error,
  helperText,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  inputStyle,
  inputContainerStyle,
  testID,
  accessibilityLabel,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const hasError = !!error;
  const isSecure = secureTextEntry && !isPasswordVisible;

  return (
    <View style={[styles.container, style]}>
      {(label || labelRight) && (
        <View style={styles.labelRow}>
          {label ? (
            <Text style={[styles.label, hasError && styles.labelError]}>
              {label}
            </Text>
          ) : <View />}
          {labelRight}
        </View>
      )}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          hasError && styles.inputError,
          disabled && styles.inputDisabled,
          inputContainerStyle,
        ]}
      >
        {leftIcon && <View style={styles.leftIconWrapper}>{leftIcon}</View>}

        <TextInput
          testID={testID}
          accessibilityLabel={accessibilityLabel || label || placeholder}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.subtle}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.textInput,
            disabled && styles.textDisabled,
            inputStyle,
          ]}
        />

        {secureTextEntry ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsPasswordVisible((prev) => !prev)}
            accessibilityRole="button"
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
            style={[styles.eyeToggle, showEyeIcon && styles.eyeToggleIconOnly]}
          >
            {showEyeIcon ? (
              <EyeIcon isVisible={isPasswordVisible} color={colors.text.secondary} />
            ) : (
              <Text style={styles.eyeToggleText}>
                {isPasswordVisible ? 'Hide' : 'Show'}
              </Text>
            )}
          </TouchableOpacity>
        ) : (
          rightIcon && <View style={styles.rightIconWrapper}>{rightIcon}</View>
        )}
      </View>

      {hasError ? (
        <Text style={styles.errorText} accessibilityRole="alert">
          {error}
        </Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs + 2,
  },
  label: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.secondary,
  },
  labelError: {
    color: colors.status.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    borderWidth: 1.5,
    borderColor: colors.border.light,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    minHeight: 50,
  },
  inputFocused: {
    borderColor: colors.primary.main,
    backgroundColor: colors.background.primary,
  },
  inputError: {
    borderColor: colors.status.error,
    backgroundColor: '#FFF8F8',
  },
  inputDisabled: {
    backgroundColor: colors.background.tertiary,
    borderColor: colors.border.light,
  },
  textInput: {
    flex: 1,
    fontSize: typography.fontSizes.body,
    color: colors.text.primary,
    paddingVertical: spacing.sm + 2,
  },
  textDisabled: {
    color: colors.text.subtle,
  },
  leftIconWrapper: {
    marginRight: spacing.sm,
  },
  rightIconWrapper: {
    marginLeft: spacing.sm,
  },
  eyeToggle: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.xs,
  },
  eyeToggleIconOnly: {
    backgroundColor: 'transparent',
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  eyeToggleText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.secondary,
  },
  errorText: {
    fontSize: typography.fontSizes.caption,
    color: colors.status.error,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
  helperText: {
    fontSize: typography.fontSizes.caption,
    color: colors.text.muted,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});

export default Input;
