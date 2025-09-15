import React from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { colors, spacing } from '../styles/theme';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  showError?: boolean;
};

export function TodoInput({ value, onChangeText, onSubmit, showError }: Props) {
  return (
    <>
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Enter your todo task..."
          value={value}
          onChangeText={onChangeText}
          style={styles.inputBox}
        />
        <Button title="Add Task" onPress={onSubmit} />
      </View>
      {showError ? <Text style={styles.error}>Error: Input field is empty...</Text> : null}
    </>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  inputBox: {
    width: 200,
    borderColor: colors.primary,
    borderRadius: 8,
    borderWidth: 2,
    paddingLeft: spacing.sm,
  },
  error: {
    color: colors.error,
  },
});

export default TodoInput;
