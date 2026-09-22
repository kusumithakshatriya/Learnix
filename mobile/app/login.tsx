import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { spacing, borderRadius, typography } from '../constants/spacing';
import { theme } from '../constants/theme';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ErrorMessage } from '../components/ErrorMessage';
import {
  MailIcon,
  LockIcon,
  ArrowRightIcon,
  GoogleIcon,
  AppleIcon,
  ShieldIcon,
} from '../components/AuthIcons';
import { useNavigation } from '../context/NavigationContext';
import { api } from '../services/api';

export interface LoginScreenProps {
  onNavigateToSignup?: () => void;
  onNavigateBack?: () => void;
  onLoginSuccess?: (user: any) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onNavigateToSignup,
  onNavigateBack,
  onLoginSuccess,
}) => {
  const { navigate, goBack, canGoBack } = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccessMessage, setLoginSuccessMessage] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    setGeneralError(null);
    setLoginSuccessMessage(null);

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    try {
      // Calls the placeholder API client (simulates network without real backend)
      const response = await api.auth.login({
        email: email.trim(),
        password,
      });

      setLoginSuccessMessage('Welcome back! Authentication ready (placeholder mode).');
      if (onLoginSuccess && response.data) {
        onLoginSuccess(response.data.user);
      }
    } catch (err: any) {
      setGeneralError(err.message || 'Unable to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (onNavigateBack) {
      onNavigateBack();
    } else {
      goBack();
    }
  };

  const handleGoToSignup = () => {
    if (onNavigateToSignup) {
      onNavigateToSignup();
    } else {
      navigate('signup');
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Reset Password',
      'Password reset instructions will be sent to your registered email address.',
      [{ text: 'OK' }]
    );
  };

  const handleSocialLogin = (provider: 'Google' | 'Apple') => {
    Alert.alert(
      `${provider} Sign-In`,
      `Continue with ${provider} is coming soon in the upcoming Learnix release.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.auth.charcoalBg} />
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Main Mobile Content Panel */}
          <View style={styles.panel}>
            {/* Top Navigation Back Button if applicable */}
            {(canGoBack || onNavigateBack) && (
              <View style={styles.topBar}>
                <TouchableOpacity
                  onPress={handleBack}
                  style={styles.backButton}
                  accessibilityRole="button"
                  accessibilityLabel="Go back"
                >
                  <Text style={styles.backButtonArrow}>←</Text>
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Top Brand Header Section */}
            <View style={styles.brandRow}>
              {/* Rounded-square Learnix app icon */}
              <View style={styles.appIconBadge}>
                <Text style={styles.appIconText}>LX</Text>
                <View style={styles.appIconDot} />
              </View>

              <Text style={styles.brandName}>Learnix</Text>

              {/* Small "EDU" Badge */}
              <View style={styles.eduBadge}>
                <Text style={styles.eduBadgeText}>EDU</Text>
              </View>
            </View>

            {/* Heading and Subtitle */}
            <View style={styles.headingSection}>
              <Text style={styles.mainTitle}>Welcome to Learnix</Text>
              <Text style={styles.subtitle}>Continue your learning journey with us.</Text>
            </View>

            {/* Login / Signup Segmented Control */}
            <View style={styles.segmentedControl}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.segmentTab, styles.segmentTabActive]}
                accessibilityRole="tab"
                accessibilityState={{ selected: true }}
              >
                <Text style={styles.segmentTextActive}>Log in</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleGoToSignup}
                style={styles.segmentTab}
                accessibilityRole="tab"
                accessibilityState={{ selected: false }}
              >
                <Text style={styles.segmentTextInactive}>Sign up</Text>
              </TouchableOpacity>
            </View>

            {/* Login Form Card */}
            <View style={styles.card}>
              {generalError ? (
                <ErrorMessage
                  message={generalError}
                  onDismiss={() => setGeneralError(null)}
                />
              ) : null}

              {loginSuccessMessage ? (
                <View style={styles.successBox}>
                  <Text style={styles.successText}>{loginSuccessMessage}</Text>
                </View>
              ) : null}

              {/* Email Address Input */}
              <Input
                label="Email Address"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon={<MailIcon color={colors.text.muted} size={18} />}
                error={errors.email}
                testID="login-email-input"
                inputContainerStyle={styles.inputInner}
              />

              {/* Password Input with Forgot Password link on right of label */}
              <Input
                label="Password"
                labelRight={
                  <TouchableOpacity
                    onPress={handleForgotPassword}
                    accessibilityRole="button"
                    accessibilityLabel="Forgot password?"
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={styles.forgotPasswordLink}>Forgot password?</Text>
                  </TouchableOpacity>
                }
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                placeholder="Enter your password"
                secureTextEntry
                showEyeIcon
                leftIcon={<LockIcon color={colors.text.muted} size={18} />}
                error={errors.password}
                testID="login-password-input"
                inputContainerStyle={styles.inputInner}
              />

              {/* Primary "Continue with Email" Button */}
              <Button
                title="Continue with Email"
                onPress={handleLogin}
                variant="indigo"
                size="large"
                fullRounded
                loading={isLoading}
                rightIcon={<ArrowRightIcon color="#FFFFFF" size={18} />}
                style={styles.primaryButton}
                testID="login-submit-button"
              />

              {/* Horizontal Divider with OR badge */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <View style={styles.dividerBadge}>
                  <Text style={styles.dividerText}>OR</Text>
                </View>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Login Buttons */}
              <View style={styles.socialButtonsContainer}>
                <Button
                  title="Continue with Google"
                  onPress={() => handleSocialLogin('Google')}
                  variant="social"
                  size="medium"
                  fullRounded
                  leftIcon={<GoogleIcon size={20} />}
                  style={styles.socialButton}
                  accessibilityLabel="Continue with Google"
                />

                <Button
                  title="Continue with Apple"
                  onPress={() => handleSocialLogin('Apple')}
                  variant="social"
                  size="medium"
                  fullRounded
                  leftIcon={<AppleIcon size={20} color="#000000" />}
                  style={styles.socialButton}
                  accessibilityLabel="Continue with Apple"
                />
              </View>
            </View>

            {/* Bottom Section: Don't have an account? Sign up */}
            <View style={styles.footerRow}>
              <Text style={styles.footerPrompt}>Don't have an account? </Text>
              <TouchableOpacity
                onPress={handleGoToSignup}
                accessibilityRole="button"
                accessibilityLabel="Sign up for an account"
              >
                <Text style={styles.signupHighlight}>Sign up</Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Security & Privacy Assurance */}
            <View style={styles.securityRow}>
              <ShieldIcon color={colors.text.muted} size={13} />
              <Text style={styles.securityText}>
                256-bit Secure Encryption • Learnix Student Privacy Protected
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.auth.charcoalBg,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  panel: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.auth.lavender,
    borderRadius: 28,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    ...theme.shadows.lg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingRight: spacing.sm,
  },
  backButtonArrow: {
    fontSize: 18,
    color: colors.text.secondary,
    marginRight: spacing.xs,
  },
  backButtonText: {
    fontSize: typography.fontSizes.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeights.medium,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  appIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: colors.accent.main,
  },
  appIconText: {
    color: colors.text.inverse,
    fontSize: 14,
    fontWeight: typography.fontWeights.extraBold,
    letterSpacing: 1,
  },
  appIconDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.accent.main,
  },
  brandName: {
    fontSize: typography.fontSizes.subhead,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
    letterSpacing: 0.5,
  },
  eduBadge: {
    backgroundColor: '#EEF2FF',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  eduBadgeText: {
    color: colors.auth.indigo,
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
    letterSpacing: 0.5,
  },
  headingSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  mainTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSizes.sm,
    lineHeight: typography.lineHeights.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xs,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: colors.auth.segmentBg,
    borderRadius: borderRadius.full,
    padding: 4,
    marginBottom: spacing.lg,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
  },
  segmentTabActive: {
    backgroundColor: colors.background.primary,
    ...theme.shadows.sm,
  },
  segmentTextActive: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
  },
  segmentTextInactive: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.text.muted,
  },
  card: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
    ...theme.shadows.sm,
  },
  inputInner: {
    backgroundColor: '#FAF9FF',
    borderColor: colors.border.light,
    borderRadius: borderRadius.md,
  },
  forgotPasswordLink: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.semibold,
    color: colors.auth.indigo,
  },
  primaryButton: {
    marginTop: spacing.xs,
    backgroundColor: colors.auth.indigo,
    borderColor: colors.auth.indigoDark,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.light,
  },
  dividerBadge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.light,
    marginHorizontal: spacing.sm,
  },
  dividerText: {
    fontSize: 10,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.subtle,
    letterSpacing: 0.5,
  },
  socialButtonsContainer: {
    gap: spacing.sm,
  },
  socialButton: {
    borderColor: colors.border.light,
    backgroundColor: colors.background.primary,
  },
  successBox: {
    backgroundColor: colors.status.successLight,
    borderWidth: 1,
    borderColor: colors.status.success,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  successText: {
    color: '#065F46',
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingVertical: spacing.xs,
  },
  footerPrompt: {
    fontSize: typography.fontSizes.sm,
    color: colors.text.secondary,
  },
  signupHighlight: {
    fontSize: typography.fontSizes.sm,
    color: colors.auth.indigo,
    fontWeight: typography.fontWeights.bold,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    gap: 6,
    paddingHorizontal: spacing.sm,
  },
  securityText: {
    fontSize: typography.fontSizes.xs - 1,
    color: colors.text.muted,
    textAlign: 'center',
    flexShrink: 1,
  },
});

export default LoginScreen;
