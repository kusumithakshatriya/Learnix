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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { spacing, borderRadius, typography } from '../constants/spacing';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ErrorMessage } from '../components/ErrorMessage';
import { useNavigation } from '../context/NavigationContext';
import { api } from '../services/api';

export interface SignupScreenProps {
  onNavigateToLogin?: () => void;
  onNavigateBack?: () => void;
  onSignupSuccess?: (user: any) => void;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({
  onNavigateToLogin,
  onNavigateBack,
  onSignupSuccess,
}) => {
  const { navigate, goBack } = useNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccessMessage, setSignupSuccessMessage] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    setGeneralError(null);
    setSignupSuccessMessage(null);

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    try {
      // Calls the placeholder API client
      const response = await api.auth.signup({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      setSignupSuccessMessage('Account created successfully! (Placeholder mode)');
      if (onSignupSuccess && response.data) {
        onSignupSuccess(response.data.user);
      }
    } catch (err: any) {
      setGeneralError(err.message || 'Unable to create account. Please try again.');
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

  const handleGoToLogin = () => {
    if (onNavigateToLogin) {
      onNavigateToLogin();
    } else {
      navigate('login');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background.secondary} />
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Bar with Back Button */}
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Go back to welcome screen"
            >
              <Text style={styles.backButtonArrow}>←</Text>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join Learnix to accelerate your studies, master skills, and achieve career goals.
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {generalError ? (
              <ErrorMessage
                message={generalError}
                onDismiss={() => setGeneralError(null)}
              />
            ) : null}

            {signupSuccessMessage ? (
              <View style={styles.successBox}>
                <Text style={styles.successText}>{signupSuccessMessage}</Text>
              </View>
            ) : null}

            <Input
              label="Full Name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="Alex Johnson"
              autoCapitalize="words"
              error={errors.name}
              testID="signup-name-input"
            />

            <Input
              label="Email Address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              placeholder="alex@university.edu"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              testID="signup-email-input"
            />

            <Input
              label="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              placeholder="Create a strong password (6+ chars)"
              secureTextEntry
              error={errors.password}
              testID="signup-password-input"
            />

            <Input
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) {
                  setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }
              }}
              placeholder="Re-enter your password"
              secureTextEntry
              error={errors.confirmPassword}
              testID="signup-confirm-password-input"
            />

            <Button
              title="Create Account"
              onPress={handleSignup}
              variant="primary"
              size="large"
              loading={isLoading}
              style={styles.signupButton}
              testID="signup-submit-button"
            />
          </View>

          {/* Footer Link to Login */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity
              onPress={handleGoToLogin}
              accessibilityRole="button"
              accessibilityLabel="Navigate to login screen"
            >
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingRight: spacing.md,
  },
  backButtonArrow: {
    fontSize: 20,
    color: colors.primary.main,
    marginRight: spacing.xs,
  },
  backButtonText: {
    fontSize: typography.fontSizes.body,
    color: colors.primary.main,
    fontWeight: typography.fontWeights.medium,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSizes.h1,
    lineHeight: typography.lineHeights.h1,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary.darkest,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSizes.body,
    lineHeight: typography.lineHeights.body,
    color: colors.text.secondary,
  },
  card: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  signupButton: {
    marginTop: spacing.sm,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
  },
  footerText: {
    fontSize: typography.fontSizes.sm,
    color: colors.text.secondary,
  },
  loginLink: {
    fontSize: typography.fontSizes.sm,
    color: colors.accent.dark,
    fontWeight: typography.fontWeights.bold,
    textDecorationLine: 'underline',
  },
});

export default SignupScreen;
