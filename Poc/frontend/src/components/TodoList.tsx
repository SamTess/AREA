"use client";
import React from "react";
import Todo from "@/types/Todo";

type Props = {
  todos: Todo[];
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export default function TodoList({ todos, onToggle, onDelete }: Props) {
  return (
    <ul className="w-full max-w-xl divide-y">
      {todos.map((t) => (
        <li key={t.id} className="flex items-center justify-between py-2">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={!!t.completed}
              onChange={() => onToggle(t.id, !t.completed)}
            />
            <span className={t.completed ? "line-through text-gray-500" : ""}>
              {t.title}
            </span>
          </label>
          <button
            className="text-sm text-red-600"
            onClick={() => onDelete(t.id)}
          >
            Delete
          </button>
        </li>
      ))}
      {todos.length === 0 && (
        <li className="py-4 text-gray-500">No todos yet — add one above.</li>
      )}
    </ul>
  );
}
