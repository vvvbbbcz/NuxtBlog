<script setup lang="ts">
import {Moon, Sunny} from "@element-plus/icons-vue";
import type {WritableComputedRef} from "vue";

const isDark = inject('isDark') as WritableComputedRef<boolean, boolean>;
const toggleDark = inject('toggleDark') as (value?: (boolean | undefined)) => boolean;
</script>

<template>
	<div class="d-fl a-i-c j-c-s">
		<el-menu mode="horizontal" class="b-no" router>
			<el-menu-item class="brand" index="/">
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
		<el-button class="m-l-1 m-r-1" :icon="isDark ? Sunny : Moon" circle @click="toggleDark()"/>
	</div>
</template>

<style scoped>
a {
	text-decoration: none;
}

.el-menu {
	width: calc(100% - 4rem);
	background-color: unset;
}

.brand {
	border-radius: 1rem 0 0 1rem;
}

.el-menu-item {
	border-bottom: 0 !important;
}

.el-menu-item.is-active {
	color: var(--el-menu-text-color) !important;
}

@media screen and (max-width: 40em) {
	.brand {
		display: none;
	}
}
</style>