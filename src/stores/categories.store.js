import { ref } from 'vue'
import { defineStore } from 'pinia'

import { db } from '@/firebaseConfig.js'
import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore'

export const useCategoriesStore = defineStore('categories', () => {
  // State
  const categories = ref([])

  // Actions
  async function fetchCategories() {
    try {
      const snap = await getDocs(collection(db, 'categories'))
      categories.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    } catch (error) {
      console.error(error, 'Error al cargar categorías desde Firebase...')
    }
  }

  async function addCategory(name) {
    try {
      const docRef = await addDoc(collection(db, 'categories'), { name })
      categories.value.push({ id: docRef.id, name })
      return { success: 'Categoría creada con éxito.' }
    } catch (error) {
      console.error(error)
      return { error: 'Error al intentar agregar la categoría.' }
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
      return { error: 'Error al intentar eliminar la categoría.' }
    }
  }

  return {
    categories,
    fetchCategories,
    addCategory,
    deleteCategory,
  }
})
