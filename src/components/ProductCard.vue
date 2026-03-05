<template>
    <div>

        <div class="card mx-auto w-100">
            <img :src="product.image" class="card-img-top" :alt="product.name">
            <div class="card-body">
                <h5 class="card-title">{{ product.name }}</h5>
                <p class="card-text">{{ product.description }}</p>
                <p class="card-text">Precio: {{ product.price }}</p>
            </div>
        </div>

    </div>
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
.card-img-top {
    aspect-ratio: 3/2;
}
</style>