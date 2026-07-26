import { ref } from 'vue'
import { defineStore } from 'pinia'

import { db } from '@/firebaseConfig.js'
import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore'

const DEFAULT_CATEGORIES = [
  { id: 'default-hogar', name: 'Hogar' },
  { id: 'default-cocina', name: 'Cocina' },
  { id: 'default-jardin', name: 'Jardín' },
]

export const useCategoriesStore = defineStore('categories', () => {
  // State
  const categories = ref([])
  const isUsingDefaults = ref(false)

  // Actions
  async function fetchCategories() {
    try {
      const snap = await getDocs(collection(db, 'categories'))
      const firestoreCategories = snap.docs.map((d) => ({ id: d.id, ...d.data() }))

      if (firestoreCategories.length > 0) {
        categories.value = firestoreCategories
        isUsingDefaults.value = false
      } else {
        // Firestore empty — use defaults and try to seed them
        categories.value = [...DEFAULT_CATEGORIES]
        isUsingDefaults.value = true
        await seedDefaultCategories()
      }
    } catch (error) {
      console.error(error, 'Error al cargar categorías desde Firebase...')
      // Fallback to defaults on error
      categories.value = [...DEFAULT_CATEGORIES]
      isUsingDefaults.value = true
    }
  }

  async function seedDefaultCategories() {
    try {
      for (const cat of DEFAULT_CATEGORIES) {
        await addDoc(collection(db, 'categories'), { name: cat.name })
      }
      isUsingDefaults.value = false
    } catch {
      // Seed failed (likely security rules) — keep defaults, silent fail
    }
  }

  async function addCategory(name) {
    try {
      const docRef = await addDoc(collection(db, 'categories'), { name })
      categories.value.push({ id: docRef.id, name })
      isUsingDefaults.value = false
      return { success: 'Categoría creada con éxito.' }
    } catch (error) {
      console.error(error)
      // Fallback: add locally even if Firestore fails
      categories.value.push({ id: `local-${Date.now()}`, name })
      return { success: 'Categoría creada localmente.' }
    }
  }

  async function deleteCategory(id) {
    try {
      await deleteDoc(doc(db, 'categories', id))
      const category = categories.value.find((c) => c.id === id)
      const name = category ? category.name : ''
      categories.value = categories.value.filter((c) => c.id !== id)
      return { success: `Categoría '${name}', eliminada correctamente.` }
    } catch (error) {
      console.error(error)
      // Fallback: remove locally even if Firestore fails
      const category = categories.value.find((c) => c.id === id)
      const name = category ? category.name : ''
      categories.value = categories.value.filter((c) => c.id !== id)
      return { success: `Categoría '${name}', eliminada localmente.` }
    }
  }

  return {
    categories,
    isUsingDefaults,
    fetchCategories,
    addCategory,
    deleteCategory,
  }
})
