export type User = { id: number; username: string; email?: string | null };

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  order?: number | null;
  dueDate?: string | null;
  description?: string | null;
};
