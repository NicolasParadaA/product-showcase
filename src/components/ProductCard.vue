<template>
  <router-link
    :to="detailRoute"
    class="text-decoration-none"
  >
    <v-card
      class="product-card"
      hover
    >
      <v-img
        :src="imgSrc"
        :alt="product.name"
        aspect-ratio="3/2"
        height="200px"
        @error="onImgError"
      />
      <v-card-title>{{ product.name }}</v-card-title>
      <v-card-text>
        <p>{{ product.description }}</p>
        <p class="text-h6 font-weight-bold text-primary">
          Precio: {{ product.price }}
        </p>
      </v-card-text>
    </v-card>
  </router-link>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  from: {
    type: String,
    default: 'products',
  },
  fromQuery: {
    type: Object,
    default: () => ({}),
  },
})

const fallback = 'https://placehold.co/300x200?text=Sin+imagen'
const imgSrc = ref(props.product.image)

const detailRoute = computed(() => {
  const query = { from: props.from, ...props.fromQuery }
  return { path: `/products/${props.product.id}`, query }
})

function onImgError() {
  imgSrc.value = fallback
}
</script>

<style lang="css" scoped>
.product-card {
  transition: transform 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
}
</style>
