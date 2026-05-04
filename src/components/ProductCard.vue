<template>

    <v-card>
        <v-img :src="product.image" :alt="product.name" aspect-ratio="3/2" height="200px"></v-img>
        <v-card-title>{{ product.name }}</v-card-title>
        <v-card-text>
            <p>{{ product.description }}</p>
            <p>Precio: {{ product.price }}</p>
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

</style>