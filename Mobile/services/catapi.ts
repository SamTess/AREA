const BASE_URL = 'https://api.thecatapi.com/v1';

function getApiKey() {
  const key = process.env.EXPO_PUBLIC_CAT_API_KEY;
  if (!key) {
    console.warn('[CatAPI] Missing EXPO_PUBLIC_CAT_API_KEY; requests may be rate-limited or fail.');
  }
  return key;
}

export async function fetchRandomCatImage(params?: { mime_types?: string; size?: string; breed_ids?: string }) {
  const url = new URL(BASE_URL + '/images/search');
  url.searchParams.set('limit', '1');
  if (params?.mime_types) url.searchParams.set('mime_types', params.mime_types);
  if (params?.size) url.searchParams.set('size', params.size);
  if (params?.breed_ids) url.searchParams.set('breed_ids', params.breed_ids);

  const headers: Record<string, string> = { 'Accept': 'application/json' };
  const apiKey = getApiKey();
  if (apiKey) headers['x-api-key'] = apiKey;

  const res = await fetch(url.toString(), { headers });
  if (!res.ok) throw new Error(`CatAPI error ${res.status}`);
  const data = (await res.json()) as Array<{ url: string; breeds?: any[]; id: string; width: number; height: number }>;
  return data[0];
}
