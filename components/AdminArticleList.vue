<script setup lang="ts">
const props = defineProps({
	draft: Boolean
});

const type = props.draft ? 'draft' : 'article';
const {data} = await useFetch(`/api/admin/${type}/list`);
const articles = data.value;

async function edit(id: number) {
	await navigateTo(`/admin/${type}/edit/${id}`);
}
</script>

<template>
	<el-card>
		<div class="list-item" v-for="article in articles">
			<el-container direction="horizontal">
				<div>
					<h1>{{ article.title }}</h1>
					<el-tag v-if="article.visible" type="primary">公开</el-tag>
					<el-tag v-else type="info">私密</el-tag>
				</div>
				<div>
					<el-button-group>
						<el-button>
							Detail
						</el-button>
						<el-button type="primary" @click="edit(article._id)">
							编辑
						</el-button>
					</el-button-group>
				</div>
			</el-container>
			{{ article }}
		</div>
	</el-card>
</template>

<style scoped>
h1 {
	margin: 0 0.5rem;
	display: inline-block;
}

.list-item {
	border-bottom: solid 1px lightgray;
}

.list-item:first-child {
	border-top: solid 1px lightgray;
}

.el-container {
	margin: 0.5rem 0;
	align-items: center;
	justify-content: space-between;
}

.el-button-group {
	margin-right: 0.5rem;
}
</style>