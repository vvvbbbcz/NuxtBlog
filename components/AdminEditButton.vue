<script setup lang="ts">
defineProps({
	id: Number
})

function edit() {
}
</script>

<template>
	<el-button-group>
		<el-button>
			Detail
		</el-button>
		<RouterLink :to="`/admin/drafts/edit?id=${id}`">
			<el-button type="primary" @click="">
				编辑
			</el-button>
		</RouterLink>
	</el-button-group>
</template>

<style scoped>

</style>