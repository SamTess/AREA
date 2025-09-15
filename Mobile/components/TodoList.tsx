import React from 'react';
import { View, Text } from 'react-native';
import { IToDo } from '../interfaces/IToDo.interface';
import { TodoItem } from './TodoItem';

type Props = {
  items: IToDo[];
  onToggle: (index: number) => void;
  onRemove: (index: number) => void;
};

export function TodoList({ items, onToggle, onRemove }: Props) {
  if (items.length === 0) return <Text>No to do task available</Text>;

  return (
    <View>
      {items.map((toDo, index) => (
        <TodoItem key={`${index}_${toDo.text}`} item={toDo} index={index} onToggle={onToggle} onRemove={onRemove} />
      ))}
    </View>
  );
}

export default TodoList;
