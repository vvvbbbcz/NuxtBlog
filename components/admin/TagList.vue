<script setup lang="ts">

import type { FormInstance, FormRules } from 'element-plus';
import type { Tag } from '~/utils/dbTypes/tag';

const { data: tags, refresh: refreshTags } = await useFetch(`/api/admin/tag/list`);

const newTag = ref<Tag>({
    url: '',
    name: '',
});
const tagForm = ref<FormInstance>();
const rule = ref<FormRules<Tag>>({
    url: [{ required: true, message: '请输入 URL 名称', trigger: 'blur' }],
    name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
});

async function createTag() {
    if (await tagForm.value?.validate()) {
        $fetch(`/api/admin/tag/create`, {
            method: 'POST',
            body: newTag.value
        }).then(async ({ status }) => {
            if (status === 'success') {
                tagForm.value?.resetFields();
                ElNotification({ type: 'success', title: '创建成功' });
                await refreshTags();
            }
        }).catch(error => {
            ElNotification({ type: 'error', title: '创建失败', message: error });
        });
    }
}

const mounted = ref<boolean>(false);
onMounted(() => {
    mounted.value = true;
});
</script>

<template>
    <el-form ref="tagForm" :model="newTag" :rules="rule" label-width="auto" hide-required-asterisk status-icon>
        <el-form-item label="名称" prop="name">
            <el-input v-if="mounted" v-model="newTag.name" />
        </el-form-item>
        <el-form-item label="URL" prop="url">
            <el-input v-if="mounted" v-model="newTag.url" />
        </el-form-item>
    </el-form>
    <el-button type="primary" @click="createTag()">
        创建
    </el-button>
    <el-button @click="tagForm?.resetFields()">
        重置
    </el-button>

    <el-table v-if="mounted" :data="tags || []" class="m-t-1">
        <el-table-column type="expand">
            <template #default="props">
                <div class="table-expand">
                    <AdminTagDetail :refresh="refreshTags" :tag="props.row" />
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" min-width="100">
            <template #default="props">
                <h1>{{ props.row.name }}</h1>
            </template>
        </el-table-column>
        <el-table-column prop="articles.length" label="文章数" min-width="100" />
    </el-table>
</template>

<style scoped>
h1 {
    margin: 0 0.5rem;
    display: inline-block;
}

.table-expand {
    margin-left: 2rem;
}
</style>
