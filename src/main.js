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
import { removeSpinner } from './utils/loading-spinner'

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

function mountApp() {
  if (mounted) return
  try {
    app.mount('#app')
  } catch (e) {
    console.error('Vue mount failed, forcing spinner removal:', e)
  }
  mounted = true
  removeSpinner()
}

onAuthStateChanged(auth, (firebaseUser) => {
  // Fire-and-forget: populate the store in the background.
  // Don't block app mount on Firestore — the router guard handles auth gating.
  if (firebaseUser) {
    userStore.setUserFromAuth(firebaseUser)
  } else {
    userStore.setUserFromAuth(null)
  }

  // Mount on ANY auth callback — real user or confirmed null.
  mountApp()
})

// Safety: mount after 1.5 s even if auth never resolves (offline / config error).
setTimeout(mountApp, 1500)

window.addEventListener('pageshow', (e) => {
  if (!e.persisted) return // Only for bfcache, NOT F5
  const user = auth.currentUser
  if (user) {
    userStore.setUserFromAuth(user)
  }
})
