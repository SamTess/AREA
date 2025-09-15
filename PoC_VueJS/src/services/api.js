import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const REFRESH_ENDPOINT = import.meta.env.VITE_REFRESH_ENDPOINT || '/auth/refresh'

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

api.interceptors.request.use(async (config) => {
  const auth = useAuthStore()
  config.headers = config.headers || {}
  if (config.headers['X-Skip-Auth']) {
    delete config.headers['X-Skip-Auth']
    config.__skipAuth = true
    return config
  }
  if (auth?.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`
  }
  // Refresh proactif si le token expire dans < 30s
  try {
    if (!config.__skipAuth && auth?.accessToken && auth?.refreshToken && auth.willExpireIn?.(30)) {
      if (isRefreshing) {
        return await new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            config.headers.Authorization = `Bearer ${token}`
            resolve(config)
          })
        })
      }
      isRefreshing = true
      const refreshed = await axios.post(
        `${API_URL}${REFRESH_ENDPOINT}`,
        { refreshToken: auth.refreshToken },
        { withCredentials: true }
      )
      const newAccess = refreshed.data?.accessToken
      const newRefresh = refreshed.data?.refreshToken || auth.refreshToken
      await auth.setTokens({ accessToken: newAccess, refreshToken: newRefresh })
      isRefreshing = false
      onRefreshed(newAccess)
      config.headers.Authorization = `Bearer ${newAccess}`
      return config
    }
  } catch (e) {
    isRefreshing = false
    queue = []
    auth.logout()
    return config
  }
  return config
})

let isRefreshing = false
let queue = []

function subscribeTokenRefresh(cb) {
  queue.push(cb)
}

function onRefreshed(token) {
  queue.forEach((cb) => cb(token))
  queue = []
}

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const { response, config } = error || {}
    if (!response) throw error

  if (response.status === 401 && !config.__isRetryRequest && !config.__skipAuth) {
      const auth = useAuthStore()

      if (!auth.refreshToken) {
        auth.logout()
        throw error
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            config.headers.Authorization = `Bearer ${token}`
            config.__isRetryRequest = true
            resolve(api(config))
          })
        })
      }

      try {
        isRefreshing = true
        const refreshed = await axios.post(
          `${API_URL}${REFRESH_ENDPOINT}`,
          { refreshToken: auth.refreshToken },
          { withCredentials: true }
        )
        const newAccess = refreshed.data?.accessToken
        const newRefresh = refreshed.data?.refreshToken || auth.refreshToken
        await auth.setTokens({ accessToken: newAccess, refreshToken: newRefresh })
        isRefreshing = false
        onRefreshed(newAccess)
        config.headers.Authorization = `Bearer ${newAccess}`
        config.__isRetryRequest = true
        return api(config)
      } catch (e) {
        isRefreshing = false
        queue = []
        auth.logout()
        throw e
      }
    }

    throw error
  }
)

export default api
