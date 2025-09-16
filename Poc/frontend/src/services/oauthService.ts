const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';

export type OAuthProvider = 'github';

export function buildAuthorizeUrl(provider: OAuthProvider, opts: {
  clientId: string;
  scope?: string;
  state?: string;
  allowSignup?: boolean;
}) {
  if (provider !== 'github') throw new Error('Unsupported provider');
  const params = new URLSearchParams();
  params.set('client_id', opts.clientId);
  if (opts.scope) params.set('scope', opts.scope);
  if (opts.state) params.set('state', opts.state);
  if (opts.allowSignup === false) params.set('allow_signup', 'false');
  return `${GITHUB_AUTHORIZE_URL}?${params.toString()}`;
}

export function parseQueryCode(search: string) {
  try {
    const params = new URLSearchParams(search);
    return {
      code: params.get('code'),
      state: params.get('state'),
      error: params.get('error'),
    };
  } catch (e) {
    return { code: null, state: null, error: 'invalid_query' };
  }
}

export default { buildAuthorizeUrl, parseQueryCode };
