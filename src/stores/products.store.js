import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { db } from '@/firebaseConfig.js'

import { collection, getDoc, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore'

export const useProductsStore = defineStore('products', () => {
  //ESTADOS

  const categories = ref([
    { id: 1, name: 'Hogar' },
    { id: 2, name: 'Cocina' },
    { id: 3, name: 'Jardín' },
  ]);

  const products = ref([]);

  //GETTERS -> PROPIEDADES COMPUTADAS
  const quantityProducts = computed(() => products.value.length);

  //MÉTODOS -> ACTIONS

  function findProduct(id) {
    return products.value.find((p) => p.id == id)
  }

  //MÉTODOS CRUD FIRESTORE
  async function fetchProducts() {
    try {
      const snap = await getDocs(collection(db, 'products'))

      products.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    } catch (error) {
      console.log(error)
      console.log('Error al cargar los datos de firebase...')
    }
  }

  async function addProduct(name, image, price, category, description) {
    try {
      let data = { name, image, price, category, description }
      const docRef = await addDoc(collection(db, 'products'), data)

      products.value.push({ id: docRef.id, ...data })

      return { success: 'Producto creado con éxito.' }
    } catch (error) {
      console.log(error)

      return { error: 'Error al intentar agregar el producto.' }
    }
  }

  async function deleteProduct(id, name) {
    try {
      await deleteDoc(doc(db, 'products', id))

      let indexProduct = products.value.findIndex((p) => p.id == id)
      products.value.splice(indexProduct, 1)

      return { success: `Producto '${name}', eliminado correctamente.` }
    } catch (error) {
      console.log(error)

      return { error: `Error al intentar eliminar el producto ${name}.` }
    }
  }

  async function editProduct(name, image, price, category, description, id) {
    try {
      let data = { name, image, price, category, description }

      await updateDoc(doc(db, 'products', id), data)

      let indexProduct = products.value.findIndex((p) => p.id == id)

      products.value[indexProduct] = { ...data, id }

      return { success: 'Producto editado con éxito.' }
    } catch (error) {
      console.log(error)

      return { error: 'Error al intentar editar el producto.' }
    }
  }


  function filterProductsByCategory(category){
    return products.value.filter((product) => product.category.toLowerCase() == category.toLowerCase())
  };


  

  //EXPORTACIÓN DE LO QUE QUEREMOS DEJAR PÚBLICO
  return {
    categories,
    products,
    quantityProducts,
    filterProductsByCategory,
    fetchProducts,
    addProduct,
    deleteProduct,
    findProduct,
    editProduct,
  }
})
