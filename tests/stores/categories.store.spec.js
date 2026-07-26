import { setActivePinia, createPinia } from 'pinia'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Mock Firestore functions
vi.mock('firebase/firestore', () => {
  return {
    collection: vi.fn(() => 'collectionRef'),
    addDoc: vi.fn(),
    deleteDoc: vi.fn(),
    doc: vi.fn(() => 'docRef'),
    getDocs: vi.fn(),
  }
})

// Mock db export
vi.mock('@/firebaseConfig.js', () => ({
  db: {},
}))

import { useCategoriesStore } from '../../src/stores/categories.store'

let store

beforeEach(() => {
  setActivePinia(createPinia())
  store = useCategoriesStore()
  store.categories = []
  vi.clearAllMocks()
})

describe('categories store', () => {
  it('should fetch categories from Firestore and populate store', async () => {
    const { getDocs } = await import('firebase/firestore')

    // Arrange mock data
    const mockDocs = [
      { id: 'cat1', name: 'Cocina' },
      { id: 'cat2', name: 'Hogar' },
      { id: 'cat3', name: 'Jardín' },
    ]
    getDocs.mockResolvedValue({
      docs: mockDocs.map((d) => ({
        id: d.id,
        data: () => ({ name: d.name }),
      })),
    })

    // Act
    await store.fetchCategories()

    // Assert
    expect(getDocs).toHaveBeenCalledWith('collectionRef')
    expect(store.categories).toHaveLength(3)
    expect(store.categories[0]).toEqual({ id: 'cat1', name: 'Cocina' })
    expect(store.categories[1]).toEqual({ id: 'cat2', name: 'Hogar' })
    expect(store.categories[2]).toEqual({ id: 'cat3', name: 'Jardín' })
  })

  it('should handle empty Firestore gracefully', async () => {
    const { getDocs } = await import('firebase/firestore')

    // Arrange — empty collection
    getDocs.mockResolvedValue({ docs: [] })

    // Act
    await store.fetchCategories()

    // Assert — no seed, just empty
    expect(store.categories).toHaveLength(0)
  })

  it('should add a category to Firestore and store', async () => {
    const { addDoc } = await import('firebase/firestore')

    // Arrange
    addDoc.mockResolvedValue({ id: 'cat4' })

    // Act
    const result = await store.addCategory('Electrónica')

    // Assert
    expect(addDoc).toHaveBeenCalledWith('collectionRef', { name: 'Electrónica' })
    expect(store.categories).toHaveLength(1)
    expect(store.categories[0]).toEqual({ id: 'cat4', name: 'Electrónica' })
    expect(result).toEqual({ success: 'Categoría creada con éxito.' })
  })

  it('should delete a category from Firestore and store', async () => {
    const { deleteDoc, doc } = await import('firebase/firestore')

    // Arrange — pre-populate store
    store.categories = [{ id: 'cat1', name: 'Cocina' }]
    deleteDoc.mockResolvedValue()

    // Act
    const result = await store.deleteCategory('cat1')

    // Assert
    expect(doc).toHaveBeenCalledWith({}, 'categories', 'cat1')
    expect(deleteDoc).toHaveBeenCalledWith('docRef')
    expect(store.categories).toHaveLength(0)
    expect(result).toEqual({ success: "Categoría 'Cocina', eliminada correctamente." })
  })

  it('should propagate fetchCategories error', async () => {
    const { getDocs } = await import('firebase/firestore')

    // Arrange
    getDocs.mockRejectedValue(new Error('Firestore error'))

    // Act & Assert — errors propagate
    await expect(store.fetchCategories()).rejects.toThrow('Firestore error')
  })

  it('should propagate addCategory error', async () => {
    const { addDoc } = await import('firebase/firestore')

    // Arrange
    addDoc.mockRejectedValue(new Error('Permission denied'))

    // Act & Assert — errors propagate
    await expect(store.addCategory('Fail')).rejects.toThrow('Permission denied')
    expect(store.categories).toHaveLength(0)
  })

  it('should propagate deleteCategory error', async () => {
    const { deleteDoc } = await import('firebase/firestore')

    // Arrange
    store.categories = [{ id: 'cat1', name: 'Cocina' }]
    deleteDoc.mockRejectedValue(new Error('Permission denied'))

    // Act & Assert — errors propagate
    await expect(store.deleteCategory('cat1')).rejects.toThrow('Permission denied')
    expect(store.categories).toHaveLength(1) // unchanged
  })
})
