<script setup lang="ts">
const {data} = await useAsyncData('blogInfo', () => $fetch('/api/getBlogInfo'));
const title = data.value ? data.value.name : '获取标题失败';
const separator = data.value ? data.value.separator : '-';
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
