<script setup lang="ts">
const { data: articles, refresh } = await useFetch('/api/admin/article/list/deleted');

async function remove(id: number) {
    $fetch('/api/admin/article/delete', {
        method: 'DELETE',
        body: { id: id }
    }).then(async ({ status }) => {
        if (status === 'success') {
            localStorage.removeItem(`article-${id}`);
            ElMessage({ type: 'success', message: '删除成功' });
            await refresh();
        }
    }).catch(error => {
        ElNotification({ type: 'error', title: '删除失败', message: error });
    });
}

async function restore(id: number) {
    $fetch(`/api/admin/article/restore`, {
        method: 'PATCH',
        body: { id: id }
    }).then(async ({ status }) => {
        if (status === 'success') {
            ElMessage({ type: 'success', message: '还原成功' });
            await refresh();
        }
    }).catch(error => {
        ElNotification({ type: 'error', title: '还原失败', message: error });
    });
}

const mounted = ref<boolean>(false);
onMounted(() => {
    mounted.value = true;
});
</script>

<template>
    <el-button class="m-l-1" type="primary" @click="refresh()">
        刷新
    </el-button>

    <el-table v-if="mounted && articles" :data="articles">
        <el-table-column type="expand">
            <template #default="scope">
                <div class="table-expand">
                    <el-popconfirm title="确认删除？" @confirm="remove(scope.row.id)">
                        <template #reference>
                            <el-button type="danger">
                                彻底删除
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
            </template>
        </el-table-column>

        <el-table-column prop="title" label="标题" min-width="150">
            <template #default="scope">
                <span class="title">{{ scope.row.title }}</span>
            </template>
        </el-table-column>

        <el-table-column prop="author" label="作者" min-width="100">
            <template #default="scope">
                {{ scope.row.author.nickname }}
            </template>
        </el-table-column>

        <el-table-column prop="visible" label="可见性" min-width="70">
            <template #default="scope">
                <el-tag v-if="scope.row.visible === 0" type="primary">公开</el-tag>
                <el-tag v-else-if="scope.row.visible === 1" type="info">私密</el-tag>
                <el-tag v-else-if="scope.row.visible === 2" type="success">加密</el-tag>
            </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="85">
            <template #default="scope">
                <el-button type="primary" @click="restore(scope.row.id)">
                    还原
                </el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<style scoped>
.title {
    font-size: 1.2rem;
}

.table-expand {
    margin-left: 2rem;
}
</style>
