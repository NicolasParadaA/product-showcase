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

// --- bfcache detection via pagehide + sessionStorage ---
// pagehide fires synchronously BEFORE the page is stored in bfcache,
// so sessionStorage persists across the restoration. This is the only
// reliable way to know we are restoring from bfcache, because
// onAuthStateChanged may fire BEFORE pageshow.
window.addEventListener('pagehide', () => {
  sessionStorage.setItem('__bfcache_pending', '1')
})
const isBfcacheRestore = sessionStorage.getItem('__bfcache_pending') === '1'
if (isBfcacheRestore) {
  sessionStorage.removeItem('__bfcache_pending')
}

const userStore = useUserStore()
let mounted = false
let authCallbackCount = 0

onAuthStateChanged(auth, async (firebaseUser) => {
  authCallbackCount++

  // 1) BFCACHE: block the intermediate null that Firebase fires while
  //    re-validating the session. The store keeps its frozen value.
  if (isBfcacheRestore && firebaseUser === null) {
    if (!mounted) {
      app.mount('#app')
      mounted = true
    }
    return
  }

  // 2) FRESH LOAD: the first onAuthStateChanged callback is always null
  //    (Firebase is still reading from IndexedDB). Don't mount yet —
  //    wait for the 2nd callback which carries the real auth state.
  if (!firebaseUser && authCallbackCount < 2 && !mounted) {
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

// After bfcache restoration, re-sync from auth.currentUser in case
// onAuthStateChanged didn't fire with the user (Firebase may consider
// the in-memory state already correct and skip the callback).
window.addEventListener('pageshow', (e) => {
  if (!e.persisted) return
  const user = auth.currentUser
  if (user) {
    userStore.setUserFromAuth(user)
  }
})
