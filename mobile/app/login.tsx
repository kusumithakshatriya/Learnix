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
  const { navigate, goBack } = useNavigation();

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

          {/* Header Title */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to continue your personalized learning journey with Learnix.
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

            {loginSuccessMessage ? (
              <View style={styles.successBox}>
                <Text style={styles.successText}>{loginSuccessMessage}</Text>
              </View>
            ) : null}

            <Input
              label="Email Address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              placeholder="student@university.edu"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              testID="login-email-input"
            />

            <Input
              label="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              placeholder="Enter your password"
              secureTextEntry
              error={errors.password}
              testID="login-password-input"
            />

            <Button
              title="Log In"
              onPress={handleLogin}
              variant="primary"
              size="large"
              loading={isLoading}
              style={styles.loginButton}
              testID="login-submit-button"
            />
          </View>

          {/* Footer Link to Signup */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account yet? </Text>
            <TouchableOpacity
              onPress={handleGoToSignup}
              accessibilityRole="button"
              accessibilityLabel="Navigate to signup screen"
            >
              <Text style={styles.signupLink}>Sign Up</Text>
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
    marginBottom: spacing.xl,
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
  loginButton: {
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
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
  },
  footerText: {
    fontSize: typography.fontSizes.sm,
    color: colors.text.secondary,
  },
  signupLink: {
    fontSize: typography.fontSizes.sm,
    color: colors.accent.dark,
    fontWeight: typography.fontWeights.bold,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
