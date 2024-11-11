<script setup lang="ts">
</script>

<template>
	<el-header class="margin-1rem">
		<el-menu mode="horizontal" class="border-radius-1rem" router>
			<el-menu-item class="first-item" index="/">
				<SiteBrand/>
			</el-menu-item>
			<el-menu-item index="/">
				博客
			</el-menu-item>
			<el-menu-item class="external">
				<a href="https://vvvbbbcz.com" target="_blank">主页</a>
			</el-menu-item>
			<el-menu-item index="/about">
				关于
			</el-menu-item>
		</el-menu>
	</el-header>
</template>

<style scoped>
a {
	text-decoration: none;
	color: var(--el-menu-text-color);
	display: inline-block;
	padding: 0 var(--el-menu-base-level-padding);
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

.el-menu-item.external {
	padding: 0;
}

.first-item {
	border-radius: 1rem 0 0 1rem;
}
</style>