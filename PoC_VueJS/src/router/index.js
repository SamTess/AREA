import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const Login = () => import('@/views/LoginView.vue')
const Todos = () => import('@/views/TodosView.vue')
const ApiInspector = () => import('@/views/ApiInspectorView.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/todos' },
    { path: '/login', name: 'login', component: Login, meta: { public: true } },
    { path: '/todos', name: 'todos', component: Todos, meta: { public: true } },
    { path: '/todos-local', name: 'todos-local', component: TodosLocal, meta: { public: true } },
    { path: '/api', name: 'api', component: ApiInspector, meta: { public: true } },
    { path: '/:pathMatch(.*)*', redirect: '/todos' },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!to.meta.public && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})

export default router
