<template>
  <v-app>
    <!-- Mobile nav drawer -->
    <v-navigation-drawer
      v-model="drawer"
      temporary
    >
      <v-list nav>
        <v-list-item
          to="/"
          title="Inicio"
          @click="drawer = false"
        />
        <v-list-item
          to="/products"
          title="Productos"
          @click="drawer = false"
        />
        <template v-if="!isAuth">
          <v-list-item
            to="/login"
            title="Login"
            @click="drawer = false"
          />
          <v-list-item
            to="/register"
            title="Register"
            @click="drawer = false"
          />
        </template>
        <template v-else>
          <v-list-item
            title="Logout"
            @click="onLogout"
          />
        </template>
      </v-list>
    </v-navigation-drawer>

    <!-- App bar -->
    <v-app-bar>
      <v-app-bar-nav-icon
        class="d-md-none"
        @click="drawer = !drawer"
      />
      <v-app-bar-title>Product Showcase</v-app-bar-title>
      <v-spacer />

      <!-- Desktop nav (hidden on mobile) -->
      <div class="d-none d-md-flex">
        <v-btn to="/">
          Inicio
        </v-btn>
        <v-btn to="/products">
          Productos
        </v-btn>
        <v-btn
          v-if="isAdmin"
          to="/admin/products"
        >
          Crud Productos
        </v-btn>

        <template v-if="!isAuth">
          <v-btn to="/login">
            Login
          </v-btn>
          <v-btn to="/register">
            Register
          </v-btn>
        </template>

        <template v-else>
          <span>Hola, {{ displayName }}</span>
          <v-btn @click="onLogout">
            Logout
          </v-btn>
        </template>
      </div>

      <!-- Theme toggle (visible on all sizes) -->
      <v-btn
        icon
        @click="toggleTheme"
      >
        <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import { useUserStore } from './stores/user.store'
import { logout } from './services/auth'

const router = useRouter()
const userStore = useUserStore()
const theme = useTheme()

const drawer = ref(false)

const isAuth = computed(() => userStore.isAuthenticated)
const isAdmin = computed(() => userStore.user?.role === 'admin')
const displayName = computed(() => {
  const u = userStore.user
  if (!u) return ''
  return `${u.firstname || ''} ${u.lastname || ''}`.trim() || u.email
})

const isDark = computed(() => theme.global.current.value.dark)

function toggleTheme() {
  const next = isDark.value ? 'light' : 'dark'
  theme.global.name.value = next
  localStorage.setItem('theme', next)
}

async function onLogout() {
  try {
    await logout()
    userStore.clearUser()
    drawer.value = false
    router.push({ name: 'login' })
  } catch {
    // logout failed silently
  }
}
</script>
