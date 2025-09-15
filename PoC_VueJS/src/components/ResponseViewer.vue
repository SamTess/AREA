<script setup>
const props = defineProps({
  response: { type: Object, default: null },
  error: { type: [Object, String], default: null },
})
</script>

<template>
  <div class="space-y-4">
    <!-- Success Response -->
    <div v-if="response" class="bg-white/80 backdrop-blur-sm rounded-2xl border border-green-200/50 shadow-xl overflow-hidden">
      <div class="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4">
        <h3 class="font-semibold text-white flex items-center">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          Response {{ response.status }} {{ response.statusText }}
        </h3>
      </div>
      
      <div class="p-6 space-y-4">
        <details class="group">
          <summary class="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center transition-colors duration-200">
            <svg class="w-4 h-4 mr-2 transform group-open:rotate-90 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
            </svg>
            Headers
          </summary>
          <div class="mt-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
            <pre class="text-xs text-gray-700 overflow-auto">{{ JSON.stringify(response.headers, null, 2) }}</pre>
          </div>
        </details>
        
        <details open class="group">
          <summary class="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center transition-colors duration-200">
            <svg class="w-4 h-4 mr-2 transform group-open:rotate-90 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
            </svg>
            Response Body
          </summary>
          <div class="mt-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
            <pre class="text-xs text-gray-700 overflow-auto">{{ JSON.stringify(response.data, null, 2) }}</pre>
          </div>
        </details>
      </div>
    </div>

    <!-- Error Response -->
    <div v-else-if="error" class="bg-white/80 backdrop-blur-sm rounded-2xl border border-red-200/50 shadow-xl overflow-hidden">
      <div class="bg-gradient-to-r from-red-500 to-rose-500 px-6 py-4">
        <h3 class="font-semibold text-white flex items-center">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          Error Response
        </h3>
      </div>
      
      <div class="p-6">
        <div class="bg-red-50 rounded-xl p-4 border border-red-100">
          <pre class="text-xs text-red-700 overflow-auto">{{ typeof error === 'string' ? error : JSON.stringify(error, null, 2) }}</pre>
        </div>
      </div>
    </div>

    <!-- No Response -->
    <div v-else class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-8 text-center">
      <div class="text-4xl mb-3">📡</div>
      <p class="text-gray-500 font-medium">No response yet</p>
      <p class="text-gray-400 text-sm mt-1">Send a request to see the response here</p>
    </div>
  </div>
  
</template>

<style scoped>
</style>
