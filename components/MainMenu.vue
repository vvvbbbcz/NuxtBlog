<script setup lang="ts">
import {Moon, Sunny} from "@element-plus/icons-vue";
import {useDark, useToggle} from "@vueuse/core";

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
	<div class="menu">
		<el-menu mode="horizontal" class="b-no" router>
			<el-menu-item class="brand" index="/">
				<SiteBrand/>
			</el-menu-item>
			<el-menu-item class="item-1" index="/">
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

.menu {
	display: flex;
	align-items: center;
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

	.item-1 {
		border-radius: 1rem 0 0 1rem;
	}
}
</style>