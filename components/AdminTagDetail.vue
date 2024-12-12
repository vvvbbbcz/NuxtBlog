<script setup lang="ts">
import {ElNotification as notify, type FormInstance, type FormRules} from "element-plus";

const props = defineProps(['refresh', 'row', 'column', '$index']);

const editing = ref<boolean>(false);

const {data: articles, execute, status} =
	await useLazyFetch(`/api/admin/tag/fetchArticle`, {query: {id: props.row._id}, immediate: false});

function fetch() {
	if (status.value === 'success') {
		hide.value = false;
	} else {
		execute();
	}
}

const hide = ref<boolean>(false);

interface TagForm {
	ur: string
	ti: string
}

const newTag = ref<TagForm>({
	ur: props.row.ur,
	ti: props.row.ti,
});
const tagForm = ref<FormInstance>();
const rule = ref<FormRules<TagForm>>({
	ur: [{required: true, message: '请输入 URL 名称', trigger: 'blur'}],
	ti: [{required: true, message: '请输入名称', trigger: 'blur'}],
});

async function save() {
	if (await tagForm.value?.validate()) {
		$fetch(`/api/admin/tag/update`, {
			method: 'PATCH',
			body: {
				_id: props.row._id,
				ur: newTag.value.ur,
				ti: newTag.value.ti,
			}
		}).then(({status}) => {
			if (status === 'success') {
				notify({type: 'success', title: '保存成功'});
				props.row.ur = newTag.value.ur;
				props.row.ti = newTag.value.ti;
			}
		}).catch(error => {
			notify({type: 'error', title: '保存失败', message: error});
		});
	}
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
	<div v-if="!editing" class="m-b-1">
		<span>文章: </span>
		<el-button @click="fetch()">
			获取 / 刷新
		</el-button>

		<el-table v-if="(status === 'success')" :data="articles || []" class="w-100p">
			<el-table-column prop="ti" label="标题" min-width="100">
				<template #default="props">
					<h1>{{ props.row.ti }}</h1>
				</template>
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="200">
				<template #default>
					<el-button type="primary">
						编辑（暂不支持）
					</el-button>
					<el-button type="danger">
						移除（暂不支持）
					</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>

	<div v-else>
		<el-form ref="tagForm" :model="newTag" :rules="rule" label-width="auto" hide-required-asterisk status-icon>
			<el-form-item label="名称" prop="ti">
				<el-input v-model="newTag.ti"/>
			</el-form-item>
			<el-form-item label="URL" prop="ur">
				<el-input v-model="newTag.ur"/>
			</el-form-item>
		</el-form>
	</div>
	<div v-if="!editing">
		<el-button type="primary" @click="editing = true">
			编辑
		</el-button>
		<el-popconfirm title="确认删除？" @confirm="remove">
			<template #reference>
				<el-button type="danger">
					删除
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
	<el-button-group v-else>
		<el-button @click="editing = false">
			退出编辑
		</el-button>
		<el-button type="primary" @click="save()">
			保存
		</el-button>
	</el-button-group>
</template>

<style scoped>
h1 {
	margin: 0 0.5rem;
	display: inline-block;
}
</style>