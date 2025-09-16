import React, { useEffect, useState, useCallback } from 'react';
import { View, Image, ActivityIndicator, Text, StyleSheet, Pressable } from 'react-native';
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

  if (loading) return <ActivityIndicator style={styles.loader} />;
  if (error) return <Text style={styles.error}>CatAPI: {error}</Text>;
  if (!url) return <Text style={styles.error}>No image found</Text>;

  const aspectRatio = imgSize && imgSize.width > 0 && imgSize.height > 0
    ? imgSize.width / imgSize.height
    : 1;

  return (
    <Pressable onPress={load} disabled={loading} style={styles.wrapper} accessibilityRole="imagebutton" accessibilityLabel="Refresh cat image">
      <Image
        source={{ uri: url }}
        style={[styles.image, { aspectRatio, opacity: loading ? 0.7 : 1 }]}
        resizeMode="contain"
      />
      {loading ? <ActivityIndicator style={styles.overlayLoader} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  loader: { marginTop: 16 },
  error: { color: 'crimson', marginTop: 8 },
  wrapper: { width: '100%', alignItems: 'center', marginTop: 16 },
  image: { width: '100%', borderRadius: 8 },
  overlayLoader: { position: 'absolute' },
});
