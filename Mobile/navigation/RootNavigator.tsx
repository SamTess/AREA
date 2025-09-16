import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import HomeScreen from '../screens/HomeScreen';
import TodoScreen from '../screens/TodoScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil' }} />
      <Stack.Screen name="Todo" component={TodoScreen} options={{ title: 'To‑Do List' }} />
    </Stack.Navigator>
  );
}