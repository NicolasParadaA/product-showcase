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
            <ProductCard
              :product="product"
              from="products"
              :from-query="{
                ...(filterCategory ? { filterCategory } : {}),
                ...(filterName ? { filterName } : {}),
              }"
            />
          </v-col>
        </v-row>
      </section>
    </v-container>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import ProductCard from '@/components/ProductCard.vue'
import { normalizeText } from '@/utils/search.js'

import { useProductsStore } from '@/stores/products.store'

const route = useRoute()
const productsStore = useProductsStore()

const products = ref([])
const loadingProducts = ref(true)

const filterCategory = ref(route.query.filterCategory || '')
const filterName = ref(route.query.filterName || '')

const filterProducts = computed(() => {
  let productsFiltered = products.value

  if (filterCategory.value) {
    productsFiltered = productsFiltered.filter(
      (product) => product.category === filterCategory.value,
    )
  }

  if (filterName.value) {
    const name = normalizeText(filterName.value)
    productsFiltered = productsFiltered.filter((product) =>
      normalizeText(product.name).includes(name),
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

