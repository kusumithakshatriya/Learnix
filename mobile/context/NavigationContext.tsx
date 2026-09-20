import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ScreenName = 'welcome' | 'login' | 'signup';

export interface NavigationContextType {
  currentScreen: ScreenName;
  navigate: (screen: ScreenName) => void;
  goBack: () => void;
  canGoBack: boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export interface NavigationProviderProps {
  children: ReactNode;
  initialScreen?: ScreenName;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
  initialScreen = 'welcome',
}) => {
  const [history, setHistory] = useState<ScreenName[]>([initialScreen]);

  const currentScreen = history[history.length - 1] || 'welcome';
  const canGoBack = history.length > 1;

  const navigate = (screen: ScreenName) => {
    setHistory((prev) => [...prev, screen]);
  };

  const goBack = () => {
    setHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  return (
    <NavigationContext.Provider
      value={{
        currentScreen,
        navigate,
        goBack,
        canGoBack,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    // Fallback safe dummy navigation if rendered outside provider
    return {
      currentScreen: 'welcome',
      navigate: () => {},
      goBack: () => {},
      canGoBack: false,
    };
  }
  return context;
};

export default NavigationContext;
