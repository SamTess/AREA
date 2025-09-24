import React, { useCallback } from 'react';
import { View, Text, Button } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import { buildAuthorizeUrl } from '../services/oauth';
import { useAuthContext } from '../context/AuthContext';

const githubClientId = process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID || '';

export default function LoginScreen() {
  const { refresh } = useAuthContext();

  const handleGithub = useCallback(async () => {
  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
    const state = Math.random().toString(36).substring(2);
    const url = buildAuthorizeUrl('github', {
      clientId: githubClientId,
      scope: 'read:user user:email',
      state,
      allowSignup: true,
      redirectUri
    });
  const res = await AuthSession.startAsync({ authUrl: url, returnUrl: redirectUri });
    if (res.type === 'success' && res.params?.code) {
      try {
        await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL || ''}/auth/github/exchange`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ code: res.params.code })
        });
        await refresh();
      } catch (e) {
        console.warn('Exchange failed', e);
      }
    }
  }, [refresh]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 16 }}>AREA Mobile</Text>
      <Button title="Continue with GitHub" onPress={handleGithub} disabled={!githubClientId} />
      {!githubClientId && (
        <Text style={{ marginTop: 12, color: 'crimson', textAlign: 'center' }}>
          Missing EXPO_PUBLIC_GITHUB_CLIENT_ID in env
        </Text>
      )}
      <Text style={{ marginTop: 24, color: '#555' }}>API: {process.env.EXPO_PUBLIC_API_BASE_URL || '(unset)'}</Text>
      <Text style={{ marginTop: 4, color: '#555' }}>Redirect: {AuthSession.makeRedirectUri()}</Text>
      <Text style={{ marginTop: 4, color: '#555' }}>App ID: {Constants.expoConfig?.slug}</Text>
    </View>
  );
}
