<script setup lang="ts">
import type {MenuItemRegistered} from "element-plus";

definePageMeta({
	layout: 'admin',
	middleware: ['auth'],
});

const page = ref<number>(1);

function click(item: MenuItemRegistered) {
	page.value = parseInt(item.index);
}
</script>

<template>
	<el-card>
		<el-menu default-active="1" mode="horizontal">
			<el-menu-item index="1" @click="click">文章</el-menu-item>
			<el-menu-item index="2" @click="click">草稿</el-menu-item>
		</el-menu>
		<AdminArticleList v-if="page === 1" type="article" recycle/>
		<AdminArticleList v-else type="draft" recycle/>
	</el-card>
</template>

<style scoped>

</style>