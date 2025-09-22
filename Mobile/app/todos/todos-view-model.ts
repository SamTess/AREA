import { Observable, ObservableArray } from '@nativescript/core'
import { TodoItem, loadTodos, saveTodos, createTodo } from './todo-model'

export class TodosViewModel extends Observable {
  todos: ObservableArray<TodoItem>
  newTitle: string = ''

  constructor() {
    super()
    this.todos = new ObservableArray(loadTodos())
  }

  private persist() {
    const plain: TodoItem[] = []
    for (let i = 0; i < this.todos.length; i++) {
      plain.push(this.todos.getItem(i))
    }
    saveTodos(plain)
  }

  addTodo() {
    const title = (this.newTitle || '').trim()
    if (!title) return
    this.todos.unshift(createTodo(title))
    this.set('newTitle', '')
    this.notifyPropertyChange('todos', this.todos)
    this.persist()
  }

  toggle(id: string) {
    const idx = this.todos.findIndex(t => t.id === id)
    if (idx >= 0) {
      const item = this.todos.getItem(idx)
      item.done = !item.done
      this.todos.setItem(idx, { ...item })
      this.persist()
    }
  }

  remove(id: string) {
    const idx = this.todos.findIndex(t => t.id === id)
    if (idx >= 0) {
      this.todos.splice(idx, 1)
      this.persist()
    }
  }

  clearCompleted() {
    const remaining = this.todos.filter(t => !t.done)
    this.todos.splice(0)
    if (remaining.length) this.todos.push(...remaining)
    this.persist()
  }
}
