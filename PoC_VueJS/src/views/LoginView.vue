<script setup>
import { ref } from 'vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const email = ref('test@example.com')
const password = ref('password')
const loading = ref(false)
const error = ref('')

const auth = useAuthStore()

async function onSubmit() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.post('/auth/login', { email: email.value, password: password.value })
    await auth.login({ accessToken: data.accessToken, refreshToken: data.refreshToken })
    window.location.href = '/todos'
  } catch (e) {
    error.value = e?.response?.data?.message || e.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-[60vh] w-full px-4">
    <div class="w-full">
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
        <!-- Decorative gradient -->
        <div class="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-purple-400/10 to-pink-400/10 pointer-events-none" aria-hidden="true"></div>
        
        <div class="relative">
          <div class="text-center mb-8">
            <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p class="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          <form @submit.prevent="onSubmit" class="space-y-6 max-w-xl" role="form" aria-label="Login form">
            <div class="space-y-4">
              <div class="group">
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  id="email"
                  v-model="email" 
                  type="email" 
                  placeholder="Enter your email" 
                  required
                  aria-required="true"
                  aria-describedby="email-error"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 group-hover:border-gray-300 bg-white/50 backdrop-blur-sm"
                />
              </div>
              <div class="group">
                <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input 
                  id="password"
                  v-model="password" 
                  type="password" 
                  placeholder="Enter your password" 
                  required
                  aria-required="true"
                  aria-describedby="password-error"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 group-hover:border-gray-300 bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>

            <button 
              :disabled="loading" 
              type="submit" 
              :aria-label="loading ? 'Signing in...' : 'Sign in to your account'"
              class="w-full sm:w-auto py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              <span v-if="loading" class="inline-flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
              <span v-else>Sign In</span>
            </button>
          </form>

          <div v-if="error" role="alert" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600 flex items-center">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
              {{ error }}
            </p>
          </div>

          <div class="mt-6">
            <p class="text-xs text-gray-500 mb-3">
              API expects POST /auth/login → { accessToken, refreshToken }
            </p>
            <nav class="flex items-center gap-4 text-sm flex-wrap" aria-label="Quick navigation">
              <router-link 
                class="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded px-2 py-1" 
                to="/api"
                aria-label="Go to API Inspector"
              >
                🔧 API Inspector
              </router-link>
              <router-link 
                class="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded px-2 py-1" 
                to="/todos"
                aria-label="Go to Todos"
              >
                📝 View Todos
              </router-link>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
