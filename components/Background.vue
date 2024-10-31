<script setup lang="ts">
const {data} = await useFetch('/api/getBlogInfo');
const bg = data.value ? data.value.background : '';
</script>

<template>
	<div v-if="bg" id="bg" :style="{backgroundImage: `url(${bg})`}">
	</div>
</template>

<style scoped>
#bg {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-position: center;
	background-repeat: no-repeat;
	-webkit-background-size: cover;
	-o-background-size: cover;
	background-size: cover;
	z-index: -100;
}

img {
	display: inline-block;
	position: relative;
	width: 100%;
	height: 100%;
	vertical-align: middle;
	z-index: -99;
	object-fit: cover;
}
</style>