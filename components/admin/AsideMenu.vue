<script setup lang="ts">
const addTab = inject('addTab') as (tab: AdminTab) => void;
</script>

<template>
    <el-card :body-class="'p-0'">
        <el-menu class="b-no" unique-opened>
            <el-menu-item index="blog-settings"
                @click="addTab({ label: '博客设置', name: $event.index, content: 'BlogSettings' })">
                博客设置
            </el-menu-item>

            <el-sub-menu index="articles">
                <template #title>
                    文章管理
                </template>
                <el-menu-item index="new-draft"
                    @click="addTab({ label: '新建草稿', name: $event.index, content: 'ArticleEditor' })">
                    新建草稿
                </el-menu-item>
                <el-menu-item index="article-list" @click="addTab({
                    label: '文章列表',
                    name: $event.index,
                    content: 'ArticleList',
                    props: { type: 'published' }
                })">
                    文章列表
                </el-menu-item>
                <el-menu-item index="draft-list" @click="addTab({
                    label: '草稿列表',
                    name: $event.index,
                    content: 'ArticleList',
                    props: { type: 'drafted' }
                })">
                    草稿列表
                </el-menu-item>
                <el-menu-item index="recycle" @click="addTab({
                    label: '回收站',
                    name: $event.index,
                    content: 'ArticleList',
                    props: { type: 'deleted' }
                })">
                    回收站
                </el-menu-item>
                <el-menu-item index="tags"
                    @click="addTab({ label: '标签管理', name: $event.index, content: 'TagList' })">
                    标签管理
                </el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="files">
                <template #title>
                    文件管理
                </template>
                <el-menu-item index="upload">
                    上传图片
                </el-menu-item>
                <el-menu-item index="pictures">
                    图片列表
                </el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="users">
                <template #title>
                    用户管理
                </template>
                <el-menu-item index="profile"
                    @click="addTab({ label: '个人设置', name: $event.index, content: 'ProfileSettings' })">
                    个人设置
                </el-menu-item>
                <el-menu-item index="user-list"
                    @click="addTab({ label: '用户列表', name: $event.index, content: 'UserList' })">
                    用户列表
                </el-menu-item>
            </el-sub-menu>
        </el-menu>
    </el-card>
</template>

<style scoped></style>
