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
		<el-header class="m-1 b-r-1 b-1px b-s-cb p-0">
			<AdminHeader/>
		</el-header>
		<el-container>
			<el-aside class="m-1">
				<AdminMenu/>
			</el-aside>
			<el-main class="m-1 p-0">
				<slot/>
			</el-main>
		</el-container>
		<el-footer class="m-1 b-r-1 b-1px t-a-c">
			<Footer/>
		</el-footer>
	</el-container>
	<Background/>
</template>

<style>
@import "assets/css/login.css";
@import "assets/css/admin.css";
</style>

<style scoped>
.el-aside {
	width: 20%;
	max-width: 12rem;
	min-width: 9rem;
}

@media screen and (max-width: 36em) {
	.el-header {
		margin: 0 !important;
		border-radius: 0 !important;
		border-top: none !important;
		border-left: none !important;
		border-right: none !important;
	}

	.el-container {
		flex-direction: column;
	}

	.el-aside {
		width: unset;
		max-width: unset;
		min-width: unset;
	}
}
</style>