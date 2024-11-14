<script setup lang="ts">
import type {FormInstance, FormRules} from "element-plus";

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

const saveStatus = ref({
	type: 'warning',
	msg: '未保存',
	errMsg: '',
	success: () => {
		saveStatus.value.type = 'success';
		saveStatus.value.msg = '保存成功';
		saveStatus.value.errMsg = '';
	},
	fail: (error: string) => {
		saveStatus.value.type = 'danger';
		saveStatus.value.msg = '保存失败';
		saveStatus.value.errMsg = error;
	},
	reset: () => {
		saveStatus.value.type = 'warning';
		saveStatus.value.msg = '未保存';
		saveStatus.value.errMsg = '';
	}
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
				saveStatus.value.fail(error);
			});
			if (status === 'success') {
				saveStatus.value.success();
				props.row.name = newTag.value.name;
				props.row.urlName = newTag.value.urlName;
			} else if (status === 404) {
				saveStatus.value.fail('找不到标签');
			}
		}
	});
}

const removeFailed = ref<boolean>(false);
async function remove() {
	removeFailed.value = false;
	const {status}: any = await $fetch(`/api/admin/tag/remove`, {
		method: 'DELETE',
		body: {
			_id: props.row._id
		}
	}).catch(() => {
		removeFailed.value = true;
	});
	if (status === 'success') {
		await props.refresh();
	} else if (status === 'error') {
		removeFailed.value = true;
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
	<el-text v-if="editing" :type="saveStatus.type">{{ `${saveStatus.msg} ${saveStatus.errMsg}` }}</el-text>
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