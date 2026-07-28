import '@fontsource/roboto/100.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '@fontsource/roboto/900.css'

/* optional italic styles */
import '@fontsource/roboto/100-italic.css'
import '@fontsource/roboto/300-italic.css'
import '@fontsource/roboto/400-italic.css'
import '@fontsource/roboto/500-italic.css'
import '@fontsource/roboto/700-italic.css'
import '@fontsource/roboto/900-italic.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from './App.vue'
import router from './router'

import { auth } from './firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'
import { useUserStore } from './stores/user.store'

// Resolve default theme from localStorage or system preference
const savedTheme = localStorage.getItem('theme')
const defaultTheme = savedTheme
  || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme,
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

const userStore = useUserStore()
let mounted = false
let authCallbackCount = 0

onAuthStateChanged(auth, async (firebaseUser) => {
  authCallbackCount++

  // Wait for the 2nd callback (Firebase's real auth state).
  // The 1st is always null (before IndexedDB read).
  // The 2nd carries the real user or confirms no session.
  if (authCallbackCount < 2 && !mounted) {
    return
  }

  await userStore.setUserFromAuth(firebaseUser)
  if (!mounted) {
    app.mount('#app')
    mounted = true
  }
})

// Safety: mount after 3 s even if auth never resolves (offline / config error).
setTimeout(() => {
  if (!mounted) {
    app.mount('#app')
    mounted = true
  }
}, 3000)

window.addEventListener('pageshow', (e) => {
  if (!e.persisted) return // Only for bfcache, NOT F5
  const user = auth.currentUser
  if (user) {
    userStore.setUserFromAuth(user)
  }
})
