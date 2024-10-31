<script setup lang="ts">
import SiteBrand from "~/components/SiteBrand.vue";
</script>

<template>
	<el-aside width="15%" class="margin-1rem">
		<el-card>
			<h1>
				<SiteBrand />
			</h1>
		</el-card>
	</el-aside>
</template>

<style scoped>
.el-aside {
	text-align: center;
}

h1 {
	margin: 0;
}
</style>