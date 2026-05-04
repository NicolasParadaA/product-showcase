<template>
  <!-- envoltorio vuetify -->
  <v-app>
    <!-- barra de navegacion -->
    <v-app-bar>
      <v-app-bar-title>Product Showcase</v-app-bar-title>
      <v-spacer></v-spacer>

      <v-btn to="/">Inicio</v-btn>
      <v-btn to="/products">Productos</v-btn>
      <v-btn v-if="isAdmin" to="/admin/products">Crud Productos</v-btn>

      <template v-if="!isAuth">
        <v-btn to="/login">Login</v-btn>
        <v-btn to="/register">Register</v-btn>
      </template>

      <template v-else>
        <span>Hola, {{ displayName }}</span>
        <v-btn @click="onLogout">Logout</v-btn>
      </template>
    </v-app-bar>
    <v-main>

      <RouterView />
    </v-main>
  </v-app>

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


<style scoped></style
