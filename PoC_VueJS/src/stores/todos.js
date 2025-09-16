import { defineStore } from 'pinia'

const STORAGE_KEY = 'poc_local_todos'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const data = raw ? JSON.parse(raw) : []
    if (!Array.isArray(data)) return []
    return data
  } catch (_) {
    return []
  }
}

function persist(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export const useTodosStore = defineStore('todos', {
  state: () => ({
    items: load(),
  }),
  getters: {
    count: (s) => s.items.length,
    doneCount: (s) => s.items.filter(t => t.done).length,
  },
  actions: {
    add(title) {
      const t = { id: uid(), title: title?.trim() || 'Untitled', done: false }
      this.items.push(t)
      persist(this.items)
      return t
    },
    update(id, patch) {
      const i = this.items.findIndex(t => t.id === id)
      if (i === -1) return
      this.items[i] = { ...this.items[i], ...patch }
      persist(this.items)
    },
    toggle(id) {
      const i = this.items.findIndex(t => t.id === id)
      if (i === -1) return
      this.items[i].done = !this.items[i].done
      persist(this.items)
    },
    remove(id) {
      this.items = this.items.filter(t => t.id !== id)
      persist(this.items)
    },
    move(fromIndex, toIndex) {
      const n = this.items.length
      if (fromIndex < 0 || fromIndex >= n || toIndex < 0 || toIndex >= n) return
      const [it] = this.items.splice(fromIndex, 1)
      this.items.splice(toIndex, 0, it)
      persist(this.items)
    },
    clear() {
      this.items = []
      persist(this.items)
    },
    replaceAll(list) {
      this.items = Array.isArray(list) ? list : []
      persist(this.items)
    }
  }
})
