<script setup lang="ts">
const {loggedIn} = useUserSession();

if (!loggedIn.value) {
	await navigateTo('/');
}
</script>

<template>
	<el-container direction="vertical" class="min-100vh">
		<AdminHeader/>
		<el-container>
			<AdminAside/>
			<el-main class="margin-1rem">
				<slot/>
			</el-main>
		</el-container>
		<Footer/>
	</el-container>
	<Background/>
</template>

<style scoped>
.el-main {
	padding: 0;
}
</style>