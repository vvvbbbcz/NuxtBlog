<script setup lang="ts">
const props = defineProps(['row', 'column', '$index']);

const editing = ref<boolean>(false);
const name = ref<string>(props.row.name);
const urlName = ref<string>(props.row.urlName);

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

async function save(create: boolean) {
	const apiType = create ? 'create' : 'update';
	const method = create ? 'POST' : 'PATCH';
	const {status}: any = await $fetch(`/api/admin/tag/${apiType}`, {
		method: method,
		body: {
			_id: props.row._id,
			name: name.value,
			urlName: urlName.value
		}
	}).catch(error => {
		saveStatus.value.fail(error);
	});
	if (status === 'success') {
		saveStatus.value.success();
		props.row.name = name.value;
		props.row.urlName = urlName.value;
	} else if (status === 404) {
		saveStatus.value.fail('找不到标签');
	}
	console.log(status);
}

function remove() {
	// TODO
}
</script>

<template>
	<div v-if="!editing" class="detail">
		<p>ID: {{ props.row._id }}</p>
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
		<el-form label-width="auto">
			<el-form-item label="名称">
				<el-input v-model="name"/>
			</el-form-item>
			<el-form-item label="URL">
				<el-input v-model="urlName"/>
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
		<el-button type="primary" @click="save(false)">
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