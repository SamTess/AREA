import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

type Props = {
  status?: number;
};

export default function HttpCat({ status = 200 }: Props) {
  const uri = `https://http.cat/${status}`;
  return (
    <View style={styles.wrapper}>
      <Image source={{ uri }} style={styles.image} resizeMode="contain" accessible accessibilityLabel={`HTTP ${status} Cat`} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
});
