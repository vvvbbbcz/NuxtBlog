<script setup lang="ts">
import sha256sum from "~/utils/sha256sum";
import {ElMessage as message, type FormInstance, type FormRules} from "element-plus";

definePageMeta({
	layout: 'login'
});


const {loggedIn, fetch} = useUserSession();

if (loggedIn.value) {
	await navigateTo('/admin');
}

const data = ref<{ ur: string, pw: string }>({
	ur: '',
	pw: ''
});
const form = ref<FormInstance>();
const rule = ref<FormRules<typeof data>>({
	ur: [{required: true, message: '请输入用户名', trigger: 'blur'}],
	pw: [{required: true, message: '请输入密码', trigger: 'blur'}],
});

async function login() {
	await form.value?.validate(async (valid) => {
		if (valid) {
			const {status}: any = await $fetch('/api/auth/login', {
				method: 'POST',
				body: {
					ur: data.value.ur,
					pw: await sha256sum(data.value.pw)
				}
			}).catch(() => {
				message({type: 'error', message: '登录失败'});
			});
			if (status === 'success') {
				message({type: 'success', message: '登录成功'});
			} else if (status === 'error') {
				message({type: 'error', message: '登录失败'});
				return;
			}

			await fetch();

			if (loggedIn.value) {
				await navigateTo('/admin');
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
	<el-container direction="vertical">
		<h1>
			<SiteBrand/>
		</h1>
		<el-form ref="form" :model="data" :rules="rule" label-width="auto" hide-required-asterisk status-icon>
			<el-form-item prop="ur" label="用户名">
				<el-input v-if="mounted" v-model="data.ur"></el-input>
			</el-form-item>
			<el-form-item prop="pw" label="密码">
				<el-input v-if="mounted" v-model="data.pw" type="password" show-password></el-input>
			</el-form-item>
		</el-form>
		<el-button type="primary" @click="login">
			登录
		</el-button>
	</el-container>
</template>

<style scoped>
h1 {
	margin: 0;
	text-align: center;
}

.el-container {
	height: 100%;
	justify-content: space-between;
}
</style>