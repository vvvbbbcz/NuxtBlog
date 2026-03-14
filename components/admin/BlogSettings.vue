<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import type { BlogInfo } from "~/utils/dbTypes/blogInfo";

const { data } = await useFetch(`/api/admin/blogInfo/get`);
let blogInfo = ref<BlogInfo>({});
if (data.value) blogInfo.value = data.value;

const form = ref<FormInstance>();
const rule = ref<FormRules<typeof blogInfo>>({
    name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    separator: [{ required: true, message: '请输入分隔符', trigger: 'blur' }],
})

async function save() {
    await form.value?.validate(async (valid) => {
        if (valid) {
            $fetch(`/api/admin/blogInfo/update`, {
                method: 'PATCH',
                body: blogInfo.value
            }).then(({ status }) => {
                if (status === 'success') {
                    ElMessage({ type: 'success', message: '保存成功' });
                }
            }).catch(error => {
                ElNotification({ type: 'error', title: '保存失败', message: error });
            });
        }
    });
}

const mounted = ref(false);
onMounted(() => {
    mounted.value = true;
});
</script>

<template>
    <el-form ref="form" :model="blogInfo" :rules="rule" label-width="auto" hide-required-asterisk status-icon>
        <h2>网站信息</h2>
        <el-form-item prop="name" label="博客名称">
            <el-input v-if="mounted" v-model="blogInfo.name" />
        </el-form-item>
        <el-form-item prop="separator" label="分隔符">
            <el-input v-if="mounted" v-model="blogInfo.separator" />
        </el-form-item>
    </el-form>
    <div class="m-l-a">
        <el-button type="primary" @click="save()">
            保存
        </el-button>
        <el-button @click="form?.resetFields()">
            重置
        </el-button>
    </div>
</template>

<style scoped></style>
