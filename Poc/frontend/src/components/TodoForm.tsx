"use client";
import { useState } from "react";

type Props = {
  onCreate: (title: string) => Promise<void>;
};

export default function TodoForm({ onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await onCreate(title.trim());
      setTitle("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-xl">
      <input
        className="border px-2 py-1 flex-1 rounded"
        placeholder="Add a new todo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={loading}
      />
      <button
        type="submit"
        className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-60"
        disabled={loading}
      >
        Add
      </button>
    </form>
  );
}
