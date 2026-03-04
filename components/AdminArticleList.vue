<script setup lang="ts">
import ArticleInfoForm from "~/components/ArticleInfoForm.vue";

const props = defineProps<{ type: 'published' | 'drafted' | 'deleted' }>();

const { data: articles, refresh } = await useFetch(`/api/admin/article/list/${props.type}`);

async function edit(id: number) {
	await navigateTo(`/admin/article/edit/${id}`);
}

async function remove(id: number) {
	const apiType = props.type === 'deleted' ? 'delete' : 'remove';
	$fetch(`/api/admin/article/${apiType}`, {
		method: 'DELETE',
		body: { id: id }
	}).then(async ({ status }) => {
		if (status === 'success') {
			ElMessage({ type: 'success', message: '删除成功' });
			await refresh();
		}
	}).catch(error => {
		ElNotification({ type: 'error', title: '删除失败', message: error });
	});
}

async function restore(id: number) {
	$fetch(`/api/admin/article/restore`, {
		method: 'PATCH',
		body: { id: id }
	}).then(async ({ status }) => {
		if (status === 'success') {
			ElMessage({ type: 'success', message: '还原成功' });
			await refresh();
		}
	}).catch(error => {
		ElNotification({ type: 'error', title: '还原失败', message: error });
	});
}

const mounted = ref<boolean>(false);
onMounted(() => {
	mounted.value = true;
});
</script>

<template>
	<el-table v-if="mounted && articles" :data="articles">
		<el-table-column type="expand">
			<template #default="scope">
				<div class="table-expand">
					<div v-if="props.type === 'deleted'">
						<el-popconfirm title="确认删除？" @confirm="remove(scope.row.id)">
							<template #reference>
								<el-button type="danger">
									彻底删除
								</el-button>
							</template>
							<template #actions="{ confirm, cancel }">
								<el-button size="small" type="primary" @click="cancel">
									取消
								</el-button>
								<el-button type="danger" size="small" plain @click="confirm">
									确认
								</el-button>
							</template>
						</el-popconfirm>
					</div>

					<div v-else>
						<div class="m-b-1">
							<ArticleInfoForm :info="scope.row" />
						</div>
						<el-button type="danger" @click="remove(scope.row.id)">
							删除
						</el-button>
					</div>
				</div>
			</template>
		</el-table-column>
		<el-table-column prop="title" label="标题" min-width="150">
			<template #default="scope">
				<h1 class="m-0">{{ scope.row.title }}</h1>
			</template>
		</el-table-column>
		<el-table-column prop="author" label="作者" min-width="100">
			<template #default="scope">
				{{ scope.row.author.nickname }}
			</template>
		</el-table-column>
		<el-table-column v-if="props.type === 'published'" prop="date" label="修改时间" min-width="100">
		</el-table-column>
		<el-table-column prop="visible" label="可见性" min-width="70">
			<template #default="scope">
				<el-tag v-if="scope.row.visible === 0" type="primary">公开</el-tag>
				<el-tag v-else-if="scope.row.visible === 1" type="info">私密</el-tag>
				<el-tag v-else-if="scope.row.visible === 2" type="success">加密</el-tag>
			</template>
		</el-table-column>
		<el-table-column fixed="right" label="操作" width="85">
			<template #default="scope">
				<el-button v-if="props.type === 'deleted'" type="primary" @click="restore(scope.row.id)">
					还原
				</el-button>
				<el-button v-else type="primary" @click="edit(scope.row.id)">
					编辑
				</el-button>
			</template>
		</el-table-column>
	</el-table>
</template>

<style scoped>
.table-expand {
	margin-left: 2rem;
}
</style>