<template>

    <v-row>
        <v-col cols="12" sm="6" md="4" lg="3" v-for="product in products" :key="product.id">
            <ProductCard :product="product" />
        </v-col>
    </v-row>

</template>

<script setup>
import { defineProps } from 'vue';
import ProductCard from './ProductCard.vue';

defineProps(["products"])

</script>

<style lang="scss" scoped></style>