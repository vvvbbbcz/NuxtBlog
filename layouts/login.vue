<script setup lang="ts">
useHead({
	title: '登录',
});
</script>

<template>
	<el-container class="mh-100vh">
		<el-card body-class="b-s-bb h-100p">
			<slot/>
		</el-card>
	</el-container>
	<Background/>
</template>

<style>
@import "assets/css/login.css";
</style>

<style scoped>
.el-card {
	height: 25rem;
	width: 20rem;
	margin: auto;
}
</style>
