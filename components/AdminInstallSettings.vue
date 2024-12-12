<script setup lang="ts">
import {passwordStrength} from "check-password-strength";
import sha256sum from "~/utils/sha256sum";
import {ElMessage as message, ElNotification as notify, type FormInstance, type FormRules} from "element-plus";

import {isEmail, isUsername} from "~/utils/regularValidator";

const data = ref({
	name: '',
	icon: 0,
	separator: '',
	background: '',
	ur: '',
	ti: '',
	md: '',
	pw: '',
	confirmPassword: '',
});
const form = ref<FormInstance>();
const rule = ref<FormRules<typeof data>>({
	name: [{required: true, message: '请输入名称', trigger: 'blur'}],
	separator: [{required: true, message: '请输入分隔符', trigger: 'blur'}],
	ur: [{required: true, validator: validateUsername, trigger: 'blur'}],
	ti: [{required: true, message: '请输入昵称', trigger: 'blur'}],
	md: [{required: true, validator: validateEmail, trigger: 'blur'}],
	pw: [{required: true, validator: validatePassword, trigger: 'blur'}],
	confirmPassword: [{required: true, validator: validateConfirmPassword, trigger: 'blur'}],
});

function validateUsername(rule: any, value: any, callback: any) {
	if (!isUsername(value)) {
		callback(new Error('请输入正确的用户名（A-Z，a-z，0-9，_，-，3-16 个字符）'))
	} else {
		callback()
	}
}

function validateEmail(rule: any, value: any, callback: any) {
	if (!isEmail(value)) {
		callback(new Error('请输入正确的邮箱地址'))
	} else {
		callback()
	}
}

function validatePassword(rule: any, value: any, callback: any) {
	console.log(value)
	if (!passwordStrength(value).id) { // strength bigger than 0
		callback(new Error('密码强度太弱'))
	} else {
		callback()
	}
}

function validateConfirmPassword(rule: any, value: any, callback: any) {
	if (value !== data.value.pw) {
		callback(new Error('密码不一致'))
	} else {
		callback()
	}
}

async function save() {
	$fetch(`/api/admin/blogInfo/create`, {
		method: 'POST',
		body: {
			...data.value,
			pw: await sha256sum(data.value.pw),
			confirmPassword: undefined,
		}
	}).then(async ({status}) => {
		if (status === 'success') {
			message({type: 'success', message: '保存成功'});
			await navigateTo('/admin/login');
		}
	}).catch(error => {
		notify({type: 'error', title: '保存失败', message: error});
	});
}

const mounted = ref(false);
onMounted(() => {
	mounted.value = true;
});
</script>

<template>
	<el-form ref="form" :model="data" :rules="rule" label-width="auto" hide-required-asterisk status-icon>
		<h2>网站信息</h2>
		<el-form-item prop="name" label="博客名称">
			<el-input v-if="mounted" v-model="data.name"/>
		</el-form-item>
		<el-form-item prop="separator" label="分隔符">
			<el-input v-if="mounted" v-model="data.separator"/>
		</el-form-item>

		<h2>管理员信息</h2>
		<el-form-item prop="ur" label="用户名">
			<el-input v-if="mounted" v-model="data.ur"/>
		</el-form-item>
		<el-form-item prop="ti" label="昵称">
			<el-input v-if="mounted" v-model="data.ti"/>
		</el-form-item>
		<el-form-item prop="md" label="邮箱">
			<el-input v-if="mounted" v-model="data.md"/>
		</el-form-item>
		<el-form-item prop="pw" label="密码">
			<el-input v-if="mounted" v-model="data.pw" type="password" show-password/>
		</el-form-item>
		<el-form-item prop="confirmPassword" label="确认密码">
			<el-input v-if="mounted" v-model="data.confirmPassword" type="password" show-password/>
		</el-form-item>
	</el-form>
	<div style="margin-left: auto">
		<el-button type="primary" @click="save">
			保存
		</el-button>
	</div>
</template>

<style scoped>
</style>