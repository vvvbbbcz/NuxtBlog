<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';

definePageMeta({
	layout: 'login'
});


const { loggedIn, fetch } = useUserSession();

if (loggedIn.value) {
	await navigateTo('/admin');
}

interface Data {
	username: string;
	password: string;
}

const data = ref<Data>({
	username: '',
	password: ''
});
const form = ref<FormInstance>();
const rule = ref<FormRules<Data>>({
	username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
	password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
});

async function login() {
	await form.value?.validate(async (valid) => {
		if (valid) {
			$fetch('/api/auth/login', {
				method: 'POST',
				body: data.value
			}).then(async ({ status }) => {
				if (status === 'success') {
					ElMessage({ type: 'success', message: '登录成功' });

					await fetch();

					if (loggedIn.value) {
						await navigateTo('/admin');
					}
				}
			}).catch(() => {
				ElMessage({ type: 'error', message: '登录失败' });
			});
		}
	});
}

const mounted = ref(false);
onMounted(() => {
	mounted.value = true;
});
</script>

<template>
	<el-container direction="vertical">
		<h1 class="m-0">
			<SiteBrand />
		</h1>
		<el-form ref="form" :model="data" :rules="rule" label-width="auto" hide-required-asterisk status-icon>
			<el-form-item prop="ur" label="用户名">
				<el-input v-if="mounted" v-model="data.username"></el-input>
			</el-form-item>
			<el-form-item prop="pw" label="密码">
				<el-input v-if="mounted" v-model="data.password" type="password" show-password></el-input>
			</el-form-item>
		</el-form>
		<el-button type="primary" @click="login">
			登录
		</el-button>
	</el-container>
</template>

<style scoped>
h1 {
	text-align: center;
}

.el-container {
	height: 100%;
	justify-content: space-between;
}
</style>