<script setup lang="ts">
</script>

<template>
	<el-container direction="vertical" class="mh-100vh">
		<el-header class="m-1 b-r-1 b-1px">
			<MainMenu/>
		</el-header>
		<el-container>
			<el-aside width="15%" class="as-l m-1">
				<AsideLeft/>
			</el-aside>
			<el-main>
				<slot/>
			</el-main>
			<el-aside width="15%" class="as-r m-1">
				<AsideRight/>
			</el-aside>
		</el-container>
		<el-footer class="m-1 b-r-1 b-1px">
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

.el-aside {
	text-align: center;
	min-width: 12rem;
}

.el-footer {
	text-align: center;
}

@media screen and (max-width: 65em) {
	.as-l {
		width: 20%;
	}

	.as-r {
		display: none;
	}
}

@media screen and (max-width: 50em) {
	.as-l {
		display: none;
	}
}

@media screen and (max-width: 40em) {
	.el-header {
		margin: 0 !important;
		border-radius: 0 !important;
		border-top: none !important;
		border-left: none !important;
		border-right: none !important;
	}
}
</style>