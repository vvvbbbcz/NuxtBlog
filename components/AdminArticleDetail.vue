<script setup lang="ts">
const props = defineProps(['refresh', 'row', 'column', '$index']);
</script>

<template>
	<span>标签：</span>
	<el-tag type="primary" v-for="tag in props.row.tagId">
		{{ tag.name }}
	</el-tag>
</template>

<style scoped>
.el-tag {
	margin-left: 1rem;
}
</style>