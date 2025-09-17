import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './navigation/RootNavigator';
import './global.css';
import { ThemeProvider, useThemeScheme } from './context/ThemeContext';
import { View } from 'react-native';

function AppShell() {
  const { scheme } = useThemeScheme();
  const isDark = scheme === 'dark';
  return (
    <View className={isDark ? 'flex-1 bg-background-dark' : 'flex-1 bg-background'}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}