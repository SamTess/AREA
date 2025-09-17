import React, { useEffect, useState, useCallback } from 'react';
import { View, Image, ActivityIndicator, Text, Pressable } from 'react-native';
import { fetchRandomCatImage } from '../services/catapi';

type Props = {
  mimeTypes?: string; // e.g. 'jpg,png'
  size?: 'small' | 'med' | 'full';
  breedIds?: string; // comma-separated ids
};

export default function CatImage({ mimeTypes = 'jpg,png', size = 'med', breedIds }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [imgSize, setImgSize] = useState<{ width: number; height: number } | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const img = await fetchRandomCatImage({ mime_types: mimeTypes, size, breed_ids: breedIds });
      setUrl(img?.url || null);
      if (img?.width && img?.height) setImgSize({ width: img.width, height: img.height });
      setError(null);
    } catch (e: any) {
      setError(e?.message || 'Failed to load cat');
    } finally {
      setLoading(false);
    }
  }, [mimeTypes, size, breedIds]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await load();
    })();
    return () => {
      mounted = false;
    };
  }, [load]);

  if (loading) return <ActivityIndicator className="mt-4" />;
  if (error) return <Text className="text-danger mt-2">CatAPI: {error}</Text>;
  if (!url) return <Text className="text-danger mt-2">No image found</Text>;

  const aspectRatio = imgSize && imgSize.width > 0 && imgSize.height > 0
    ? imgSize.width / imgSize.height
    : 1;

  return (
    <Pressable onPress={load} disabled={loading} className="w-full items-center mt-4" accessibilityRole="imagebutton" accessibilityLabel="Refresh cat image">
      <Image
        source={{ uri: url }}
        style={{ aspectRatio, opacity: loading ? 0.7 : 1 }}
        className="w-full rounded-lg"
        resizeMode="contain"
      />
      {loading ? <ActivityIndicator className="absolute" /> : null}
    </Pressable>
  );
}
