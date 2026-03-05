<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container">
      <a class="navbar-brand" href="#">Product ShowCase</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav ms-auto">
          <RouterLink to="/" class="nav-link">Inicio</RouterLink>
          <RouterLink to="/products" class="nav-link">Productos</RouterLink>

          <RouterLink v-if="isAdmin" to="/admin/products" class="nav-link">Crud Productos</RouterLink>

          <template v-if="!isAuth">
            <RouterLink to="/login" class="nav-link">Login</RouterLink>
            <RouterLink to="/register" class="nav-link">Register</RouterLink>
          </template>

          <template v-else>
            <span class="nav-link">Hola, {{ displayName }}</span>
            <a class="nav-link" href="#" @click.prevent="onLogout">Logout</a>
          </template>
        </div>
      </div>
    </div>
  </nav>

  <RouterView />

</template>

<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { computed } from 'vue'
import { useUserStore } from './stores/user.store'
import { logout } from './services/auth'

const router = useRouter()
const userStore = useUserStore()

const isAuth = computed(() => userStore.isAuthenticated)
const isAdmin = computed(() => userStore.user?.role === 'admin')
const displayName = computed(() => {
  const u = userStore.user
  if (!u) return ''
  return `${u.firstname || ''} ${u.lastname || ''}`.trim() || u.email
})

async function onLogout() {
  try {
    await logout()
    userStore.clearUser()
    router.push({ name: 'login' })
  } catch (e) {
    console.error(e)
  }
}
</script>


<style scoped>
.router-link-active,
.router-link-exact-active {
  font-weight: 600;
}

</style
