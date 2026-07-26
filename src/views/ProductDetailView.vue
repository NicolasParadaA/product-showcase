<template>
  <v-container>
    <v-btn
      variant="outlined"
      color="primary"
      to="/products"
      class="mb-4"
    >
      ← Volver a Productos
    </v-btn>

    <div v-if="product">
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <v-img
            :src="product.image || 'https://placehold.co/600x400?text=Sin+imagen'"
            :alt="product.name"
            aspect-ratio="3/2"
            cover
          />
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <h1 class="text-h4 mb-2">
            {{ product.name }}
          </h1>
          <v-chip
            class="mb-4"
            color="primary"
          >
            {{ product.category }}
          </v-chip>
          <p class="text-body-1 mb-4">
            {{ product.description }}
          </p>
          <p class="text-h5 font-weight-bold text-primary">
            ${{ product.price }}
          </p>
        </v-col>
      </v-row>
    </div>

    <div v-else class="text-center py-16">
      <v-icon
        size="64"
        color="grey"
      >
        mdi-alert-circle-outline
      </v-icon>
      <h2 class="text-h5 mt-4 text-grey">
        Producto no encontrado
      </h2>
      <v-btn
        to="/products"
        variant="outlined"
        color="primary"
        class="mt-4"
      >
        Ver productos
      </v-btn>
    </div>
  </v-container>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products.store'

const route = useRoute()
const productsStore = useProductsStore()

const product = computed(() => productsStore.findProduct(route.params.id))

onMounted(async () => {
  if (productsStore.products.length === 0) {
    await productsStore.fetchProducts()
  }
})
</script>
