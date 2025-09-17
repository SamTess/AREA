import React from 'react';
import { Pressable, Text } from 'react-native';
import { useThemeScheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { scheme, toggle } = useThemeScheme();
  const isDark = scheme === 'dark';
  return (
    <Pressable
      onPress={toggle}
      accessibilityRole="button"
      accessibilityLabel="Toggle color scheme"
      className={`px-3 py-2 rounded-md mt-4 self-end ${isDark ? 'bg-primary/60' : 'bg-primary/80'}`}
    >
      <Text className="text-white font-semibold">{isDark ? 'Light' : 'Dark'} Mode</Text>
    </Pressable>
  );
}
