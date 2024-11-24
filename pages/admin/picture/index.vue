<script setup lang="ts">

definePageMeta({
	layout: 'admin',
	middleware: ['auth'],
});

const {data: pictures, refresh: refreshPictures} = await useFetch(`/api/admin/picture/list`);

const mounted = ref<boolean>(false);
onMounted(() => {
	mounted.value = true;
});
</script>

<template>
	<el-card>
		<!--	<el-form ref="tagForm" :model="newTag" :rules="rule" label-width="auto" hide-required-asterisk status-icon>-->
		<!--		<el-form-item label="名称" prop="name">-->
		<!--			<el-input v-if="mounted" v-model="newTag.name"/>-->
		<!--		</el-form-item>-->
		<!--		<el-form-item label="URL" prop="urlName">-->
		<!--			<el-input v-if="mounted" v-model="newTag.urlName"/>-->
		<!--		</el-form-item>-->
		<!--	</el-form>-->
		<!--	<el-button type="primary" @click="createTag(tagForm)">-->
		<!--		创建-->
		<!--	</el-button>-->
		<!--	<el-button @click="tagForm?.resetFields()">-->
		<!--		重置-->
		<!--	</el-button>-->

		<el-table v-if="mounted" :data="pictures" style="margin-top: 1rem">
			<el-table-column type="expand">
				<template #default="props">
					<div class="table-expand">
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="name" label="文件名" min-width="100">
				<template #default="props">
					<h1>{{ props.row.name }}</h1>
				</template>
			</el-table-column>
			<el-table-column prop="date" label="上传时间" min-width="100"/>
			<el-table-column prop="uid" label="上传者" min-width="100">
				<template #default="scope">
					{{ scope.row.uid.nickname }}
				</template>
			</el-table-column>
			<el-table-column prop="visible" label="可见性" min-width="70">
				<template #default="scope">
					<el-tag v-if="scope.row.visible" type="primary">公开</el-tag>
					<el-tag v-else type="info">私密</el-tag>
				</template>
			</el-table-column>
		</el-table>
	</el-card>
</template>

<style scoped>

</style>