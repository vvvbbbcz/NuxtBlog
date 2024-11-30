<script setup lang="ts">

import {ElNotification as notify, type FormInstance, type FormRules} from "element-plus";

const {data: tags, refresh: refreshTags} = await useFetch(`/api/admin/tag/list`);

interface TagForm {
	ur: string
	ti: string
}

const newTag = ref<TagForm>({
	ur: '',
	ti: '',
});
const tagForm = ref<FormInstance>();
const rule = ref<FormRules<TagForm>>({
	ur: [{required: true, message: '请输入 URL 名称', trigger: 'blur'}],
	ti: [{required: true, message: '请输入名称', trigger: 'blur'}],
});

async function createTag() {
	if (await tagForm.value?.validate()) {
		const {status}: any = await $fetch(`/api/admin/tag/create`, {
			method: 'POST',
			body: newTag.value
		}).catch(error => {
			notify({type: 'error', title: '创建失败', message: error});
		});
		if (status === 'success') {
			tagForm.value?.resetFields();
			notify({type: 'success', title: '创建成功'});
			await refreshTags();
		} else if (status === 'error') {
			notify({type: 'error', title: '创建失败'});
		}
	}
}

const mounted = ref<boolean>(false);
onMounted(() => {
	mounted.value = true;
});
</script>

<template>
	<el-card>
		<el-form ref="tagForm" :model="newTag" :rules="rule" label-width="auto" hide-required-asterisk status-icon>
			<el-form-item label="名称" prop="ti">
				<el-input v-if="mounted" v-model="newTag.ti"/>
			</el-form-item>
			<el-form-item label="URL" prop="ur">
				<el-input v-if="mounted" v-model="newTag.ur"/>
			</el-form-item>
		</el-form>
		<el-button type="primary" @click="createTag()">
			创建
		</el-button>
		<el-button @click="tagForm?.resetFields()">
			重置
		</el-button>

		<el-table v-if="mounted" :data="tags || []" style="margin-top: 1rem">
			<el-table-column type="expand">
				<template #default="props">
					<div class="table-expand">
						<AdminTagDetail :refresh="refreshTags" :row="props.row" :column="props.column"
										:$index="props.$index"/>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="ti" label="名称" min-width="100">
				<template #default="props">
					<h1>{{ props.row.ti }}</h1>
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

.el-text {
	margin-left: 1rem;
}
</style>