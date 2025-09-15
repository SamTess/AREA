import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

const STORAGE_KEY = import.meta.env.VITE_JWT_STORAGE_KEY || 'poc_jwt'

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { accessToken: null, refreshToken: null, user: null }
    return JSON.parse(raw)
  } catch (_) {
    return { accessToken: null, refreshToken: null, user: null }
  }
}

function persist(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    accessToken: state.accessToken,
    refreshToken: state.refreshToken,
    user: state.user,
  }))
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: loadPersisted().accessToken,
    refreshToken: loadPersisted().refreshToken,
    user: loadPersisted().user,
  }),
  getters: {
    isAuthenticated: (s) => !!s.accessToken,
    expiresAt: (s) => {
      try {
        const payload = s.accessToken ? jwtDecode(s.accessToken) : null
        return payload?.exp ? payload.exp * 1000 : null
      } catch (_) {
        return null
      }
    },
    isExpired() {
      const ts = this.expiresAt
      return ts ? Date.now() >= ts : true
    },
    willExpireIn: (s) => (seconds) => {
      try {
        const payload = s.accessToken ? jwtDecode(s.accessToken) : null
        const expMs = payload?.exp ? payload.exp * 1000 : null
        if (!expMs) return true
        return Date.now() >= expMs - seconds * 1000
      } catch (_) {
        return true
      }
    },
    accessPayload: (s) => {
      try {
        return s.accessToken ? jwtDecode(s.accessToken) : null
      } catch (_) {
        return null
      }
    },
  },
  actions: {
    async setTokens({ accessToken, refreshToken }) {
      this.accessToken = accessToken || null
      this.refreshToken = refreshToken || null
      // Décoder le user minimal depuis l'access token si présent
      try {
        this.user = this.accessToken ? jwtDecode(this.accessToken)?.user || null : null
      } catch (_) {
        this.user = null
      }
      persist(this)
    },
    async login({ accessToken, refreshToken }) {
      await this.setTokens({ accessToken, refreshToken })
    },
    async logout() {
      this.accessToken = null
      this.refreshToken = null
      this.user = null
      persist(this)
    },
  },
})
