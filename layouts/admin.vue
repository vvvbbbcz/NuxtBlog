<script setup lang="ts">
useHead({
	title: '后台管理',
});

const {loggedIn} = useUserSession();

if (!loggedIn.value) {
	await navigateTo('/');
}
</script>

<template>
	<el-container direction="vertical" class="mh-100vh">
		<el-header class="m-1 b-r-1 b-1px">
			<AdminHeader/>
		</el-header>
		<el-container>
			<el-aside width="12rem" class="m-1">
				<AdminMenu/>
			</el-aside>
			<el-main class="m-1">
				<slot/>
			</el-main>
		</el-container>
		<el-footer class="m-1 b-r-1">
			<Footer/>
		</el-footer>
	</el-container>
	<Background/>
</template>

<style scoped>
.el-header {
	padding: 0;
	box-sizing: content-box;
}

.el-main {
	padding: 0;
}

.el-footer {
	text-align: center;
}
</style>