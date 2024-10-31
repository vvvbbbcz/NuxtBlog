<script setup lang="ts">
definePageMeta({
	layout: 'login'
});

const input = ref(false);

const username = ref('');
const password = ref('');

onMounted(() => {
	input.value = true;
});
</script>

<template>
	<el-container direction="vertical">
		<h1>
			<SiteBrand/>
		</h1>
		<el-form label-width="auto">
			<el-form-item label="用户名">
				<el-input v-if="input" v-model="username"></el-input>
			</el-form-item>
			<el-form-item label="密码">
				<el-input v-if="input" v-model="password" type="password" show-password></el-input>
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