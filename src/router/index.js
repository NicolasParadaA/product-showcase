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

  // On fresh page load, main.js calls setUserFromAuth() which fires an
  // async Firestore request. We must wait for THAT request to complete
  // (not start our own). Poll for the store to be populated.
  const start = Date.now()
  while (Date.now() - start < 5000) {
    // Store populated by main.js — we're good
    if (userStore.isAuthenticated) break
    // auth.currentUser exists but store still empty — main.js is still
    // fetching the Firestore profile. Wait a bit more.
    if (auth.currentUser) {
      await new Promise((r) => setTimeout(r, 50))
      continue
    }
    // auth.currentUser is null — Firebase hasn't restored yet. Wait.
    await new Promise((r) => setTimeout(r, 50))
  }

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
