<script setup lang="ts">
definePageMeta({
	layout: 'admin',
	middleware: ['auth'],
});
</script>

<template>
	<AdminArticleEditor/>
</template>

<style scoped>

</style>