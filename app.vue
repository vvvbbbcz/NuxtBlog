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
<script setup lang="ts">
const {data} = await useFetch('/api/getBlogInfo', {key: 'blogInfo'});
const title = data.value ? data.value.name : '获取标题失败';
useHead({
	title: `${title}`,
});
</script>