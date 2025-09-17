import React from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useThemeScheme } from '../context/ThemeContext';
// NativeWind migration: using tailwind classes

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  showError?: boolean;
};

export function TodoInput({ value, onChangeText, onSubmit, showError }: Props) {
  const { scheme } = useThemeScheme();
  const isDark = scheme === 'dark';
  return (
    <>
      <View className="w-full mb-6 flex-row justify-between">
        <TextInput
          placeholder="Enter your todo task..."
            value={value}
            onChangeText={onChangeText}
            className={`w-52 border-2 border-primary rounded-lg pl-2 ${isDark ? 'text-text-dark bg-background-dark' : 'text-text bg-white'}`}
        />
        <Button title="Add Task" onPress={onSubmit} />
      </View>
      {showError ? <Text className={` ${isDark ? 'text-danger' : 'text-error'}`}>Error: Input field is empty...</Text> : null}
    </>
  );
}

export default TodoInput;
