<script setup lang="ts">
import {ElMessage as message, ElNotification as notify, type FormInstance, type FormRules} from "element-plus";

definePageMeta({
	layout: 'admin',
	middleware: ['auth'],
});

const {data: fetchedData}: any = await useFetch(`/api/admin/blogInfo/get`);

const data = ref(fetchedData.value);
const form = ref<FormInstance>();
const rule = ref<FormRules<typeof data>>({
	name: [{required: true, message: '请输入名称', trigger: 'blur'}],
	separator: [{required: true, message: '请输入分隔符', trigger: 'blur'}],
})

async function save(form: FormInstance) {
	await form.validate(async (valid) => {
		if (valid) {
			const {status}: any = await $fetch(`/api/admin/blogInfo/update`, {
				method: 'PATCH',
				body: data.value
			}).catch(error => {
				notify({type: 'error', title: '保存失败', message: error});
			});
			if (status === 'success') {
				message({type: 'success', message: '保存成功'});
			} else if (status === 'error') {
				message({type: 'error', message: '保存失败'});
			}
		}
	});
}

const mounted = ref(false);
onMounted(() => {
	mounted.value = true;
});
</script>

<template>
	<el-card>
		<el-form ref="form" :model="data" :rules="rule" label-width="auto" hide-required-asterisk status-icon>
			<h2>网站信息</h2>
			<el-form-item prop="name" label="博客名称">
				<el-input v-if="mounted" v-model="data.name"/>
			</el-form-item>
			<el-form-item prop="separator" label="分隔符">
				<el-input v-if="mounted" v-model="data.separator"/>
			</el-form-item>
		</el-form>
		<div style="margin-left: auto">
			<el-button type="primary" @click="save(form)">
				保存
			</el-button>
			<el-button @click="form?.resetFields()">
				重置
			</el-button>
		</div>
	</el-card>
</template>

<style scoped>
.pw-input {
	margin-bottom: 0;
}

.pw-text {
	margin-bottom: 18px;
}

.el-text {
	margin-left: 1rem;
}
</style>