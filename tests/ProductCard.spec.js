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

import ProductCard from '../src/components/ProductCard.vue'
import ListProducts from '../src/components/ListProducts.vue'
import ProductDetailView from '../src/views/ProductDetailView.vue'
import { useProductsStore } from '../src/stores/products.store'

let pinia
let router
let vuetify

beforeEach(() => {
  pinia = createPinia()
  setActivePinia(pinia)
  vuetify = createVuetify({ components, directives })
})

describe('Router - product detail route', () => {
  it('navigates to product detail view for /products/:id', async () => {
    const store = useProductsStore()
    store.products = [
      { id: 'xyz789', name: 'Silla', description: 'Silla ergonomica', price: 89000, category: 'Hogar', image: '' },
    ]

    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/products/:id', name: 'product-detail', component: ProductDetailView },
      ],
    })

    await router.push({ name: 'product-detail', params: { id: 'xyz789' } })
    await router.isReady()

    const wrapper = mount(ProductDetailView, {
      global: { plugins: [pinia, router, vuetify] },
    })

    await new Promise((r) => setTimeout(r, 10))

    expect(wrapper.text()).toContain('Silla')
  })
})

describe('ProductCard - clickable', () => {
  it('wraps card content in a router-link to /products/:id', () => {
    const product = { id: 'abc', name: 'Test', description: 'Desc', price: 100, category: 'Hogar', image: '' }

    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/products/:id', component: { template: '<div />' } },
      ],
    })

    const wrapper = mount(ProductCard, {
      props: { product },
      global: { plugins: [pinia, router, vuetify] },
    })

    const link = wrapper.find('a[href^="/products/abc"]')
    expect(link.exists()).toBe(true)
  })
})

describe('ListProducts - renders product cards with links', () => {
  it('renders each product as a clickable card', () => {
    const products = [
      { id: 'p1', name: 'Prod 1', description: 'D1', price: 10, category: 'A', image: '' },
      { id: 'p2', name: 'Prod 2', description: 'D2', price: 20, category: 'B', image: '' },
    ]

    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/products/:id', component: { template: '<div />' } },
      ],
    })

    const wrapper = mount(ListProducts, {
      props: { products },
      global: { plugins: [pinia, router, vuetify] },
    })

    const links = wrapper.findAll('a[href^="/products/"]')
    expect(links.length).toBe(2)
  })
})
