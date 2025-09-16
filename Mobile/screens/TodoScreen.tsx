import React from 'react';
import { Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { appStyles as styles } from '../styles/appStyles';
import { useTodos } from '../hooks/useTodos';
import TodoInput from '../components/TodoInput';
import TodoList from '../components/TodoList';
import HttpCat from '../components/HttpCat';

export default function TodoScreen() {
  const { value, setValue, toDoList, error, handleSubmit, removeItem, toggleComplete, showError } = useTodos();

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.select({ ios: 64, android: 0, default: 0 })}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Todo List</Text>
        <TodoInput
          value={value}
          onChangeText={(e) => {
            setValue(e);
            showError(false);
          }}
          onSubmit={handleSubmit}
          showError={!!error}
        />
        <Text style={styles.subtitle}>Your Tasks :</Text>
        <TodoList items={toDoList} onToggle={toggleComplete} onRemove={removeItem} />
        <HttpCat status={toDoList.length === 0 ? 404 : 200} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
