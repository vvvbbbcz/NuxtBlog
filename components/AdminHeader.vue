<script setup lang="ts">
import {ElMessage as message} from "element-plus";
import {useDark, useToggle} from "@vueuse/core";
import {Moon, Sunny} from "@element-plus/icons-vue";

const {loggedIn, clear} = useUserSession();

const isDark = useDark()
const toggleDark = useToggle(isDark)

async function logout() {
	await clear();
	message({type: 'success', message: '退出成功'});
	if (!loggedIn.value) {
		await navigateTo('/admin/login');
	}
}
</script>

<template>
	<div class="menu">
		<el-menu mode="horizontal" class="b-no" router>
			<el-menu-item class="first" index="/">
				返回主页
			</el-menu-item>
		</el-menu>
		<el-button type="primary" @click="logout">退出</el-button>
		<el-button class="m-l-1 m-r-1" :icon="isDark ? Sunny : Moon" circle @click="toggleDark()"/>
	</div>
</template>

<style scoped>
.menu {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.el-menu {
	width: calc(100% - 8rem);
	background-color: unset;
}

.el-menu-item.first {
	border-radius: 1rem 0 0 1rem;
}

.el-menu-item {
	border-bottom: 0 !important;
}

.el-menu-item.is-active {
	color: var(--el-menu-text-color) !important;
}
</style>