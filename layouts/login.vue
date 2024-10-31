<script setup lang="ts">

</script>

<template>
	<el-container class="min-100vh">
		<el-card body-style="box-sizing: border-box; height: 100%;">
			<slot/>
		</el-card>
	</el-container>
	<Background/>
</template>

<style scoped>
.el-card {
	height: 25rem;
	width: 20rem;
	margin: auto;
}
</style>