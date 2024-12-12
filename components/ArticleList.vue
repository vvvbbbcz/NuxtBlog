<script setup lang="ts">
import 'highlight.js/styles/default.css';

const {data: articles, status} = useLazyFetch(`/api/article/list`);

function toArticle(year: string, name: string) {
	navigateTo(`/article/${year}/${name}`);
}
</script>

<template>
	<el-card v-if="status === 'pending'" class="m-b-1">
		<el-skeleton animated/>
	</el-card>
	<el-card v-else-if="status === 'error'" class="m-b-1">
		<h1>加载失败</h1>
	</el-card>
	<el-card v-else class="m-b-1" v-for="article in (articles || [])">
		<el-link @click="toArticle(`${article.yr}`, `${article.ur}`)">
			<h1 class="title m-0">{{ article.ti }}</h1>
		</el-link>
		<div v-highlight v-html="article.ab"/>
	</el-card>
</template>

<style scoped>
.title {
	text-align: center;
	font-size: 2rem;
}
</style>