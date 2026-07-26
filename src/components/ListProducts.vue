<template>
  <v-row>
    <v-col
      v-for="product in products"
      :key="product.id"
      cols="12"
      sm="6"
      md="4"
      lg="3"
    >
      <ProductCard
        :product="product"
        :from="from"
      />
    </v-col>
  </v-row>
</template>

<script setup>
import ProductCard from './ProductCard.vue'

defineProps({
  products: {
    type: Array,
    required: true,
  },
  from: {
    type: String,
    default: 'products',
  },
})
</script>

