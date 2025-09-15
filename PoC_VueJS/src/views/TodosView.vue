<script setup>
import { ref } from 'vue'
import api from '@/services/api'
import ResponseViewer from '@/components/ResponseViewer.vue'
import JwtPayload from '@/components/JwtPayload.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const items = ref([])
const resp = ref(null)
const err = ref(null)
const loading = ref(false)
const apiUrl = import.meta.env.VITE_API_URL

async function fetchTodos() {
  loading.value = true
  resp.value = null
  err.value = null
  try {
    const r = await api.get('/todos')
    items.value = Array.isArray(r.data) ? r.data : []
    resp.value = r
  } catch (e) {
    err.value = e?.response || e
  } finally {
    loading.value = false
  }
}

async function createTodo() {
  loading.value = true
  resp.value = null
  err.value = null
  try {
    const r = await api.post('/todos', { title: 'Sample', done: false })
    resp.value = r
    await fetchTodos()
  } catch (e) {
    err.value = e?.response || e
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Todo Management
      </h1>
      <p class="text-gray-600 mt-2">Connected to: {{ apiUrl || 'localhost:3000' }}</p>
    </div>

    <!-- Action buttons -->
    <div class="flex justify-center gap-4">
      <button 
        @click="fetchTodos" 
        :disabled="loading" 
        class="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        <span class="relative flex items-center">
          <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span v-else class="mr-2">📥</span>
          {{ loading ? 'Loading...' : 'Fetch Todos' }}
        </span>
      </button>
      
      <button 
        @click="createTodo" 
        :disabled="loading" 
        class="group relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-purple-700 to-purple-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        <span class="relative flex items-center">
          <span class="mr-2">✨</span>
          Create Sample
        </span>
      </button>
    </div>

    <!-- Todos list -->
    <div v-if="items.length > 0" class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span class="mr-2">📝</span>
        Todo Items ({{ items.length }})
      </h2>
      <ul class="space-y-3">
        <li 
          v-for="(todo, index) in items" 
          :key="todo.id || index" 
          class="flex items-center p-3 bg-gray-50/50 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-white/50 transition-all duration-200"
        >
          <div class="flex-1">
            <p class="text-gray-900 font-medium">{{ todo.title || 'Untitled' }}</p>
            <p v-if="todo.description" class="text-sm text-gray-600 mt-1">{{ todo.description }}</p>
          </div>
          <div v-if="todo.done" class="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            ✅ Done
          </div>
          <div v-else class="ml-3 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
            ⏳ Pending
          </div>
        </li>
      </ul>
    </div>

    <div v-else-if="!loading" class="text-center py-12">
      <div class="text-6xl mb-4">📝</div>
      <p class="text-gray-500">No todos yet. Try fetching some!</p>
    </div>

    <!-- API Response -->
    <ResponseViewer :response="resp" :error="err" />

    <!-- Auth Section -->
    <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span class="mr-2">🔐</span>
        Authentication Status
      </h2>
      
      <div v-if="!auth.isAuthenticated" class="flex items-center p-4 bg-yellow-50 rounded-xl border border-yellow-200">
        <svg class="w-5 h-5 text-yellow-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>
        <div>
          <p class="text-yellow-800 font-medium">Not authenticated</p>
          <p class="text-yellow-700 text-sm">Please log in to access protected routes</p>
        </div>
      </div>
      
      <div v-else class="space-y-4">
        <div class="flex items-center p-4 bg-green-50 rounded-xl border border-green-200">
          <svg class="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          <div>
            <p class="text-green-800 font-medium">Authenticated</p>
            <p class="text-green-700 text-sm">Access token is present and valid</p>
          </div>
        </div>
        
        <JwtPayload :token="auth.accessToken" />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
