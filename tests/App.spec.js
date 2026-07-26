import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

vi.mock('firebase/auth', () => ({
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
}))

vi.mock('@/firebaseConfig', () => ({
  auth: {},
  db: {},
}))

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
}))

// Stub Vuetify CSS imports
vi.mock('vuetify/styles', () => ({}))

import App from '../src/App.vue'

let pinia
let router
let vuetify

beforeEach(() => {
  pinia = createPinia()
  setActivePinia(pinia)
  vuetify = createVuetify({ components, directives })
  router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div>Home</div>' } },
      { path: '/products', component: { template: '<div>Products</div>' } },
      { path: '/login', component: { template: '<div>Login</div>' } },
    ],
  })
})

describe('App.vue - mobile navigation', () => {
  it('renders the app bar with navigation title', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router, vuetify],
      },
    })
    expect(wrapper.text()).toContain('Product Showcase')
  })

  it('renders desktop navigation buttons', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router, vuetify],
      },
    })
    expect(wrapper.text()).toContain('Inicio')
    expect(wrapper.text()).toContain('Productos')
  })

  it('shows login and register buttons when not authenticated', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router, vuetify],
      },
    })
    expect(wrapper.text()).toContain('Login')
    expect(wrapper.text()).toContain('Register')
  })

  it('contains a navigation drawer element', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router, vuetify],
      },
    })
    const drawer = wrapper.findComponent({ name: 'VNavigationDrawer' })
    expect(drawer.exists()).toBe(true)
  })

  it('contains a nav icon button for mobile toggle', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router, vuetify],
      },
    })
    const navIcon = wrapper.findComponent({ name: 'VAppBarNavIcon' })
    expect(navIcon.exists()).toBe(true)
  })

  it('contains a theme toggle button with sun/moon icon', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router, vuetify],
      },
    })
    const html = wrapper.html()
    const hasSunOrMoon = html.includes('mdi-weather-sunny') || html.includes('mdi-weather-night')
    expect(hasSunOrMoon).toBe(true)
  })

  it('toggles theme when theme button is clicked', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router, vuetify],
      },
    })

    const initialTheme = vuetify.theme.global.name.value
    const btns = wrapper.findAllComponents({ name: 'VBtn' })
    const themeBtn = btns.find((b) => {
      const html = b.html()
      return html.includes('mdi-weather-sunny') || html.includes('mdi-weather-night')
    })

    if (themeBtn) {
      await themeBtn.trigger('click')
      const newTheme = vuetify.theme.global.name.value
      expect(newTheme).not.toBe(initialTheme)
    }
  })
})
