<script setup lang="ts">

import type {FormInstance, FormRules} from "element-plus";

const {data: tags, refresh: refreshTags} = await useFetch(`/api/admin/tag/list`);

interface TagForm {
	name: string
	urlName: string
}
const newTag = ref<TagForm>({
	name: '',
	urlName: ''
});
const tagForm = ref<FormInstance>();
const rule = ref<FormRules<TagForm>>({
	name: [{required: true, message: '请输入名称', trigger: 'blur'}],
	urlName: [{required: true, message: '请输入 URL 名称', trigger: 'blur'}],
});

const saveFailed = ref<boolean>(false);

async function createTag(form: FormInstance) {
	saveFailed.value = false;
	await form.validate(async (valid) => {
		if (valid) {
			const {status} = await $fetch(`/api/admin/tag/create`, {
				method: 'POST',
				body: newTag.value
			});
			if (status === 'success') {
				form.resetFields();
				await refreshTags();
			} else if (status === 'error') {
				saveFailed.value = true;
			}
		}
	});
}

const mounted = ref<boolean>(false);
onMounted(() => {
	mounted.value = true;
});
</script>

<template>
	<el-card>
		<el-form ref="tagForm" :model="newTag" :rules="rule" label-width="auto" hide-required-asterisk status-icon>
			<el-form-item label="名称" prop="name">
				<el-input v-if="mounted" v-model="newTag.name"/>
			</el-form-item>
			<el-form-item label="URL" prop="urlName">
				<el-input v-if="mounted" v-model="newTag.urlName"/>
			</el-form-item>
		</el-form>
		<el-button type="primary" @click="createTag(tagForm)">
			创建
		</el-button>
		<el-button @click="tagForm?.resetFields()">
			重置
		</el-button>
		<el-text v-if="saveFailed" type="danger">保存失败</el-text>

		<el-table v-if="mounted" :data="tags" style="margin-top: 1rem">
			<el-table-column type="expand">
				<template #default="props">
					<div class="table-expand">
						<AdminTagDetail :refresh="refreshTags" :row="props.row" :column="props.column" :$index="props.$index"/>
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

.el-text {
	margin-left: 1rem;
}
</style>