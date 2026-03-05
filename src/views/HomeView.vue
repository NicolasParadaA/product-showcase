<template>
	<div>

		<HeaderComp>Página Home</HeaderComp>

		<!-- <main class="container">
			<div class="card-quantity-products">
				<p class="card-quantity-products__value">{{ productsStore.quantityProducts }}</p>
				<p class="card-quantity-products__text">Cantidad productos</p>
			</div>
		</main> -->

		<main class="container">

			<section id="cocina">
				<h2>Productos de Cocina</h2>
				<ListProducts :products="productsStore.filterProductsByCategory('Cocina')" />
			</section>
			
			<v-divider :thickness="4" class="border-opacity-25" color="success"></v-divider>

			<section id="hogar">
				<h2>Productos de Hogar</h2>
				<ListProducts :products="productsStore.filterProductsByCategory('Hogar')" />
			</section>

			<v-divider :thickness="4" class="border-opacity-25" color="success"></v-divider>

			<section id="jardin">
				<h2>Productos de Jardín</h2>
				<ListProducts :products="productsStore.filterProductsByCategory('Jardín')" />
			</section>


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
.card-quantity-products {
	max-width: 300px;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	border: 2px solid black;
	padding: 1rem;
	text-align: center;
}

.card-quantity-products__value {
	font-size: 5rem;
	font-weight: 700;
}

.card-quantity-products__text {
	font-size: 3rem;
	font-weight: 300;
}
</style>