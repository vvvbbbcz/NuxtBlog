<script setup lang="ts">
import {ElMessage as message, ElNotification as notify} from "element-plus";
import ArticleInfoForm from "~/components/ArticleInfoForm.vue";

const props = defineProps<{ type: 'article' | 'draft' | 'recycle' }>();

const {data: articles, refresh} = await useFetch(`/api/admin/article/${props.type}List`);

async function edit(_id: number) {
	await navigateTo(`/admin/article/edit/${_id}`);
}

async function remove(_id: number) {
	const apiType = props.type === 'recycle' ? 'delete' : 'remove';
	const {status, error}: any = await $fetch(`/api/admin/article/${apiType}`, {
		method: 'DELETE',
		body: {_id: _id}
	}).catch(error => {
		notify({type: 'error', title: '删除失败', message: error});
	});
	if (status === 'success') {
		message({type: 'success', message: '删除成功'});
		await refresh();
	} else if (status === 'error') {
		notify({type: 'error', title: '删除失败', message: error.value.message});
	}
}

async function restore(_id: number) {
	const {status, error}: any = await $fetch(`/api/admin/article/restore`, {
		method: 'PATCH',
		body: {_id: _id}
	}).catch(error => {
		notify({type: 'error', title: '还原失败', message: error});
	});
	if (status === 'success') {
		message({type: 'success', message: '还原成功'});
		await refresh();
	} else if (status === 'error') {
		notify({type: 'error', title: '还原失败', message: error.value});
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
					<div v-if="props.type === 'recycle'">
						<el-popconfirm title="确认删除？" @confirm="remove(scope.row._id)">
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
						<div class="detail">
							<ArticleInfoForm :info="scope.row"/>
						</div>
						<el-button type="danger" @click="remove(scope.row._id)">
							删除
						</el-button>
					</div>
				</div>
			</template>
		</el-table-column>
		<el-table-column prop="ti" label="标题" min-width="150">
			<template #default="scope">
				<h1>{{ scope.row.ti }}</h1>
			</template>
		</el-table-column>
		<el-table-column prop="au" label="作者" min-width="100">
			<template #default="scope">
				{{ scope.row.au.ti }}
			</template>
		</el-table-column>
		<el-table-column v-if="props.type === 'article'" prop="pu" label="发布时间" min-width="100">
		</el-table-column>
		<el-table-column v-if="props.type === 'article'" prop="up" label="更新时间" min-width="100">
		</el-table-column>
		<el-table-column prop="vi" label="可见性" min-width="70">
			<template #default="scope">
				<el-tag v-if="scope.row.vi === 0" type="primary">公开</el-tag>
				<el-tag v-else-if="scope.row.vi === 1" type="info">私密</el-tag>
				<el-tag v-else-if="scope.row.vi === 2" type="success">加密</el-tag>
			</template>
		</el-table-column>
		<el-table-column fixed="right" label="操作" width="85">
			<template #default="scope">
				<el-button v-if="props.type === 'recycle'" type="primary" @click="restore(scope.row._id)">
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