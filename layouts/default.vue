<script setup lang="ts">
</script>

<template>
	<el-container direction="vertical" class="mh-100vh">
		<el-header class="m-1 b-r-1 b-1px b-s-cb p-0">
			<MainMenu/>
		</el-header>
		<el-container>
			<el-aside width="15%" class="as-l m-1 t-a-c">
				<AsideLeft/>
			</el-aside>
			<el-main>
				<slot/>
			</el-main>
			<el-aside width="15%" class="as-r m-1 t-a-c">
				<AsideRight/>
			</el-aside>
		</el-container>
		<el-footer class="m-1 b-r-1 b-1px t-a-c">
			<Footer/>
		</el-footer>
	</el-container>
	<Background/>
</template>

<style scoped>
.el-aside {
	min-width: 12rem;
}

@media screen and (max-width: 64em) {
	.as-l {
		width: 20%;
	}

	.as-r {
		display: none;
	}
}

@media screen and (max-width: 48em) {
	.as-l {
		display: none;
	}
}

@media screen and (max-width: 36em) {
	.el-header {
		margin: 0 !important;
		border-radius: 0 !important;
		border-top: none !important;
		border-left: none !important;
		border-right: none !important;
	}
}
</style>