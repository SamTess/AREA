<script setup>
import { computed } from 'vue'
import { jwtDecode } from 'jwt-decode'
const props = defineProps({ token: { type: String, default: '' } })
const payload = computed(() => {
  try { return props.token ? jwtDecode(props.token) : null } catch (_) { return null }
})
</script>
<template>
  <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
    <div class="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
      <h3 class="font-semibold text-white flex items-center">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 8A6 6 0 006.025.25 6.007 6.007 0 0041 10a6 6 0 002 4v1l3 3h1a1 1 0 100-2v-2a8 8 0 01-.697-14.955 1 1 0 10-.607-1.906A6.007 6.007 0 001 8z" clip-rule="evenodd"></path>
        </svg>
        JWT Token Payload
      </h3>
    </div>
    
    <div class="p-6">
      <div v-if="payload" class="space-y-4">
        <!-- Token info -->
        <div v-if="payload.exp" class="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-200">
          <div>
            <p class="text-sm font-medium text-blue-900">Token Expiration</p>
            <p class="text-xs text-blue-700">{{ new Date(payload.exp * 1000).toLocaleString() }}</p>
          </div>
          <div class="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            {{ payload.exp > Date.now() / 1000 ? '✅ Valid' : '❌ Expired' }}
          </div>
        </div>
        
        <!-- Full payload -->
        <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <pre class="text-xs text-gray-700 overflow-auto">{{ JSON.stringify(payload, null, 2) }}</pre>
        </div>
      </div>
      
      <div v-else class="text-center py-8">
        <div class="text-4xl mb-3">🔑</div>
        <p class="text-gray-500 font-medium">Invalid or missing token</p>
        <p class="text-gray-400 text-sm mt-1">JWT payload could not be decoded</p>
      </div>
    </div>
  </div>
</template>
