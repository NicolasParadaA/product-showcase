<template>
    <div class="row justify-content-evenly g-3">
        <div class="col-12 col-sm-6 col-md-4 col-lg-3" v-for="product in products" :key="product.id">
            <ProductCard :product />
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import ProductCard from './ProductCard.vue';

defineProps(["products"])

</script>

<style lang="scss" scoped></style>