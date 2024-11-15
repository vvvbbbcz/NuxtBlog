<script setup lang="ts">
import {ElNotification as notify, type FormInstance, type FormRules} from "element-plus";

const props = defineProps(['refresh', 'row', 'column', '$index']);

const editing = ref<boolean>(false);

const {data: articles, execute, status} = await useLazyFetch(`/api/admin/tag/fetchArticle?id=${props.row._id}`, {
	immediate: false
});

function fetch() {
	if (status.value === 'success') {
		hide.value = false;
	} else {
		execute();
	}
}

const hide = ref<boolean>(false);

interface TagForm {
	name: string
	urlName: string
}

const newTag = ref<TagForm>({
	name: props.row.name,
	urlName: props.row.urlName
});
const tagForm = ref<FormInstance>();
const rule = ref<FormRules<TagForm>>({
	name: [{required: true, message: '请输入名称', trigger: 'blur'}],
	urlName: [{required: true, message: '请输入 URL 名称', trigger: 'blur'}],
});

async function save(form: FormInstance) {
	await form.validate(async (valid) => {
		if (valid) {
			const {status}: any = await $fetch(`/api/admin/tag/update`, {
				method: 'PATCH',
				body: {
					_id: props.row._id,
					name: newTag.value.name,
					urlName: newTag.value.urlName
				}
			}).catch(error => {
				notify({type: 'error', title: '保存失败', message: error});
			});
			if (status === 'success') {
				notify({type: 'success', title: '保存成功'});
				props.row.name = newTag.value.name;
				props.row.urlName = newTag.value.urlName;
			} else if (status === 'error') {
				notify({type: 'error', title: '保存失败'});
			}
		}
	});
}

async function remove() {
	const {status}: any = await $fetch(`/api/admin/tag/remove`, {
		method: 'DELETE',
		body: {
			_id: props.row._id
		}
	}).catch(error => {
		notify({type: 'error', title: '删除失败', message: error});
	});
	if (status === 'success') {
		notify({type: 'success', title: '删除成功'});
		await props.refresh();
	} else if (status === 'error') {
		notify({type: 'error', title: '删除失败'});
	}
}
</script>

<template>
	<div v-if="!editing" class="detail">
		<span>文章: </span>
		<el-button v-if="(status !== 'success') || hide" @click="">
			显示（暂不支持）
		</el-button>
		<el-button v-else @click="hide = true">
			隐藏
		</el-button>

		<el-table v-if="(status === 'success') && !hide" :data="articles" style="width: 100%">
			<el-table-column prop="title" label="标题" min-width="100">
				<template #default="props">
					<h1>{{ props.row.title }}</h1>
				</template>
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="200">
				<template #default>
					<el-button type="primary">
						编辑
					</el-button>
					<el-button type="danger">
						移除
					</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>

	<div v-else>
		<el-form ref="tagForm" :model="newTag" :rules="rule" label-width="auto" hide-required-asterisk status-icon>
			<el-form-item label="名称" prop="name">
				<el-input v-model="newTag.name"/>
			</el-form-item>
			<el-form-item label="URL" prop="urlName">
				<el-input v-model="newTag.urlName"/>
			</el-form-item>
		</el-form>
	</div>
	<div v-if="!editing">
		<el-button type="primary" @click="editing = true">
			编辑
		</el-button>
		<el-button type="danger" @click="remove">
			删除
		</el-button>
	</div>
	<el-button-group v-else>
		<el-button @click="editing = false">
			退出编辑
		</el-button>
		<el-button type="primary" @click="save(tagForm)">
			保存
		</el-button>
	</el-button-group>
</template>

<style scoped>
h1 {
	margin: 0 0.5rem;
	display: inline-block;
}

.detail {
	margin-bottom: 1rem;
}

.el-text {
	margin-left: 1rem;
}
</style>