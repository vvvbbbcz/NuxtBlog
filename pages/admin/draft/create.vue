<script setup lang="ts">
definePageMeta({
	layout: 'admin',
	middleware: ['auth'],
});
</script>

<template>
	<el-card class="h-100p border-box" :body-class="'h-100p border-box'">
		<ArticleEditor/>
	</el-card>
</template>

<style scoped>

</style>