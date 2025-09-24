import { apiGet, apiPost, apiPatch, apiDelete } from './api';

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  order?: number | null;
  dueDate?: string | null;
  description?: string | null;
};

export async function listTodos() {
  return apiGet<Todo[]>('/todos');
}

export async function createTodo(input: Partial<Todo>) {
  return apiPost<Todo, Partial<Todo>>('/todos', input);
}

export async function patchTodo(id: number, input: Partial<Todo>) {
  return apiPatch<Todo, Partial<Todo>>(`/todos/${id}`, input);
}

export async function deleteTodo(id: number) {
  return apiDelete<void>(`/todos/${id}`);
}

export async function clearCompleted() {
  return apiPost<void, undefined>('/todos/clear-completed');
}
