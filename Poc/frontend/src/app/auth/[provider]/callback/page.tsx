"use client";
import React, { useEffect, useState } from 'react';
import { parseQueryCode } from '@/services/oauthService';
import { useParams } from 'next/navigation';
import useApi from '@/hooks/useApi';

export default function OAuthCallback() {
  const params = useParams();
  const provider = params?.provider ?? null;
  const { post } = useApi();
  const [ code, setCode ] = useState<string | null>(null);
  const [ error, setError ] = useState<string | null>(null);

  useEffect(() => {
    if (!provider) {
      setError('Missing provider');
      return;
    }
    const parsed = parseQueryCode(window.location.search);
    if (parsed.error) setError(parsed.error);
    setCode(parsed.code);

    if (parsed.code) {
      (async () => {
        try {
          await post<String>(`/auth/${provider}/exchange`, { code: parsed.code });
          window.location.href = '/';
        } catch (e) {
          setError('Network error during token exchange');
        }
      })();
    }
  }, [provider]);

  return null;
}
