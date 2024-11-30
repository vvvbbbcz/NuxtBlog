<script setup lang="ts">
import type {FormInstance, FormRules} from "element-plus";
import {isEmail} from "~/utils/regularValidator";
import {passwordStrength} from "check-password-strength";

definePageMeta({
	layout: 'admin',
	middleware: ['auth'],
});

const page = ref<string>('info');

const {user}: any = useUserSession();
const {data}: any = await useFetch(`/api/admin/user/get`, {query: {id: user.value._id}});

const info = ref<any>(data.value);
const infoForm = ref<FormInstance>();
const infoRule = ref<FormRules<typeof info>>({
	ur: [{required: true, message: '请输入名称', trigger: 'blur'}],
	ti: [{required: true, message: '请输入昵称', trigger: 'blur'}],
	md: [{required: true, validator: validateEmail, trigger: 'blur'}],
});

function validateEmail(rule: any, value: any, callback: any) {
	if (!isEmail(value)) {
		callback(new Error('请输入正确的邮箱地址'))
	} else {
		callback()
	}
}

const pw = ref<any>({
	oldPassword: '',
	newPassword: '',
	confirmPassword: '',
});
const pwForm = ref<FormInstance>();
const pwRule = ref<FormRules<typeof pw>>({
	oldPassword: [{required: true, message: '请输入当前密码', trigger: 'blur'}],
	newPassword: [{required: true, validator: validatePw, trigger: 'blur'}],
	confirmPassword: [{required: true, validator: validateConfirmPw, trigger: 'blur'}],
});

function validatePw(rule: any, value: any, callback: any) {
	if (!passwordStrength(value).id) { // strength bigger than 0
		callback(new Error('密码强度太弱'))
	} else {
		callback()
	}
}

function validateConfirmPw(rule: any, value: any, callback: any) {
	if (value !== pw.value.newPassword) {
		callback(new Error('密码不一致'))
	} else {
		callback()
	}
}

async function save(form: FormInstance, data: any) {
	await form.validate(async (valid) => {
		if (valid) {
			// const {status}: any = await $fetch(`/api/admin/user/update`, {
			// 	method: 'PATCH',
			// 	body: data
			// }).catch(error => {
			// 	notify({type: 'error', title: '保存失败', message: error});
			// });
			// if (status === 'success') {
			// 	notify({type: 'success', title: '保存成功'});
			// } else if (status === 'error') {
			// 	notify({type: 'error', title: '保存失败'});
			// }
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
		<el-tabs v-model="page">
			<el-tab-pane label="基本信息" name="info">
				<el-form ref="infoForm" :model="info" :rules="infoRule" label-width="auto" hide-required-asterisk status-icon>
					<el-form-item prop="ur" label="用户名">
						<el-input v-if="mounted" v-model="info.ur"/>
					</el-form-item>
					<el-form-item prop="ti" label="昵称">
						<el-input v-if="mounted" v-model="info.ti"/>
					</el-form-item>
					<el-form-item prop="md" label="邮箱">
						<el-input v-if="mounted" v-model="info.md"/>
					</el-form-item>
				</el-form>
				<el-button type="primary" @click="save(infoForm, info)">
					保存（暂不支持）
				</el-button>
				<el-button @click="infoForm?.resetFields()">
					重置
				</el-button>
			</el-tab-pane>

			<el-tab-pane label="密码" name="password">
				<el-form ref="pwForm" :model="pw" :rules="pwRule" label-width="auto" hide-required-asterisk status-icon>
					<el-form-item prop="oldPassword" label="当前密码">
						<el-input v-if="mounted" v-model="pw.oldPassword" type="password" show-password/>
					</el-form-item>
					<el-form-item prop="newPassword" label="新密码">
						<el-input v-if="mounted" v-model="pw.newPassword" type="password" show-password/>
					</el-form-item>
					<el-form-item prop="confirmPassword" label="确认密码">
						<el-input v-if="mounted" v-model="pw.confirmPassword" type="password" show-password/>
					</el-form-item>
				</el-form>
				<el-button type="primary" @click="save(pwForm, pw)">
					保存（暂不支持）
				</el-button>
				<el-button @click="pwForm?.resetFields()">
					重置
				</el-button>
			</el-tab-pane>
		</el-tabs>
	</el-card>
</template>

<style scoped>
.el-menu {
	margin-bottom: 1rem;
}
</style>