import React, { useEffect } from 'react';
import { View, StyleSheet, BackHandler, LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from './constants/colors';
import { WelcomeScreen } from './app/welcome';
import { LoginScreen } from './app/login';
import { SignupScreen } from './app/signup';
import {
  NavigationProvider,
  useNavigation,
} from './context/NavigationContext';

// Ignore deprecation warning if triggered by internal dev tooling
LogBox.ignoreLogs(['SafeAreaView has been deprecated']);

function AppContent() {
  const { currentScreen, goBack, canGoBack } = useNavigation();

  // Android hardware back button handler
  useEffect(() => {
    const onBackPress = () => {
      if (canGoBack) {
        goBack();
        return true;
      }
      return false;
    };

    const backHandlerSubscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );

    return () => backHandlerSubscription.remove();
  }, [canGoBack, goBack]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {currentScreen === 'welcome' && <WelcomeScreen />}
      {currentScreen === 'login' && <LoginScreen />}
      {currentScreen === 'signup' && <SignupScreen />}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationProvider initialScreen="welcome">
        <AppContent />
      </NavigationProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
});
