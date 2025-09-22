import { ApplicationSettings } from '@nativescript/core'

export interface TodoItem {
  id: string
  title: string
  done: boolean
  createdAt: number
}

const STORAGE_KEY = 'todos:data:v1'

function generateId(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function loadTodos(): TodoItem[] {
  try {
    const raw = ApplicationSettings.getString(STORAGE_KEY, '[]')
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return parsed.filter(v => v && typeof v.id === 'string' && typeof v.title === 'string').map(v => ({
        id: v.id,
        title: v.title,
        done: !!v.done,
        createdAt: typeof v.createdAt === 'number' ? v.createdAt : Date.now(),
      }))
    }
  } catch (e) {
    console.log('[todos] load error', e)
  }
  return []
}

export function saveTodos(list: TodoItem[]) {
  try {
    ApplicationSettings.setString(STORAGE_KEY, JSON.stringify(list))
  } catch (e) {
    console.log('[todos] save error', e)
  }
}

export function createTodo(title: string): TodoItem {
  return {
    id: generateId(),
    title: title.trim(),
    done: false,
    createdAt: Date.now(),
  }
}
