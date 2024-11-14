<script setup lang="ts">

const props = defineProps({
	draft: Boolean
});

const type = props.draft ? 'draft' : 'article';
const {data: articles} = await useFetch(`/api/admin/${type}/list`);

async function edit(id: number) {
	await navigateTo(`/admin/${type}/edit/${id}`);
}

const mounted = ref<boolean>(false);
onMounted(() => {
	mounted.value = true;
});
</script>

<template>
	<el-card>
		<el-table v-if="mounted" :data="articles">
			<el-table-column type="expand">
				<template #default="props">
					<div class="table-expand">
						<AdminArticleDetail :row="props.row" :column="props.column" :$index="props.$index"/>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="title" label="标题" min-width="150">
				<template #default="props">
					<h1>{{ props.row.title }}</h1>
				</template>
			</el-table-column>
			<el-table-column prop="author" label="作者" min-width="100">
				<template #default="props">
					{{ props.row.author.nickname }}
				</template>
			</el-table-column>
			<el-table-column v-if="!props.draft" prop="publishDate" label="发布时间" min-width="100">
			</el-table-column>
			<el-table-column v-if="!props.draft" prop="updateDate" label="更新时间" min-width="100">
			</el-table-column>
			<el-table-column prop="visible" label="可见性" min-width="70">
				<template #default="props">
					<el-tag v-if="props.row.visible" type="primary">公开</el-tag>
					<el-tag v-else type="info">私密</el-tag>
				</template>
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="85">
				<template #default="props">
					<el-button type="primary" @click="edit(props.row._id)">
						编辑
					</el-button>
				</template>
			</el-table-column>
		</el-table>
	</el-card>
</template>

<style scoped>
h1 {
	margin: 0;
}

.table-expand {
	margin-left: 2rem;
}
</style>