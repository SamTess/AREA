import React from "react";
import { Text, View } from "react-native";
import { useTodos } from "./hooks/useTodos";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import { appStyles as styles } from "./styles/appStyles";

export default function App() {
  const { value, setValue, toDoList, error, handleSubmit, removeItem, toggleComplete, showError } = useTodos();

  return (
    <View style={styles.container}>
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
    </View>
  );
}