<script setup lang="ts">

const {data: tags} = await useFetch(`/api/admin/tag/list`);

async function edit(id: number) {
	await navigateTo(`/admin/tag/edit/${id}`);
}

const mounted = ref<boolean>(false);
onMounted(() => {
	mounted.value = true;
});
</script>

<template>
	<el-card>
		<el-table v-if="mounted" :data="tags" style="width: 100%">
			<el-table-column type="expand">
				<template #default="props">
					<div class="table-expand">
						<AdminTagDetail :row="props.row" :column="props.column" :$index="props.$index"/>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="name" label="名称" min-width="100">
				<template #default="props">
					<h1>{{ props.row.name }}</h1>
				</template>
			</el-table-column>
			<el-table-column prop="articles.length" label="文章数" min-width="100"/>
		</el-table>
	</el-card>
</template>

<style scoped>
h1 {
	margin: 0 0.5rem;
	display: inline-block;
}

.table-expand {
	margin-left: 2rem;
}

.el-button-group {
	margin-right: 0.5rem;
}
</style>