import React from 'react';
import { Image, View } from 'react-native';

type Props = {
  status?: number;
};

export default function HttpCat({ status = 200 }: Props) {
  const uri = `https://http.cat/${status}`;
  return (
    <View className="w-full items-center mt-6 mb-2">
      <Image source={{ uri }} className="w-full h-[200px] rounded-lg" resizeMode="contain" accessible accessibilityLabel={`HTTP ${status} Cat`} />
    </View>
  );
}
