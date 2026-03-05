<template>
    <div>

        <HeaderComp>Nuestros productos</HeaderComp>

        <main class="container">
            <div>
                <p>
                    Filtar por categoría: 
                    <select v-model="filterCategory">
                        <option value="">Todas las categorías</option>
                        <option :value="category.name" v-for="category in productsStore.categories" :key="category.id">
                            {{ category.name }}
                        </option>
                    </select>
                </p>

                <p>
                    Buscar: 
                    <input type="text" v-model="filterName">
                </p>
                <p>Cantidad de productos encontrados: {{ quantityProducts }}</p>
            </div>
            <section>
                <div class="row justify-content-evenly g-3">
                    <div class="col-12 col-sm-6 col-md-4 col-lg-3" v-for="product in filterProducts"
                        :key="product.id">
                        <ProductCard :product />
                    </div>
                </div>
            </section>
        </main>

    </div>
</template>

<script setup>
import HeaderComp from '@/components/layouts/HeaderComp.vue';
import { computed, onMounted, ref } from 'vue'
import ProductCard from '@/components/ProductCard.vue';

import { useProductsStore } from '@/stores/products.store';

const productsStore = useProductsStore();

const products = ref([]);

const filterCategory = ref("");
const filterName = ref("");

const quantityProducts = ref(0);


const filterProducts = computed(()=> {
    let productsFiltered = products.value;

    if(filterCategory.value){
        productsFiltered =  productsFiltered.filter(product => product.category == filterCategory.value);
    }

    if(filterName.value){
        let name = filterName.value.toLowerCase();
        productsFiltered =  productsFiltered.filter(product => product.name.toLowerCase().includes(name));
    }

    quantityProducts.value= productsFiltered.length;
    return productsFiltered;
});

onMounted(async () => {
    await productsStore.fetchProducts();
    products.value =productsStore.products;
});


</script>

<style lang="css" scoped></style>