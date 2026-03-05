import { setActivePinia, createPinia } from 'pinia'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// mock firestore functions
vi.mock('firebase/firestore', () => {
  return {
    collection: vi.fn(() => 'collectionRef'),
    getDoc: vi.fn(),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    doc: vi.fn(() => 'docRef'),
    getDocs: vi.fn(),
  }
})

// mock db export
vi.mock('@/firebaseConfig.js', () => ({
  db: {},
}))

import { useProductsStore } from '../../src/stores/products.store'

let store

beforeEach(() => {
  setActivePinia(createPinia())
  store = useProductsStore()
  store.products = []
  // reset mocks
  vi.clearAllMocks()
})

describe('products store', () => {
  it('should add a product to firestore and then delete it', async () => {
    const { addDoc, deleteDoc } = await import('firebase/firestore')

    // arrange mocks
    addDoc.mockResolvedValue({ id: 'prod1' })
    deleteDoc.mockResolvedValue()

    const name = 'Test Product'
    const image = 'test.jpg'
    const price = 123
    const category = 'Hogar'
    const description = 'A test item.'

    // act - add
    const addResult = await store.addProduct(
      name,
      image,
      price,
      category,
      description,
    )

    // assertions for add
    expect(addDoc).toHaveBeenCalledWith('collectionRef', {
      name,
      image,
      price,
      category,
      description,
    })
    expect(store.products).toHaveLength(1)
    expect(store.products[0]).toEqual({
      id: 'prod1',
      name,
      image,
      price,
      category,
      description,
    })
    expect(addResult).toEqual({ success: 'Producto creado con éxito.' });

    // act - delete
    const deleteResult = await store.deleteProduct('prod1', name)

    // assertions for delete
    const { doc } = await import('firebase/firestore')
    expect(doc).toHaveBeenCalledWith({}, 'products', 'prod1')
    expect(deleteDoc).toHaveBeenCalledWith('docRef')
    expect(store.products).toHaveLength(0)
    expect(deleteResult).toEqual({ success: `Producto '${name}', eliminado correctamente.` })
  })
})
