<script setup lang="ts">
import 'highlight.js/styles/default.css';

const route = useRoute();

const name = route.params.name;
const {data: article, status, error} = await useLazyFetch(`/api/article/get`, {query: {name: name}});
</script>

<template>
	<el-card v-highlight>
		<div v-if="status === 'pending'">
			Loading
		</div>
		<div v-else-if="error?.statusCode === 404">
			<h1 class="main-title">404 Not Found</h1>
			<hr/>
			<p>文章不存在</p>
		</div>
		<div v-else>
			<h1 class="main-title">{{ article?.title }}</h1>
			<el-container class="gap-2">
				<a v-for="tag in article?.tagId" :href="`/tag?name=${tag.urlName}`">
					<el-tag type="primary">
						{{ tag.name }}
					</el-tag>
				</a>
			</el-container>
			<hr/>
			<div v-html="article?.content.content"></div>
		</div>
	</el-card>
</template>

<style scoped>
h1.main-title {
	text-align: center;
	font-size: 2rem;
	margin: 0;
}

h1 {
	font-size: 1.7rem;
}

.el-container {
	justify-content: center;
	gap: 0.5rem;
}
</style>