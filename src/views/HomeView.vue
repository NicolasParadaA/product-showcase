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
        <section id="cocina">
          <h2>Productos de Cocina</h2>
          <ListProducts :products="productsStore.filterProductsByCategory('Cocina')" />
        </section>

        <v-divider
          :thickness="4"
          class="border-opacity-25 my-4"
          color="success"
        />

        <section id="hogar">
          <h2>Productos de Hogar</h2>
          <ListProducts :products="productsStore.filterProductsByCategory('Hogar')" />
        </section>

        <v-divider
          :thickness="4"
          class="border-opacity-25 my-4"
          color="success"
        />

        <section id="jardin">
          <h2>Productos de Jardín</h2>
          <ListProducts :products="productsStore.filterProductsByCategory('Jardín')" />
        </section>
      </v-container>
    </main>
  </div>
</template>

<script setup>
import ListProducts from '@/components/ListProducts.vue'
import { useProductsStore } from '@/stores/products.store'
import { onMounted, ref } from 'vue'

const productsStore = useProductsStore()
const loading = ref(true)
onMounted(async () => {
  await productsStore.fetchProducts()
  loading.value = false
})
</script>

