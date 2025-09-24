export type OAuthProvider = 'github';

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';

export function buildAuthorizeUrl(provider: OAuthProvider, opts: {
  clientId: string;
  scope?: string;
  state?: string;
  allowSignup?: boolean;
  redirectUri?: string;
}) {
  if (provider !== 'github') throw new Error('Unsupported provider');
  const params = new URLSearchParams();
  params.set('client_id', opts.clientId);
  if (opts.scope) params.set('scope', opts.scope);
  if (opts.state) params.set('state', opts.state);
  if (opts.allowSignup === false) params.set('allow_signup', 'false');
  if (opts.redirectUri) params.set('redirect_uri', opts.redirectUri);
  return `${GITHUB_AUTHORIZE_URL}?${params.toString()}`;
}

export function parseQueryParams(url: string) {
  try {
    const u = new URL(url);
    const p = u.searchParams;
    return { code: p.get('code'), state: p.get('state'), error: p.get('error') };
  } catch (e) {
    return { code: null, state: null, error: 'invalid_url' };
  }
}
