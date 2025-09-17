import React from 'react';
import { View, Text, Button } from 'react-native';
import { IToDo } from '../interfaces/IToDo.interface';
import { useThemeScheme } from '../context/ThemeContext';

type Props = {
  item: IToDo;
  index: number;
  onToggle: (index: number) => void;
  onRemove: (index: number) => void;
};

export function TodoItem({ item, index, onToggle, onRemove }: Props) {
  const { scheme } = useThemeScheme();
  const isDark = scheme === 'dark';
  return (
    <View className="w-full mb-3 flex-row items-center justify-between">
      <Text className={`w-52 ${item.completed ? (isDark ? 'line-through text-muted-dark' : 'line-through text-muted') : isDark ? 'text-text-dark' : 'text-text'}`}>
        {item.text}
      </Text>
      <Button title={item.completed ? 'Completed' : 'Complete'} onPress={() => onToggle(index)} />
      <Button title="X" onPress={() => onRemove(index)} color="crimson" />
    </View>
  );
}

export default TodoItem;
