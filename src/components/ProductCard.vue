<template>

    <v-card class="product-card" hover>
        <v-img :src="product.image" :alt="product.name" aspect-ratio="3/2" height="200px"></v-img>
        <v-card-title>{{ product.name }}</v-card-title>
        <v-card-text>
            <p>{{ product.description }}</p>
            <p class="text-h6 font-weight-bold text-primary">Precio: {{ product.price }}</p>
        </v-card-text>
    </v-card>
    
</template>

<script setup>

const props = defineProps({
    product: {
        type: Object,
        required: true
    }
})

</script>


<style lang="css" scoped>

.product-card {
    transition: transform 0.3s ease;
}

.product-card:hover {
    transform: translateY(-5px)
}

</style>