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

describe('ProductDetailView', () => {
  it('shows not found message when product does not exist', async () => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/products/:id',
          name: 'product-detail',
          component: ProductDetailView,
        },
      ],
    })
    router.push({ name: 'product-detail', params: { id: 'nonexistent' } })
    await router.isReady()

    const wrapper = mount(ProductDetailView, {
      global: {
        plugins: [pinia, router, vuetify],
      },
    })

    await new Promise((r) => setTimeout(r, 10))

    expect(wrapper.text()).toContain('Producto no encontrado')
  })

  it('displays product details when product exists', async () => {
    const store = useProductsStore()
    store.products = [
      {
        id: 'abc123',
        name: 'Lampara LED',
        description: 'Lampara moderna de escritorio',
        price: 25000,
        category: 'Hogar',
        image: 'https://example.com/lamp.jpg',
      },
    ]

    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/products/:id',
          name: 'product-detail',
          component: ProductDetailView,
        },
      ],
    })
    router.push({ name: 'product-detail', params: { id: 'abc123' } })
    await router.isReady()

    const wrapper = mount(ProductDetailView, {
      global: {
        plugins: [pinia, router, vuetify],
      },
    })

    await new Promise((r) => setTimeout(r, 10))

    expect(wrapper.text()).toContain('Lampara LED')
    expect(wrapper.text()).toContain('Lampara moderna de escritorio')
    expect(wrapper.text()).toContain('25000')
    expect(wrapper.text()).toContain('Hogar')
  })

  it('calls fetchProducts when store is empty', async () => {
    const store = useProductsStore()
    const fetchSpy = vi.spyOn(store, 'fetchProducts').mockResolvedValue()

    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/products/:id',
          name: 'product-detail',
          component: ProductDetailView,
        },
      ],
    })
    router.push({ name: 'product-detail', params: { id: 'any-id' } })
    await router.isReady()

    mount(ProductDetailView, {
      global: {
        plugins: [pinia, router, vuetify],
      },
    })

    await new Promise((r) => setTimeout(r, 10))

    expect(fetchSpy).toHaveBeenCalled()
  })

  it('contains a back button linking to products', async () => {
    const store = useProductsStore()
    store.products = [
      {
        id: 'abc123',
        name: 'Test Product',
        description: 'Test',
        price: 100,
        category: 'Hogar',
        image: '',
      },
    ]

    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/products/:id',
          name: 'product-detail',
          component: ProductDetailView,
        },
        {
          path: '/products',
          name: 'products',
          component: { template: '<div>Products</div>' },
        },
      ],
    })
    router.push({ name: 'product-detail', params: { id: 'abc123' } })
    await router.isReady()

    const wrapper = mount(ProductDetailView, {
      global: {
        plugins: [pinia, router, vuetify],
      },
    })

    await new Promise((r) => setTimeout(r, 10))

    const backLink = wrapper.find('a[href="/products"]')
    expect(backLink.exists()).toBe(true)
  })
})
