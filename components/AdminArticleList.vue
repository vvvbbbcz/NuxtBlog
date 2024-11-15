<script setup lang="ts">
const props = defineProps({
	type: String,
	recycle: Boolean
});

const recycleRoute = props.recycle ? '/recycle' : '';
const {data: articles, refresh} = await useFetch(`/api/admin${recycleRoute}/${props.type}/list`);

async function edit(id: number) {
	await navigateTo(`/admin/${props.type}/edit/${id}`);
}

const removeFailed = ref<boolean>(false);
async function remove(id: number) {
	removeFailed.value = false;
	const {status}: any = await $fetch(`/api/admin${recycleRoute}/${props.type}/remove`, {
		method: 'DELETE',
		body: {
			_id: id
		}
	}).catch(() => {
		removeFailed.value = true;
	});
	if (status === 'success') {
		await refresh();
	} else if (status === 'error') {
		removeFailed.value = true;
	}
}

async function restore(id: number) {
	const {status}: any = await $fetch(`/api/admin${recycleRoute}/${props.type}/restore`, {
		method: 'PATCH',
		body: {
			_id: id
		}
	}).catch(() => {
	});
	if (status === 'success') {
		await refresh();
	}
}

const mounted = ref<boolean>(false);
onMounted(() => {
	mounted.value = true;
});
</script>

<template>
	<el-table v-if="mounted" :data="articles">
		<el-table-column type="expand">
			<template #default="scope">
				<div class="table-expand">
					<div v-if="props.recycle">
						<el-button type="danger" @click="remove(scope.row._id)">
							彻底删除
						</el-button>
						<el-text v-if="removeFailed" type="danger">删除失败</el-text>
					</div>

					<div v-else>
						<div class="detail">
							<AdminArticleDetail :row="scope.row" :column="scope.column" :$index="scope.$index"/>
						</div>
						<el-button type="danger" @click="remove(scope.row._id)">
							删除
						</el-button>
						<el-text v-if="removeFailed" type="danger">删除失败</el-text>
					</div>
				</div>
			</template>
		</el-table-column>
		<el-table-column prop="title" label="标题" min-width="150">
			<template #default="scope">
				<h1>{{ scope.row.title }}</h1>
			</template>
		</el-table-column>
		<el-table-column prop="author" label="作者" min-width="100">
			<template #default="scope">
				{{ scope.row.author.nickname }}
			</template>
		</el-table-column>
		<el-table-column v-if="props.type === 'article'" prop="publishDate" label="发布时间" min-width="100">
		</el-table-column>
		<el-table-column v-if="props.type === 'article'" prop="updateDate" label="更新时间" min-width="100">
		</el-table-column>
		<el-table-column prop="visible" label="可见性" min-width="70">
			<template #default="scope">
				<el-tag v-if="scope.row.visible" type="primary">公开</el-tag>
				<el-tag v-else type="info">私密</el-tag>
			</template>
		</el-table-column>
		<el-table-column fixed="right" label="操作" width="85">
			<template #default="scope">
				<el-button v-if="props.recycle" type="primary" @click="restore(scope.row._id)">
					还原
				</el-button>
				<el-button v-else type="primary" @click="edit(scope.row._id)">
					编辑
				</el-button>
			</template>
		</el-table-column>
	</el-table>
</template>

<style scoped>
h1 {
	margin: 0;
}

.table-expand {
	margin-left: 2rem;
}

.detail {
	margin-bottom: 1rem;
}

.el-text {
	margin-left: 1rem;
}
</style>