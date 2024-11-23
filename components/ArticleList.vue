<script setup lang="ts">
import 'highlight.js/styles/default.css';

const {data: articles, status} = useLazyFetch(`/api/article/list`);

function toArticle(name: string) {
	navigateTo(`/article/${name}`);
}
</script>

<template>
	<div v-if="status === 'pending'">
		<el-card>
			Loading
		</el-card>
	</div>
	<el-card v-else class="list-item" v-for="article in articles">
		<el-link @click="toArticle(`${article.urlName}`)">
			<h1 class="title">{{ article.title }}</h1>
		</el-link>
		<div v-highlight v-html="article.abstract"/>
	</el-card>
</template>

<style scoped>
.el-card {
	margin-bottom: 1rem;
}

.title {
	text-align: center;
	font-size: 2rem;
	margin: 0;
}
</style>