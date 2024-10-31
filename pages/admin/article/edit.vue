<script setup lang="ts">
definePageMeta({
	layout: 'admin'
});

const error = ref(false);
const id = parseInt(getQueryFirst(useRoute().query.id));
if (isNaN(id)) {
	error.value = true;
}
</script>

<template>
	<el-card v-if="error.valueOf()">
		<h1>错误</h1>
	</el-card>
	<AdminArticleEditor v-else :id="id"/>
</template>

<style scoped>

</style>