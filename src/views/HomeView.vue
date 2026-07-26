<template>
  <div>
    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
      size="64"
      class="ma-auto"
    />
    <main>
      <v-container>
        <!-- Welcome section -->
        <section class="text-center py-6">
          <h1 class="text-h4 font-weight-bold mb-2">
            Bienvenido a Product Showcase
          </h1>
          <p class="text-subtitle-1 text-medium-emphasis">
            Descubre nuestra selección de productos como hogar, electrónica y más.
          </p>
        </section>

        <v-divider
          :thickness="2"
          class="border-opacity-25 my-4"
          color="primary"
        />

        <template
          v-for="(category, index) in categoriesStore.categories"
          :key="category.id"
        >
          <section :id="category.name.toLowerCase()">
            <h2>Productos de {{ category.name }}</h2>
            <ListProducts
              :products="productsStore.filterProductsByCategory(category.name)"
              from="home"
            />
          </section>

          <v-divider
            v-if="index < categoriesStore.categories.length - 1"
            :thickness="4"
            class="border-opacity-25 my-4"
            color="success"
          />
        </template>
      </v-container>
    </main>
  </div>
</template>

<script setup>
import ListProducts from '@/components/ListProducts.vue'
import { useProductsStore } from '@/stores/products.store'
import { useCategoriesStore } from '@/stores/categories.store'
import { onMounted, ref } from 'vue'

const productsStore = useProductsStore()
const categoriesStore = useCategoriesStore()
const loading = ref(true)

onMounted(async () => {
  await Promise.all([
    productsStore.fetchProducts(),
    categoriesStore.fetchCategories(),
  ])
  loading.value = false
})
</script>

