import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useAuthContext } from '../context/AuthContext';

export default function OAuthCallbackScreen() {
  const { refresh } = useAuthContext();
  useEffect(() => {
    refresh();
  }, [refresh]);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator />
      <Text style={{ marginTop: 12 }}>Finalizing sign-in…</Text>
    </View>
  );
}
