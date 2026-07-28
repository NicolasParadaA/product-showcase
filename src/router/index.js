import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user.store'
import { auth } from '@/firebaseConfig'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/ProductsView.vue'),
    },
    {
      path: '/products/:id',
      name: 'product-detail',
      component: () => import('../views/ProductDetailView.vue'),
    },
    {
      path: '/admin/products',
      name: 'crud-products',
      component: () => import('../views/admin/ProductsCrudView.vue'),
      meta: { requiresAuth: true, requiresRole: 'admin' },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
  ],
})

router.beforeEach(async (to, _from) => {
  const requiresAuth = to.meta?.requiresAuth
  const requiresRole = to.meta?.requiresRole

  // Fast path: public routes need no auth check
  if (!requiresAuth && !requiresRole) return true

  const userStore = useUserStore()

  // If the store already has the user, no need to wait
  if (userStore.isAuthenticated) {
    if (requiresRole && userStore.user?.role !== requiresRole) {
      return { name: 'home' }
    }
    return true
  }

  // main.js fires setUserFromAuth() fire-and-forget on every auth callback.
  // The Firestore request may still be in-flight. Poll for the store to be
  // populated (max 3 s) — don't create our own listener.
  const start = Date.now()
  while (Date.now() - start < 3000) {
    if (userStore.isAuthenticated) break
    await new Promise((r) => setTimeout(r, 50))
  }

  // After polling, check auth via store or fallback to auth.currentUser
  const isAuth = userStore.isAuthenticated || !!auth.currentUser

  if (requiresAuth && !isAuth) {
    return { name: 'login' }
  }

  if (requiresRole) {
    const role = userStore.user?.role || null
    if (role !== requiresRole) return { name: 'home' }
  }

  return true
})

export default router
