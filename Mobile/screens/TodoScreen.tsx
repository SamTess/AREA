import React from 'react';
import { Text, ScrollView, KeyboardAvoidingView, Platform, View } from 'react-native';
import ThemeToggle from '../components/ThemeToggle';
import { useThemeScheme } from '../context/ThemeContext';
import { useTodos } from '../hooks/useTodos';
import TodoInput from '../components/TodoInput';
import TodoList from '../components/TodoList';
import HttpCat from '../components/HttpCat';

export default function TodoScreen() {
  const { scheme } = useThemeScheme();
  const isDark = scheme === 'dark';
  const { value, setValue, toDoList, error, handleSubmit, removeItem, toggleComplete, showError } = useTodos();

  return (
    <KeyboardAvoidingView
      className={`flex-1 ${isDark ? 'bg-background-dark' : 'bg-background'}`}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.select({ ios: 64, android: 0, default: 0 })}
    >
      <ScrollView
        contentContainerStyle={{ alignItems: 'center' }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        className={`px-10 py-10 ${isDark ? 'bg-background-dark' : 'bg-background'}`}
      >
        <View className="w-full">
          <ThemeToggle />
        </View>
        <Text className={`font-bold underline mb-10 text-[40px] ${isDark ? 'text-text-dark' : 'text-text'}`}>Todo List</Text>
        <TodoInput
          value={value}
          onChangeText={(e) => {
            setValue(e);
            showError(false);
          }}
          onSubmit={handleSubmit}
          showError={!!error}
        />
        <Text className={`text-[20px] mb-6 ${isDark ? 'text-text-dark' : 'text-primary'}`}>Your Tasks :</Text>
        <TodoList items={toDoList} onToggle={toggleComplete} onRemove={removeItem} />
        <HttpCat status={toDoList.length === 0 ? 404 : 200} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
