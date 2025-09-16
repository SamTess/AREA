import React, { useEffect, useState } from 'react';
import { View, Image, ActivityIndicator, Text, StyleSheet } from 'react-native';
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

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const img = await fetchRandomCatImage({ mime_types: mimeTypes, size, breed_ids: breedIds });
        if (!mounted) return;
        setUrl(img?.url || null);
        setError(null);
      } catch (e: any) {
        setError(e?.message || 'Failed to load cat');
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [mimeTypes, size, breedIds]);

  if (loading) return <ActivityIndicator style={styles.loader} />;
  if (error) return <Text style={styles.error}>CatAPI: {error}</Text>;
  if (!url) return <Text style={styles.error}>No image found</Text>;

  return (
    <View style={styles.wrapper}>
      <Image source={{ uri: url }} style={styles.image} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  loader: { marginTop: 16 },
  error: { color: 'crimson', marginTop: 8 },
  wrapper: { width: '100%', alignItems: 'center', marginTop: 16 },
  image: { width: '100%', height: 200, borderRadius: 8 },
});
