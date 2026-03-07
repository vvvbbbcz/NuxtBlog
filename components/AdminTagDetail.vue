<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import type { Tag } from "~/utils/dbTypes/tag";

const props = defineProps<{ refresh: any, tag: Tag }>();

const editing = ref<boolean>(false);

const { data: articles, execute, status } =
    await useLazyFetch(`/api/admin/tag/fetchArticle`, { query: { id: props.tag.id }, immediate: false });

function fetch() {
    if (status.value === 'success') {
        hide.value = false;
    } else {
        execute();
    }
}

const hide = ref<boolean>(false);

const newTag = ref<Tag>({
    url: props.tag.url,
    name: props.tag.name,
});
const tagForm = ref<FormInstance>();
const rule = ref<FormRules<Tag>>({
    url: [{ required: true, message: '请输入 URL 名称', trigger: 'blur' }],
    name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
});

async function save() {
    if (await tagForm.value?.validate()) {
        $fetch(`/api/admin/tag/update`, {
            method: 'PATCH',
            body: {
                id: props.tag.id,
                ...newTag.value
            }
        }).then(({ status }) => {
            if (status === 'success') {
                ElNotification({ type: 'success', title: '保存成功' });
                props.tag.url = newTag.value.url;
                props.tag.name = newTag.value.name;
            }
        }).catch(error => {
            ElNotification({ type: 'error', title: '保存失败', message: error });
        });
    }
}

async function remove() {
    const { status }: any = await $fetch(`/api/admin/tag/remove`, {
        method: 'DELETE',
        body: {
            id: props.tag.id
        }
    }).catch(error => {
        ElNotification({ type: 'error', title: '删除失败', message: error });
    });
    if (status === 'success') {
        ElNotification({ type: 'success', title: '删除成功' });
        await props.refresh();
    } else if (status === 'error') {
        ElNotification({ type: 'error', title: '删除失败' });
    }
}
</script>

<template>
    <div v-if="!editing" class="m-b-1">
        <span>文章: </span>
        <el-button @click="fetch()">
            获取 / 刷新
        </el-button>

        <el-table v-if="(status === 'success')" :data="articles ?? []" class="w-100p">
            <el-table-column prop="title" label="标题" min-width="100">
                <template #default="props">
                    <h1>{{ props.row.title }}</h1>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
                <template #default>
                    <el-button type="primary">
                        编辑（暂不支持）
                    </el-button>
                    <el-button type="danger">
                        移除（暂不支持）
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div v-else>
        <el-form ref="tagForm" :model="newTag" :rules="rule" label-width="auto" hide-required-asterisk status-icon>
            <el-form-item label="名称" prop="ti">
                <el-input v-model="newTag.name" />
            </el-form-item>
            <el-form-item label="URL" prop="ur">
                <el-input v-model="newTag.url" />
            </el-form-item>
        </el-form>
    </div>

    <div v-if="!editing">
        <el-button type="primary" @click="editing = true">
            编辑
        </el-button>
        <el-popconfirm title="确认删除？" @confirm="remove">
            <template #reference>
                <el-button type="danger">
                    删除
                </el-button>
            </template>
            <template #actions="{ confirm, cancel }">
                <el-button size="small" type="primary" @click="cancel">
                    取消
                </el-button>
                <el-button type="danger" size="small" plain @click="confirm">
                    确认
                </el-button>
            </template>
        </el-popconfirm>
    </div>
    <el-button-group v-else>
        <el-button @click="editing = false">
            退出编辑
        </el-button>
        <el-button type="primary" @click="save()">
            保存
        </el-button>
    </el-button-group>
</template>

<style scoped>
h1 {
    margin: 0 0.5rem;
    display: inline-block;
}
</style>
