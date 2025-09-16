<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
const isAuth = computed(() => auth.isAuthenticated)
function doLogout() { auth.logout(); location.href = '/login' }
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900">
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
      <div class="w-full px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div class="flex items-center gap-6">
          <div class="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            PoC Vue
          </div>
          <nav class="flex items-center gap-1 flex-wrap">
            <router-link 
              class="px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-blue-600 active:scale-95" 
              to="/todos"
              active-class="bg-blue-100 text-blue-700"
            >
              📝 Todos
            </router-link>
            <router-link 
              class="px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-blue-600 active:scale-95" 
              to="/todos-local"
              active-class="bg-blue-100 text-blue-700"
            >
              🗒️ Local Todos
            </router-link>
            <router-link 
              class="px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-blue-600 active:scale-95" 
              to="/api"
              active-class="bg-blue-100 text-blue-700"
            >
              🔧 API
            </router-link>
          </nav>
        </div>
        <div class="flex items-center gap-3">
          <router-link 
            v-if="!isAuth" 
            class="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 active:scale-95" 
            to="/login"
          >
            Login
          </router-link>
          <button 
            v-else 
            @click="doLogout" 
            class="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:from-gray-900 hover:to-black transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  <main class="w-full px-4 py-8">
      <router-view />
    </main>
  </div>
  
</template>

<style scoped>
</style>
