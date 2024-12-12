<script setup lang="ts">
import 'element-plus/theme-chalk/dark/css-vars.css'
import {useDark, useToggle} from "@vueuse/core";

const {data}: any = await useAsyncData('blogInfo', () => $fetch('/api/getBlogInfo'));
const title = data.value?.name ? data.value.name : 'NuxtBlog';
const separator = data.value?.separator ? data.value.separator : '-';

const isDark = useDark();
const toggleDark = useToggle(isDark);

provide('isDark', isDark);
provide('toggleDark', toggleDark);

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
@import "assets/css/style.css";

body {
	margin: 0;
}
</style>
