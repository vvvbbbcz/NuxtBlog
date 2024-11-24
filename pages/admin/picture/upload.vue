<script setup lang="ts">
import {ref} from 'vue'
import {
	ElMessage as message,
	type UploadFile,
	type UploadFiles,
	type UploadInstance,
	type UploadRequestOptions
} from 'element-plus'

definePageMeta({
	layout: 'admin',
	middleware: ['auth'],
});

const uploader = ref<UploadInstance>()

async function upload(options: UploadRequestOptions) {
	options.onSuccess({});
}

async function onChange(file: UploadFile, files: UploadFiles) {
	if (file.size && file.size > 5 * 1024 * 1024) {
		const index = files.indexOf(file);
		files.splice(index, 1);
		message({type: 'error', message: '文件体积不得超过 5MB'})
	}
	console.log(file.size);
}

const submitUpload = () => {
	uploader.value?.submit()
	// console.log(uploader.value?.data);
}
</script>

<template>
	<el-card>
		<el-upload
			ref="uploader"
			:http-request="upload"
			:on-change="onChange"
			:auto-upload="false"
		>
			<template #trigger>
				<el-button type="primary">选择文件</el-button>
			</template>

			<el-button type="primary" @click="submitUpload" style="margin-left: 1rem">上传</el-button>

			<template #tip>
				<div class="el-upload__tip">
					格式仅限 jpg/png，体积不超过 5MB
				</div>
			</template>

			<template #file="fileInfo">
				<el-container>
					<el-input v-model="fileInfo.file.name" style="min-width: 8rem; max-width: 16rem"
							  placeholder="文件名">
					</el-input>
					<el-text class="status-text">
						{{ fileInfo.file.size ? (fileInfo.file.size / 1024).toFixed(2) + 'KB' : '未知大小' }}
					</el-text>
					<div class="status-text">
						<el-text v-if="fileInfo.file.status === 'ready'">准备上传</el-text>
						<el-text v-else-if="fileInfo.file.status === 'uploading'">上传中
							{{ fileInfo.file.percentage }}
						</el-text>
						<el-text v-else-if="fileInfo.file.status === 'success'">上传成功</el-text>
						<el-text v-else-if="fileInfo.file.status === 'fail'">上传失败</el-text>
					</div>
					<el-button
						v-if="fileInfo.file.status !== 'success'"
						type="danger"
						@click="uploader?.handleRemove(fileInfo.file)"
					>
						删除
					</el-button>
					<el-button v-else @click="uploader?.handleRemove(fileInfo.file)">移除</el-button>
				</el-container>
			</template>
		</el-upload>
	</el-card>
</template>

<style scoped>
.el-container {
	padding: 1rem;
	align-items: center;
	justify-content: space-between;
}

.status-text {
	text-align: center;
	min-width: 6rem;
}
</style>