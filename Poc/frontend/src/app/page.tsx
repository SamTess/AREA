"use client";
import { useEffect, useState } from "react";
import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";
import Todo from "@/types/Todo";

const API = process.env.NEXT_PUBLIC_API_URL || "";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/todos`);
      if (!res.ok) throw new Error("Failed to load todos");
      const data = await res.json();
      setTodos(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function createTodo(title: string) {
    // optimistic id
    const tempId = "t-" + Date.now();
    const optimistic: Todo = { id: tempId, title, completed: false };
    setTodos((s) => [optimistic, ...s]);
    try {
      const res = await fetch(`${API}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error("create failed");
      const saved = await res.json();
      setTodos((s) => s.map((t) => (t.id === tempId ? saved : t)));
    } catch (e) {
      console.error(e);
      setTodos((s) => s.filter((t) => t.id !== tempId));
    }
  }

  async function toggleTodo(id: string, completed: boolean) {
    setTodos((s) => s.map((t) => (t.id === id ? { ...t, completed } : t)));
    try {
      await fetch(`${API}/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });
    } catch (e) {
      console.error(e);
      fetchTodos();
    }
  }

  async function deleteTodo(id: string) {
    const previous = todos;
    setTodos((s) => s.filter((t) => t.id !== id));
    try {
      await fetch(`${API}/todos/${id}`, { method: "DELETE" });
    } catch (e) {
      console.error(e);
      setTodos(previous);
    }
  }

  return (
    <div className="min-h-screen p-8 flex items-start justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">Todos</h1>
        <TodoForm onCreate={createTodo} />
        <div className="mt-4">
          {loading ? (
            <div>Loading…</div>
          ) : (
            <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
          )}
        </div>
      </div>
    </div>
  );
}
