<script setup lang="ts">
definePageMeta({
	layout: 'admin',
	middleware: ['auth'],
});
</script>

<template>
	<AdminArticleEditor draft/>
</template>

<style scoped>

</style>