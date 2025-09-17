import React from 'react';
import { Text, Button, ScrollView, View } from 'react-native';
import ThemeToggle from '../components/ThemeToggle';
import { useThemeScheme } from '../context/ThemeContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import CatImage from '../components/CatImage';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const { scheme } = useThemeScheme();
  const isDark = scheme === 'dark';
  return (
    <ScrollView
      className={`flex-1 ${isDark ? 'bg-background-dark' : 'bg-background'}`}
      contentContainerStyle={{ alignItems: 'center' }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View className="w-full px-4">
        <ThemeToggle />
      </View>
      <Text className={`font-bold underline mb-10 text-[40px] ${isDark ? 'text-text-dark' : 'text-text'}`}>Accueil</Text>
      <Text className={`text-[20px] mb-6 ${isDark ? 'text-text-dark' : 'text-primary'}`}>Bienvenue sur l’app AREA</Text>
      <Button title="Aller à la To‑Do List" onPress={() => navigation.navigate('Todo')} />
      <CatImage />
    </ScrollView>
  );
}