<script setup lang="ts">
const {data} = useNuxtData('blogInfo');
const bg = data.value ? data.value.background.ur : '';
</script>

<template>
	<div v-if="bg" id="bg" :style="{backgroundImage: `url(${bg})`}"/>
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
</style>