<script setup lang="ts">
const {data} = useNuxtData('blogInfo');
const title = data.value ? data.value.name : '获取博客名称失败'
</script>

<template>
	<span v-html="title" class="site-name"></span>
</template>

<style scoped>
</style>