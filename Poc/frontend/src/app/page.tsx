"use client";
import { useEffect, useState } from "react";
import { Todo } from "@/types";
import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";
import useAuth from "@/hooks/useAuth";
import useApi from "@/hooks/useApi";


export default function Home() {
  const { get, post, patch, del } = useApi();
  const { user, loading: authLoading } = useAuth();
  const [ todos, setTodos ] = useState<Todo[]>([]);
  const [ loading, setLoading ] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    setLoading(true);
    try {
      const todos = await get<Todo[]>(`/todos`);
      setTodos(todos);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function createTodo(title: string) {
    const tempId = "t-" + Date.now();
    const optimistic: Todo = { id: tempId, title, completed: false };
    setTodos((s) => [optimistic, ...s]);
    try {
      const res = await post<Todo, { title: string }>(`/todos`, { title });
      const saved = { ...res };
      setTodos((s) => s.map((t) => (t.id === tempId ? saved : t)));
    } catch (e) {
      console.error(e);
      setTodos((s) => s.filter((t) => t.id !== tempId));
    }
  }

  async function toggleTodo(id: string, completed: boolean) {
    setTodos((s) => s.map((t) => (t.id === id ? { ...t, completed } : t)));
    try {
      await patch<Todo, { completed: boolean }>(`/todos/${id}`, { completed });
    } catch (e) {
      console.error(e);
      fetchTodos();
    }
  }

  async function deleteTodo(id: string) {
    const previous = todos;
    setTodos((s) => s.filter((t) => t.id !== id));
    try {
      await del<null>(`/todos/${id}`);
    } catch (e) {
      console.error(e);
      setTodos(previous);
    }
  }

  async function reorderTodos(ids: string[]) {
    setTodos((prev) => {
      const idToTodo = Object.fromEntries(prev.map((t) => [t.id, t]));
      return ids.map((id) => idToTodo[id]).filter(Boolean);
    });
    try {
      await patch<null, string[]>(`/todos/order`, ids);
    } catch (e) {
      console.error(e);
      fetchTodos();
    }
  }

  return (
    <div className="min-h-screen p-8 flex items-start justify-center">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Todos</h1>
          <div className="text-sm text-gray-600">
            {authLoading ? (
              <span>Checking auth…</span>
            ) : user ? (
              <span>
                Signed in as <strong>{user.username}</strong> with email <strong>{user.email}</strong>
              </span>
            ) : (
              <span>Not signed in</span>
            )}
          </div>
        </div>
        <TodoForm onCreate={createTodo} />
        <div className="mt-4">
          {loading ? (
            <div>Loading…</div>
          ) : (
            <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} onReorder={reorderTodos} />
          )}
        </div>
      </div>
    </div>
  );
}
