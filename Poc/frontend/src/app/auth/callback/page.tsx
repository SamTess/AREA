"use client";
import React, { useEffect, useState } from 'react';
import { parseQueryCode } from '@/services/oauthService';

export default function OAuthCallback() {
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const parsed = parseQueryCode(window.location.search);
    if (parsed.error) setError(parsed.error);
    setCode(parsed.code);
  }, []);

  const copyCode = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      alert('Code copied to clipboard');
    } catch (e) {
      alert('Copy failed');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>OAuth Callback</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {code ? (
        <div>
          <p>Authorization code:</p>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{code}</pre>
          <button onClick={copyCode}>Copy Code</button>
          <p>You can now POST this code to your backend to exchange it for a token.</p>
        </div>
      ) : (
        <p>Waiting for code...</p>
      )}
    </div>
  );
}
