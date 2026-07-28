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
let restoringFromBfcache = false

onAuthStateChanged(auth, async (firebaseUser) => {
  // During bfcache restoration, onAuthStateChanged may fire with null
  // BEFORE Firebase has finished re-validating the session.
  // Ignore that intermediate null and wait for the real result.
  if (restoringFromBfcache && firebaseUser === null) {
    return
  }
  await userStore.setUserFromAuth(firebaseUser)
  if (!mounted) {
    app.mount('#app')
    mounted = true
  }
})

// Re-sync the user store after bfcache restoration.
// Firebase may not have finished restoring the session at pageshow time,
// so we retry with a short delay until auth.currentUser becomes available.
window.addEventListener('pageshow', (e) => {
  if (!e.persisted) return

  restoringFromBfcache = true
  const currentUser = auth.currentUser

  if (currentUser) {
    userStore.setUserFromAuth(currentUser)
  } else {
    // Firebase hasn't restored the session yet — poll briefly.
    let attempts = 0
    const interval = setInterval(() => {
      attempts++
      const user = auth.currentUser
      if (user || attempts >= 20) { // max ~2 seconds
        clearInterval(interval)
        restoringFromBfcache = false
        if (user) {
          userStore.setUserFromAuth(user)
        }
      }
    }, 100)
  }

  // Safety: clear the flag after a timeout even if auth never resolves.
  setTimeout(() => { restoringFromBfcache = false }, 3000)
})
