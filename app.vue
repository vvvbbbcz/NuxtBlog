<script setup lang="ts">
import 'element-plus/theme-chalk/dark/css-vars.css'

const {data}: any = await useAsyncData('blogInfo', () => $fetch('/api/getBlogInfo'));
const title = data.value?.name ? data.value.name : 'NuxtBlog';
const separator = data.value?.separator ? data.value.separator : '-';
useHead({
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} ${separator} ${title}` : title;
	}
});
</script>

<template>
	<NuxtLayout>
		<NuxtPage/>
	</NuxtLayout>
</template>

<style>
@import url('./assets/css/style.css');

body {
	margin: 0;
}
</style>
