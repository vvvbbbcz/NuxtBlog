<script setup lang="ts">
definePageMeta({
	layout: 'admin',
	middleware: ['auth'],
});

const {user}: any = useUserSession();
</script>

<template>
	<el-card>
		<AdminInstallSettings v-if="user.id < 0"/>
	</el-card>
</template>

<style scoped>

</style>