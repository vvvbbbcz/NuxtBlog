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
	<el-card class="h-100p border-box" :body-class="'h-100p border-box'">
		<h1 v-if="error.valueOf()">错误</h1>
		<ArticleEditor v-else :id="id"/>
	</el-card>
</template>

<style scoped>

</style>