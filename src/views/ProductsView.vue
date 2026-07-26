<template>
  <div>
    <v-container>
      <div>
        <p>
          Filtrar por categoria:
          <v-select
            v-model="filterCategory"
            :items="productsStore.categories"
            item-title="name"
            item-value="name"
            label="Todas las Categorias"
            clearable
          />
        </p>
        <p>
          Buscar:
          <v-text-field
            v-model="filterName"
            label="Buscar"
          />
        </p>
        <p>Cantidad de productos encontrados: {{ quantityProducts }}</p>
      </div>
      <section>
        <v-row v-if="loadingProducts">
          <v-col
            v-for="n in 4"
            :key="n"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-skeleton-loader type="card" />
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col
            v-for="product in filterProducts"
            :key="product.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <ProductCard :product="product" />
          </v-col>
        </v-row>
      </section>
    </v-container>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import ProductCard from '@/components/ProductCard.vue'

import { useProductsStore } from '@/stores/products.store'

const productsStore = useProductsStore()

const products = ref([])
const loadingProducts = ref(true)

const filterCategory = ref('')
const filterName = ref('')

const filterProducts = computed(() => {
  let productsFiltered = products.value

  if (filterCategory.value) {
    productsFiltered = productsFiltered.filter(
      (product) => product.category === filterCategory.value,
    )
  }

  if (filterName.value) {
    let name = filterName.value.toLowerCase()
    productsFiltered = productsFiltered.filter((product) =>
      product.name.toLowerCase().includes(name),
    )
  }

  return productsFiltered
})

const quantityProducts = computed(() => filterProducts.value.length)

onMounted(async () => {
  loadingProducts.value = true
  await productsStore.fetchProducts()
  products.value = productsStore.products
  loadingProducts.value = false
})
</script>

