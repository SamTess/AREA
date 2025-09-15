import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { colors, spacing } from '../styles/theme';
import { IToDo } from '../interfaces/IToDo.interface';

type Props = {
  item: IToDo;
  index: number;
  onToggle: (index: number) => void;
  onRemove: (index: number) => void;
};

export function TodoItem({ item, index, onToggle, onRemove }: Props) {
  return (
    <View style={styles.listItem}>
      <Text style={[styles.task, { textDecorationLine: item.completed ? 'line-through' : 'none' }]}>
        {item.text}
      </Text>
      <Button title={item.completed ? 'Completed' : 'Complete'} onPress={() => onToggle(index)} />
      <Button title="X" onPress={() => onRemove(index)} color="crimson" />
    </View>
  );
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: spacing.sm + spacing.xs,
  },
  task: {
    width: 200,
  },
});

export default TodoItem;
