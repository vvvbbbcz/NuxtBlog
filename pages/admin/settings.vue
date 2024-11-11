<script setup lang="ts">
import {passwordStrength} from "check-password-strength";
import sha256sum from "~/utils/sha256sum";

definePageMeta({
	layout: 'admin'
});

const input = ref(false);
const saveFailed = ref(false);
const data = ref({
	name: '',
	icon: 0,
	separator: '',
	background: '',
	username: '',
	nickname: '',
	email: '',
	password: '',
});
const password = ref('');
const confirmPassword = ref('');
const pwdStrength = ref({
	type: 'danger',
	msg: '过弱'
});

function checkStrength() {
	const {id} = passwordStrength(password.value);
	switch (id) {
		case 0:
			pwdStrength.value.type = 'danger';
			pwdStrength.value.msg = '过弱';
			break;
		case 1:
			pwdStrength.value.type = 'warning';
			pwdStrength.value.msg = '弱';
			break;
		case 2:
			pwdStrength.value.type = 'warning';
			pwdStrength.value.msg = '中';
			break;
		case 3:
			pwdStrength.value.type = 'success';
			pwdStrength.value.msg = '强';
			break;
	}
}

async function save() {
	if (password.value !== confirmPassword.value) {
		saveFailed.value = true;
		return;
	}

	data.value.password = await sha256sum(password.value);
	const {status}: any = await $fetch(`/api/admin/blogInfo/create`, {
		method: 'POST',
		body: data.value
	}).catch(() => {
		saveFailed.value = true;
	});
	if (status === 'success') {
		await navigateTo('/admin/login');
	}
}

onMounted(() => {
	input.value = true;
});
</script>

<template>
	<el-card>
		<el-form label-width="auto">
			<h2>网站信息</h2>
			<el-form-item label="博客名称">
				<el-input v-if="input" v-model="data.name"/>
			</el-form-item>
			<el-form-item label="分隔符">
				<el-input v-if="input" v-model="data.separator"/>
			</el-form-item>

			<h2>管理员信息</h2>
			<el-form-item label="用户名">
				<el-input v-if="input" v-model="data.username"/>
			</el-form-item>
			<el-form-item label="昵称">
				<el-input v-if="input" v-model="data.nickname"/>
			</el-form-item>
			<el-form-item label="邮箱">
				<el-input v-if="input" v-model="data.email"/>
			</el-form-item>
			<el-form-item class="pw-input" label="密码">
				<el-input v-if="input" v-model="password" type="password" @input="checkStrength" show-password/>
			</el-form-item>
			<div class="pw-text">
				<el-text :type="pwdStrength.type">密码强度：{{ pwdStrength.msg }}</el-text>
			</div>
			<el-form-item class="pw-input" label="确认密码">
				<el-input v-if="input" v-model="confirmPassword" type="password" show-password/>
			</el-form-item>
			<div class="pw-text">
				<el-text v-if="input" type="danger" v-show="password !== confirmPassword">两次密码不一致</el-text>
			</div>
		</el-form>
		<div style="margin-left: auto">
			<el-button type="primary" @click="save">
				保存
			</el-button>
			<el-text v-if="saveFailed" type="danger">保存失败</el-text>
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