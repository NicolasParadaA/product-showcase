<template>
  <div>
    <v-container>
      <v-row justify="center">
        <v-col
          cols="12"
          sm="7"
          md="6"
          lg="5"
        >
          <v-form @submit.prevent="createOrEdit">
            <v-text-field
              v-model="name"
              label="Nombre"
              required
            />
            <v-text-field
              v-model="description"
              label="Descripción"
              required
            />
            <v-text-field
              v-model="image"
              label="Imagen"
              type="url"
              required
            />
            <v-text-field
              v-model="price"
              label="Precio"
              type="number"
              min="1"
              required
            />
            <v-select
              v-model="category"
              :items="categoriesStore.categories"
              item-title="name"
              item-value="name"
              label="Categoria"
              required
            />
            <div>
              <v-btn
                v-if="!editState"
                type="submit"
                color="primary"
                :disabled="!validForm"
                :loading="loading"
              >
                Crear
              </v-btn>
              <v-btn
                v-if="editState"
                type="button"
                color="secondary"
                :disabled="!validForm"
                @click="cancelEdit"
              >
                Cancelar edición
              </v-btn>
            </div>
          </v-form>
        </v-col>
      </v-row>
      <div v-if="productsStore.quantityProducts">
        <v-data-table
          :headers="headers"
          :items="productsStore.products"
        >
          <template #item.image="{ item }">
            <v-img
              :src="item.image"
              :alt="item - description"
              width="80"
            />
          </template>
          <template #item.actions="{ item }">
            <v-btn
              color="warning"
              class="me-2"
              @click="preEditProduct(item.id)"
            >
              Editar
            </v-btn>
            <v-btn
              color="error"
              @click="deleteProduct(item.id, item.name)"
            >
              Eliminar
            </v-btn>
          </template>
        </v-data-table>
      </div>

      <!-- Category management -->
      <v-card class="mt-6">
        <v-card-title>Gestionar Categorías</v-card-title>
        <v-card-text>
          <div class="d-flex flex-wrap ga-2 mb-4">
            <v-chip
              v-for="cat in categoriesStore.categories"
              :key="cat.id"
              closable
              @click:close="deleteCategory(cat.id, cat.name)"
            >
              {{ cat.name }}
            </v-chip>
            <span
              v-if="!categoriesStore.categories.length"
              class="text-medium-emphasis"
            >
              No hay categorías registradas.
            </span>
          </div>
          <v-form @submit.prevent="addCategory">
            <v-text-field
              v-model="newCategoryName"
              label="Nueva categoría"
              density="compact"
              class="mb-2"
              style="max-width: 300px"
            />
            <v-btn
              type="submit"
              color="primary"
              variant="tonal"
              :disabled="!newCategoryName.trim()"
            >
              Agregar
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script setup>
document.title = 'CRUD Products'
import { onMounted, ref, computed } from 'vue'
import Swal from 'sweetalert2'
import { useProductsStore } from '@/stores/products.store'
import { useCategoriesStore } from '@/stores/categories.store'

const productsStore = useProductsStore()
const categoriesStore = useCategoriesStore()

const name = ref('')
const image = ref('https://placehold.co/300x200.png')
const price = ref(1)
const category = ref('')
const description = ref('')
const idProduct = ref('')
const newCategoryName = ref('')

//ESTADO DE EDICIÓN
const editState = ref(false)
const loading = ref(false)

const headers = [
  { title: 'N°', key: 'index' },
  { title: 'Nombre', key: 'name' },
  { title: 'Imagen', key: 'image' },
  { title: 'Precio', key: 'price' },
  { title: 'Categoria', key: 'category' },
  { title: 'Acciones', key: 'actions' },
]

//COMPUTED
const validForm = computed(() => {
  let rulesForm =
    name.value &&
    image.value &&
    price.value &&
    category.value &&
    price.value > 0 &&
    description.value
  return rulesForm
})

//ACTIONS

const resetForm = () => {
  name.value = ''
  image.value = 'https://placehold.co/300x200.png'
  price.value = 1
  category.value = ''
  description.value = ''
  idProduct.value = ''
}

const addProduct = async () => {
  loading.value = true
  let respuesta = await productsStore.addProduct(
    name.value,
    image.value,
    price.value,
    category.value,
    description.value,
  )
  loading.value = false

  if (respuesta.success) {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: respuesta.success,
      showConfirmButton: false,
      timer: 2000,
    })
    resetForm()
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: respuesta.error,
    })
  }
}

const editProduct = async () => {
  loading.value = true
  let respuesta = await productsStore.editProduct(
    name.value,
    image.value,
    price.value,
    category.value,
    description.value,
    idProduct.value,
  )
  loading.value = false
  if (respuesta.success) {
    Swal.fire({
      icon: 'success',
      title: respuesta.success,
      showConfirmButton: false,
      timer: 2000,
    })
    resetForm()
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: respuesta.error,
    })
  }
}

const createOrEdit = () => {
  if (editState.value) {
    editProduct()
  } else {
    addProduct()
  }
}

const deleteProduct = async (id, name) => {
  Swal.fire({
    title: `Estás seguro que deseas eliminar el producto: ${name}?`,
    text: 'La eliminación no se puede revertir!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, eliminar!',
  })
    .then(async (result) => {
      if (result.isConfirmed) {
        let respuesta = await productsStore.deleteProduct(id, name)
        Swal.fire({
          title: 'Eliminado',
          text: respuesta.success,
          icon: 'success',
        })
      }
    })
    .catch((error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error,
      })
    })
}

const preEditProduct = async (id) => {
  const product = productsStore.findProduct(id)

  name.value = product.name
  image.value = product.image
  price.value = product.price
  category.value = product.category
  description.value = product.description
  idProduct.value = product.id
  editState.value = true
}

const cancelEdit = () => {
  editState.value = false
  resetForm()
}

// Category management
const addCategory = async () => {
  const name = newCategoryName.value.trim()
  if (!name) return

  const result = await categoriesStore.addCategory(name)
  if (result.success) {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: result.success,
      showConfirmButton: false,
      timer: 2000,
    })
    newCategoryName.value = ''
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: result.error,
    })
  }
}

const deleteCategory = async (id, name) => {
  Swal.fire({
    title: `¿Eliminar categoría "${name}"?`,
    text: 'Esta acción no se puede revertir.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
  }).then(async (result) => {
    if (result.isConfirmed) {
      const respuesta = await categoriesStore.deleteCategory(id)
      Swal.fire({
        title: 'Eliminada',
        text: respuesta.success,
        icon: 'success',
      })
    }
  })
}

onMounted(async () => {
  await Promise.all([
    productsStore.fetchProducts(),
    categoriesStore.fetchCategories(),
  ])
})
</script>

