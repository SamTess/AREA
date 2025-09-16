<script setup>
import { ref, computed } from 'vue'
import { useTodosStore } from '@/stores/todos'

const todos = useTodosStore()

const newTitle = ref('')
const filter = ref('all') // all | active | done

const filtered = computed(() => {
  if (filter.value === 'active') return todos.items.filter(t => !t.done)
  if (filter.value === 'done') return todos.items.filter(t => t.done)
  return todos.items
})

function add() {
  if (!newTitle.value.trim()) return
  todos.add(newTitle.value)
  newTitle.value = ''
}

function remove(id) {
  todos.remove(id)
}

function toggle(id) {
  todos.toggle(id)
}

function startEdit(todo) {
  todo.__editing = true
  todo.__draft = todo.title
}

function cancelEdit(todo) {
  todo.__editing = false
  todo.__draft = ''
}

function saveEdit(todo) {
  const title = (todo.__draft || '').trim()
  if (!title) return cancelEdit(todo)
  todos.update(todo.id, { title })
  todo.__editing = false
  todo.__draft = ''
}

function moveUp(index) {
  const id = filtered.value[index]?.id
  const baseIndex = todos.items.findIndex(t => t.id === id)
  if (baseIndex > 0) todos.move(baseIndex, baseIndex - 1)
}
function moveDown(index) {
  const id = filtered.value[index]?.id
  const baseIndex = todos.items.findIndex(t => t.id === id)
  if (baseIndex !== -1 && baseIndex < todos.items.length - 1) todos.move(baseIndex, baseIndex + 1)
}

let dragId = null
function onDragStart(i) { dragId = filtered.value[i]?.id || null }
function onDragOver(e) { e.preventDefault() }
function onDrop(i) {
  const targetId = filtered.value[i]?.id || null
  if (!dragId || !targetId || dragId === targetId) { dragId = null; return }
  const fromIndex = todos.items.findIndex(t => t.id === dragId)
  const toIndex = todos.items.findIndex(t => t.id === targetId)
  if (fromIndex !== -1 && toIndex !== -1) todos.move(fromIndex, toIndex)
  dragId = null
}
</script>

<template>
  <div class="space-y-8">
    <div class="text-center">
      <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Local Todos (sans login)
      </h1>
      <p class="text-gray-600 mt-2">Ajoutez, modifiez, supprimez et réorganisez. Sauvegarde locale.</p>
    </div>

    <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6 space-y-4">
      <div class="flex gap-3">
        <input v-model="newTitle" @keyup.enter="add" type="text" placeholder="Nouvelle tâche..."
          class="flex-1 rounded-lg border-gray-300 focus:border-blue-400 focus:ring-blue-300" />
        <button @click="add" class="rounded-lg px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 active:scale-95">Ajouter</button>
      </div>

      <div class="flex items-center gap-2 text-sm">
        <span class="text-gray-600">Filtre:</span>
        <button @click="filter='all'" :class="['px-3 py-1 rounded-lg border', filter==='all' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-200']">Tous</button>
        <button @click="filter='active'" :class="['px-3 py-1 rounded-lg border', filter==='active' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-200']">Actifs</button>
        <button @click="filter='done'" :class="['px-3 py-1 rounded-lg border', filter==='done' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-200']">Terminés</button>
        <div class="ml-auto text-gray-500">{{ todos.doneCount }} / {{ todos.count }} terminés</div>
      </div>
    </div>

    <div v-if="todos.items.length" class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-4">
      <ul class="divide-y divide-gray-100">
        <li v-for="(t, i) in filtered" :key="t.id"
            class="flex items-center gap-3 py-3 group"
            draggable="true"
            @dragstart="onDragStart(i)"
            @dragover="onDragOver"
            @drop="onDrop(i)">
          <input type="checkbox" :checked="t.done" @change="toggle(t.id)" class="w-4 h-4 rounded" />

          <div class="flex-1 min-w-0">
            <div v-if="!t.__editing" class="flex items-center gap-2">
              <p :class="['truncate', t.done ? 'line-through text-gray-400' : '']">{{ t.title }}</p>
              <button @click="startEdit(t)" class="opacity-0 group-hover:opacity-100 text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200">Éditer</button>
            </div>
            <div v-else class="flex items-center gap-2">
              <input v-model="t.__draft" @keyup.enter="saveEdit(t)" @keyup.esc="cancelEdit(t)" class="flex-1 rounded border-gray-300" />
              <button @click="saveEdit(t)" class="text-xs px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700">Sauver</button>
              <button @click="cancelEdit(t)" class="text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300">Annuler</button>
            </div>
          </div>

          <div class="flex items-center gap-1">
            <button @click="moveUp(i)" class="px-2 py-1 rounded border border-gray-200 bg-white text-gray-700 hover:bg-gray-100">⬆️</button>
            <button @click="moveDown(i)" class="px-2 py-1 rounded border border-gray-200 bg-white text-gray-700 hover:bg-gray-100">⬇️</button>
            <button @click="remove(t.id)" class="px-2 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 border border-red-200">Suppr</button>
          </div>
        </li>
      </ul>
    </div>

    <div v-else class="text-center py-12 text-gray-500">
      Aucune tâche pour le moment.
    </div>
  </div>
</template>

<style scoped>
</style>
