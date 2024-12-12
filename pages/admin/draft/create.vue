<script setup lang="ts">
definePageMeta({
	layout: 'admin',
	middleware: ['auth'],
});
</script>

<template>
	<el-card class="h-100p b-s-bb" :body-class="'h-100p b-s-bb'">
		<ArticleEditor/>
	</el-card>
</template>

<style scoped>

</style>