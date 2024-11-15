<script setup lang="ts">
definePageMeta({
	layout: 'admin',
	middleware: ['auth'],
});

const error = ref(false);
const param = useRoute().params.id;
const id = parseInt(Array.isArray(param) ? param[0] : param);
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