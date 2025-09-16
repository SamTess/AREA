import React from 'react';
import { View, Text, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { appStyles as styles } from '../styles/appStyles';
import CatImage from '../components/CatImage';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accueil</Text>
      <Text style={styles.subtitle}>Bienvenue sur l’app AREA</Text>
      <Button title="Aller à la To‑Do List" onPress={() => navigation.navigate('Todo')} />
      <CatImage />
    </View>
  );
}