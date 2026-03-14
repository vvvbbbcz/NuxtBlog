<script setup lang="ts">
import BlogSettings from './BlogSettings.vue';
import ArticleEditor from './ArticleEditor.vue';
import ArticleList from './ArticleList.vue';
import TagList from './TagList.vue';
import UserList from './UserList.vue';
import ProfileSettings from './ProfileSettings.vue';

interface Tab {
    label: string;
    name: string;
    content: any;
    props?: Object;
}

const props = defineProps<{ addTab: (tab: Tab) => void }>();

function click(tab: Tab) {
    props.addTab(tab);
}
</script>

<template>
    <el-card :body-class="'p-0'">
        <el-menu class="b-no" unique-opened>
            <el-menu-item index="blog-settings"
                @click="click({ label: '博客设置', name: $event.index, content: markRaw(BlogSettings) })">
                博客设置
            </el-menu-item>

            <el-sub-menu index="articles">
                <template #title>
                    文章管理
                </template>
                <el-menu-item index="new-draft"
                    @click="click({ label: '新建草稿', name: $event.index, content: markRaw(ArticleEditor) })">
                    新建草稿
                </el-menu-item>
                <el-menu-item index="article-list" @click="click({
                    label: '文章列表',
                    name: $event.index,
                    content: markRaw(ArticleList),
                    props: { type: 'published' }
                })">
                    文章列表
                </el-menu-item>
                <el-menu-item index="draft-list" @click="click({
                    label: '草稿列表',
                    name: $event.index,
                    content: markRaw(ArticleList),
                    props: { type: 'drafted' }
                })">
                    草稿列表
                </el-menu-item>
                <el-menu-item index="recycle" @click="click({
                    label: '回收站',
                    name: $event.index,
                    content: markRaw(ArticleList),
                    props: { type: 'deleted' }
                })">
                    回收站
                </el-menu-item>
                <el-menu-item index="tags"
                    @click="click({ label: '标签管理', name: $event.index, content: markRaw(TagList) })">
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
                    @click="click({ label: '个人设置', name: $event.index, content: markRaw(ProfileSettings) })">
                    个人设置
                </el-menu-item>
                <el-menu-item index="user-list"
                    @click="click({ label: '用户列表', name: $event.index, content: markRaw(UserList) })">
                    用户列表
                </el-menu-item>
            </el-sub-menu>
        </el-menu>
    </el-card>
</template>

<style scoped></style>
