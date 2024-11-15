<script setup lang="ts">
definePageMeta({
	layout: 'admin',
	middleware: ['auth'],
});
</script>

<template>
	<el-card>
		<AdminArticleList type="article"/>
	</el-card>
</template>

<style scoped>
</style>