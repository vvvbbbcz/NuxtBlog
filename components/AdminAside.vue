<script setup lang="ts"></script>

<template>
	<el-aside width="12rem" class="margin-1rem">
		<el-card class="border-radius-1rem" :body-style="{padding: 0}">
			<el-menu class="border-none" router unique-opened>
				<el-menu-item class="first-item" index="/admin/settings">
					<template #title>
						博客设置
					</template>
				</el-menu-item>

				<el-sub-menu index="2">
					<template #title>
						文章管理
					</template>
					<el-menu-item index="/admin/draft/create">
						<template #title>
							新建草稿
						</template>
					</el-menu-item>
					<el-menu-item index="/admin/article">
						<template #title>
							文章列表
						</template>
					</el-menu-item>
					<el-menu-item index="/admin/draft">
						<template #title>
							草稿列表
						</template>
					</el-menu-item>
					<el-menu-item index="/admin/recycle">
						<template #title>
							回收站
						</template>
					</el-menu-item>
					<el-menu-item index="/admin/tag">
						<template #title>
							标签管理
						</template>
					</el-menu-item>
				</el-sub-menu>

				<el-sub-menu class="last-item" index="3">
					<template #title>
						文件管理
					</template>
					<el-menu-item index="/admin/picture/upload">
						<template #title>
							上传图片
						</template>
					</el-menu-item>
					<el-menu-item index="/admin/picture">
						<template #title>
							图片列表
						</template>
					</el-menu-item>
				</el-sub-menu>
			</el-menu>
		</el-card>
	</el-aside>
</template>

<style scoped>
</style>