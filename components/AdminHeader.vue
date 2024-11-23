<script setup lang="ts">
import {ElMessage as message} from "element-plus";

const {loggedIn, clear} = useUserSession();

async function logout() {
	await clear();
	message({type: 'success', message: '退出成功'});
	if (!loggedIn.value) {
		await navigateTo('/admin/login');
	}
}
</script>

<template>
	<el-header class="margin-1rem">
		<el-menu mode="horizontal" class="border-radius-1rem" router>
			<el-menu-item class="first-item" index="/">
				返回博客主页
			</el-menu-item>
			<el-button type="primary" @click="logout">退出</el-button>
		</el-menu>
	</el-header>
</template>

<style scoped>
.el-menu {
	align-items: center;
	justify-content: space-between;
}

.el-header {
	padding: 0 !important;
}

.el-menu {
	border: 1px solid var(--el-menu-border-color);
}

.el-menu-item {
	border-bottom: 0 !important;
}

.el-menu-item.is-active {
	color: var(--el-menu-text-color) !important;
}

.el-button {
	margin-right: 1rem;
}

.first-item {
	border-radius: 1rem 0 0 1rem;
}
</style>