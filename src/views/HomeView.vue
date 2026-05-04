<template>
	<!-- cantidad de productos hecho con vuetify -->
	<!-- <v-card max-width="300" class="mx-auto" border="2">
		<v-card-text class="text-center">
			<div class="text-h1 font-weight-bold">{{ productsStore.quantityProducts }}</div>
			<div class="text-h3 font-weight-light">Cantidad productos</div>
		</v-card-text>
	</v-card> -->
	<div>
		<HeaderComp>Página Home</HeaderComp>
		<main>
			<v-container>

				<section id="cocina">
					<h2>Productos de Cocina</h2>
					<ListProducts :products="productsStore.filterProductsByCategory('Cocina')" />
				</section>

				<v-divider :thickness="4" class="border-opacity-25 my-4" color="success"></v-divider>

				<section id="hogar">
					<h2>Productos de Hogar</h2>
					<ListProducts :products="productsStore.filterProductsByCategory('Hogar')" />
				</section>

				<v-divider :thickness="4" class="border-opacity-25 my-4" color="success"></v-divider>

				<section id="jardin">
					<h2>Productos de Jardín</h2>
					<ListProducts :products="productsStore.filterProductsByCategory('Jardín')" />
				</section>

			</v-container>
		</main>
	</div>

</template>

<script setup>
import HeaderComp from '@/components/layouts/HeaderComp.vue';
import ListProducts from '@/components/ListProducts.vue';
import { useProductsStore } from '@/stores/products.store';
import { onMounted } from 'vue';

const productsStore = useProductsStore();

onMounted(async () => {
	await productsStore.fetchProducts();
});

</script>

<style lang="css" scoped>

</style>