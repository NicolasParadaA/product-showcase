import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user.store'
import { auth } from '@/firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'

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

  // On fresh page load, auth.currentUser is null because Firebase hasn't
  // restored the session from IndexedDB yet. The store is also empty.
  // Wait for the REAL auth state before making a redirect decision.
  if (!auth.currentUser && !userStore.isAuthenticated) {
    await new Promise((resolve) => {
      let callbackCount = 0
      let done = false
      const finish = () => {
        if (!done) {
          done = true
          clearTimeout(timer)
          resolve()
        }
      }
      // Don't wait forever — Firebase usually restores in <500 ms.
      const timer = setTimeout(finish, 1000)
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        callbackCount++
        if (user) {
          // Real user received — populate store and resolve.
          userStore.setUserFromAuth(user)
          finish()
          unsubscribe()
        } else if (callbackCount >= 2) {
          // Second null callback confirms there is no session.
          finish()
          unsubscribe()
        }
        // First null callback: keep waiting for the 2nd.
      })
    })
  }

  // Re-read after the wait — the store or auth.currentUser may have been set.
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
