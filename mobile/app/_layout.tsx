import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationProvider } from '../context/NavigationContext';
import { colors } from '../constants/colors';

export interface LayoutProps {
  children?: React.ReactNode;
}

export const RootLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SafeAreaProvider>
      <NavigationProvider initialScreen="welcome">
        <View style={styles.container}>{children}</View>
      </NavigationProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
});

export default RootLayout;
