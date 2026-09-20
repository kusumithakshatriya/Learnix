import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { spacing, borderRadius, typography } from '../constants/spacing';
import { theme } from '../constants/theme';
import { Button } from '../components/Button';
import { useNavigation } from '../context/NavigationContext';

export interface WelcomeScreenProps {
  onGetStarted?: () => void;
  onLogin?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGetStarted,
  onLogin,
}) => {
  const { navigate } = useNavigation();

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    } else {
      navigate('signup');
    }
  };

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    } else {
      navigate('login');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background.secondary} />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Top Decorative / Brand Badge */}
        <View style={styles.headerArea}>
          <View style={[styles.logoPlaceholder, theme.shadows.md]}>
            <View style={styles.logoInner}>
              <Text style={styles.logoSymbol}>LX</Text>
            </View>
            <View style={styles.logoAccentDot} />
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Next-Gen Learning</Text>
          </View>
        </View>

        {/* Hero Typography */}
        <View style={styles.heroArea}>
          <Text style={styles.brandTitle}>LEARNIX</Text>
          <Text style={styles.tagline}>Learn. Grow. Become.</Text>
          <Text style={styles.subtitle}>
            Your personalized AI-driven learning and career platform. Master in-demand
            skills, track real milestones, and unlock high-impact opportunities.
          </Text>
        </View>

        {/* Feature Highlights / Value Props */}
        <View style={styles.featuresContainer}>
          <View style={styles.featurePill}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>Adaptive Learning Paths</Text>
          </View>
          <View style={styles.featurePill}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>Verified Career Milestones</Text>
          </View>
          <View style={styles.featurePill}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>Student-First Mentorship</Text>
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.actionsContainer}>
          <Button
            title="Get Started"
            onPress={handleGetStarted}
            variant="primary"
            size="large"
            accessibilityLabel="Get Started with Learnix"
            style={styles.primaryButton}
          />

          <View style={styles.loginRow}>
            <Text style={styles.loginQuestion}>Already have an account? </Text>
            <Button
              title="Log In"
              onPress={handleLogin}
              variant="ghost"
              size="small"
              fullWidth={false}
              accessibilityLabel="Log in to existing Learnix account"
              textStyle={styles.loginLinkText}
              style={styles.loginLinkButton}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  headerArea: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  logoPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 24,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: colors.accent.main,
  },
  logoInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoSymbol: {
    color: colors.text.inverse,
    fontSize: 34,
    fontWeight: typography.fontWeights.extraBold,
    letterSpacing: 2,
  },
  logoAccentDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent.main,
  },
  badge: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.accent.subtle,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.accent.light,
  },
  badgeText: {
    color: colors.accent.goldText,
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  heroArea: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  brandTitle: {
    fontSize: typography.fontSizes.hero,
    lineHeight: typography.lineHeights.hero,
    fontWeight: typography.fontWeights.extraBold,
    color: colors.primary.darkest,
    letterSpacing: 2.5,
    textAlign: 'center',
  },
  tagline: {
    fontSize: typography.fontSizes.title,
    lineHeight: typography.lineHeights.title,
    fontWeight: typography.fontWeights.bold,
    color: colors.accent.dark,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSizes.body,
    lineHeight: typography.lineHeights.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  featuresContainer: {
    alignItems: 'center',
    marginVertical: spacing.sm,
    gap: spacing.sm,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent.main,
    marginRight: spacing.sm,
  },
  featureText: {
    fontSize: typography.fontSizes.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeights.medium,
  },
  actionsContainer: {
    width: '100%',
    marginTop: spacing.xl,
    paddingBottom: spacing.sm,
  },
  primaryButton: {
    marginBottom: spacing.md,
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  loginQuestion: {
    fontSize: typography.fontSizes.sm,
    color: colors.text.secondary,
  },
  loginLinkButton: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    minHeight: 0,
  },
  loginLinkText: {
    color: colors.accent.dark,
    fontWeight: typography.fontWeights.bold,
    fontSize: typography.fontSizes.sm,
    textDecorationLine: 'underline',
  },
});

export default WelcomeScreen;
