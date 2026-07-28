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

  // On fresh page load, auth.currentUser is null until Firebase reads IndexedDB.
  // Poll for auth.currentUser to become non-null (max 3s).
  if (!auth.currentUser) {
    const start = Date.now()
    while (!auth.currentUser && Date.now() - start < 3000) {
      await new Promise((r) => setTimeout(r, 50))
    }
  }

  // Populate store from auth.currentUser if available
  const firebaseUser = auth.currentUser
  if (firebaseUser && !userStore.user) {
    await userStore.setUserFromAuth(firebaseUser)
  }

  const isAuth = userStore.isAuthenticated || !!firebaseUser

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
