import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TextInput, Button, TouchableOpacity } from 'react-native';
import { listTodos, createTodo, patchTodo, deleteTodo, clearCompleted, Todo } from '../services/todos';
import { useAuthContext } from '../context/AuthContext';

export default function HomeScreen() {
  const { user, logout } = useAuthContext();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listTodos();
      setTodos(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const addTodo = useCallback(async () => {
    if (!title.trim()) return;
    const created = await createTodo({ title: title.trim(), completed: false });
    setTodos(prev => [created, ...prev]);
    setTitle('');
  }, [title]);

  const toggleTodo = useCallback(async (t: Todo) => {
    const upd = await patchTodo(t.id, { completed: !t.completed });
    setTodos(prev => prev.map(x => x.id === t.id ? upd : x));
  }, []);

  const removeTodo = useCallback(async (id: number) => {
    await deleteTodo(id);
    setTodos(prev => prev.filter(x => x.id !== id));
  }, []);

  const handleClearCompleted = useCallback(async () => {
    await clearCompleted();
    load();
  }, [load]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: '600' }}>Hello {user?.username}</Text>
        <Button title="Logout" onPress={logout} />
      </View>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="New todo title"
          style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8 }}
        />
        <Button title="Add" onPress={addTodo} />
      </View>
      <Button title="Clear completed" onPress={handleClearCompleted} />
      <FlatList
        style={{ marginTop: 12 }}
        refreshing={loading}
        onRefresh={load}
        data={todos}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={() => toggleTodo(item)} style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, textDecorationLine: item.completed ? 'line-through' : 'none' }}>
                {item.title}
              </Text>
            </TouchableOpacity>
            <Button title="Delete" onPress={() => removeTodo(item.id)} />
          </View>
        )}
      />
    </View>
  );
}
