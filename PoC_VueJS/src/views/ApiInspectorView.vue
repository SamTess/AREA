<script setup>
import { ref } from 'vue'
import api from '@/services/api'
import ResponseViewer from '@/components/ResponseViewer.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const method = ref('GET')
const path = ref('/todos')
const body = ref('{\n  "title": "Sample todo",\n  "done": false\n}')
const useAuth = ref(true)
const loading = ref(false)
const resp = ref(null)
const err = ref(null)

async function send() {
  loading.value = true
  resp.value = null
  err.value = null
  try {
    const url = path.value
    const headers = {}
    if (!useAuth.value) headers['X-Skip-Auth'] = '1'
    let r
    if (method.value === 'GET' || method.value === 'DELETE') {
      r = await api.request({ method: method.value, url, headers })
    } else {
      let data
      try { data = JSON.parse(body.value || '{}') } catch(_) { data = body.value }
      r = await api.request({ method: method.value, url, data, headers })
    }
    resp.value = r
  } catch (e) {
    err.value = e?.response || e
  } finally {
    loading.value = false
  }
}

function quick(endpoint, meth = 'GET', exampleBody = null) {
  method.value = meth
  path.value = endpoint
  if (exampleBody !== null) body.value = JSON.stringify(exampleBody, null, 2)
}
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        API Inspector
      </h1>
      <p class="text-gray-600 mt-2">Test and inspect API endpoints</p>
    </div>

    <!-- Request Builder -->
    <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <span class="mr-2">🔧</span>
        Request Builder
      </h2>

      <!-- Method and URL -->
      <div class="flex gap-4 mb-6">
        <select 
          v-model="method" 
          class="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
        >
          <option value="GET" class="bg-green-50">GET</option>
          <option value="POST" class="bg-blue-50">POST</option>
          <option value="PUT" class="bg-yellow-50">PUT</option>
          <option value="PATCH" class="bg-orange-50">PATCH</option>
          <option value="DELETE" class="bg-red-50">DELETE</option>
        </select>
        
        <input 
          v-model="path" 
          placeholder="/api/endpoint" 
          class="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 font-mono text-sm"
        />
        
        <div class="flex items-center">
          <label class="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors duration-200">
            <input type="checkbox" v-model="useAuth" class="text-purple-600 focus:ring-purple-500 rounded" />
            <span class="text-sm font-medium text-gray-700">🔐 Auth</span>
          </label>
        </div>
        
        <button 
          @click="send" 
          :disabled="loading" 
          class="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl"
        >
          <span v-if="loading" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending...
          </span>
          <span v-else class="flex items-center">
            <span class="mr-2">🚀</span>
            Send
          </span>
        </button>
      </div>

      <!-- Request Body (for POST/PUT/PATCH) -->
      <div v-if="method !== 'GET' && method !== 'DELETE'" class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-3">Request Body (JSON)</label>
        <div class="relative">
          <textarea 
            v-model="body" 
            rows="8" 
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 font-mono text-sm resize-none"
            placeholder='{\n  "key": "value"\n}'
          ></textarea>
          <div class="absolute top-3 right-3 text-xs text-gray-400 bg-white px-2 py-1 rounded">
            JSON
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="border-t border-gray-100 pt-6">
        <h3 class="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
        <div class="flex flex-wrap gap-2">
          <button 
            @click="quick('/todos','GET')" 
            class="px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors duration-200 active:scale-95"
          >
            📥 GET /todos
          </button>
          <button 
            @click="quick('/todos','POST',{ title: 'Quick todo', done: false })" 
            class="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors duration-200 active:scale-95"
          >
            ✨ POST /todos
          </button>
          <button 
            @click="quick('/auth/me','GET')" 
            class="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors duration-200 active:scale-95"
          >
            👤 GET /auth/me
          </button>
          <button 
            @click="quick('/auth/refresh','POST',{ refreshToken: auth.refreshToken })" 
            class="px-3 py-1.5 bg-orange-100 text-orange-800 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors duration-200 active:scale-95"
          >
            🔄 POST /auth/refresh
          </button>
        </div>
      </div>
    </div>

    <!-- Response -->
    <ResponseViewer :response="resp" :error="err" />
  </div>
</template>

<style scoped>
.row { display:flex; gap:8px; align-items: center; margin: 8px 0; }
input { flex: 1; padding: 6px; }
select { padding: 6px; }
button { padding: 6px 10px; }
.code { width: 100%; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace; }
.quick { display:flex; gap:8px; align-items:center; margin: 8px 0; flex-wrap: wrap; }
</style>
