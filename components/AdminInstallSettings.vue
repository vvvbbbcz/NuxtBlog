<script setup lang="ts">
import { passwordStrength } from "check-password-strength";
import type { FormInstance, FormRules } from "element-plus";
import type { BlogInfo } from "~/utils/dbTypes/blogInfo";
import type { User } from "~/utils/dbTypes/user";
import { isEmail, isUsername } from "~/utils/regularValidator";

const data = ref<{ blogInfo: BlogInfo, user: User } & { confirmPassword: string }>({
    blogInfo: {
        name: '',
        separator: '',
        background: 0,
        description: '',
        icon: 0,
    },
    user: {
        username: '',
        nickname: '',
        email: '',
        password: '',
    },
    confirmPassword: '',
});

const form = ref<FormInstance>();
const rule = ref<FormRules<typeof data>>({
    "blogInfo.name": [{ required: true, message: '请输入名称', trigger: 'blur' }],
    "blogInfo.separator": [{ required: true, message: '请输入分隔符', trigger: 'blur' }],
    "user.username": [{ required: true, validator: validateUsername, trigger: 'blur' }],
    "user.nickname": [{ required: true, message: '请输入昵称', trigger: 'blur' }],
    "user.email": [{ required: true, validator: validateEmail, trigger: 'blur' }],
    "user.password": [{ required: true, validator: validatePassword, trigger: 'blur' }],
    confirmPassword: [{ required: true, validator: validateConfirmPassword, trigger: 'blur' }],
});

function validateUsername(rule: any, value: any, callback: any) {
    if (!isUsername(value)) {
        callback(new Error('请输入正确的用户名（A-Z，a-z，0-9，_，-，3-16 个字符）'))
    } else {
        callback()
    }
}

function validateEmail(rule: any, value: any, callback: any) {
    if (!isEmail(value)) {
        callback(new Error('请输入正确的邮箱地址'))
    } else {
        callback()
    }
}

function validatePassword(rule: any, value: any, callback: any) {
    console.log(value)
    if (!passwordStrength(value).id) { // strength bigger than 0
        callback(new Error('密码强度太弱'))
    } else {
        callback()
    }
}

function validateConfirmPassword(rule: any, value: any, callback: any) {
    if (value !== data.value.user.password) {
        callback(new Error('密码不一致'))
    } else {
        callback()
    }
}

async function save() {
    $fetch(`/api/admin/install`, {
        method: 'POST',
        body: {
            ...data.value,
            confirmPassword: undefined,
        }
    }).then(async ({ status }) => {
        if (status === 'success') {
            ElMessage({ type: 'success', message: '保存成功' });
            await navigateTo('/admin/login');
        }
    }).catch(error => {
        ElNotification({ type: 'error', title: '保存失败', message: error });
    });
}

const mounted = ref(false);
onMounted(() => {
    mounted.value = true;
});
</script>

<template>
    <el-form ref="form" :model="data" :rules="rule" label-width="auto" hide-required-asterisk status-icon>
        <h2>网站信息</h2>
        <el-form-item prop="blogInfo.name" label="博客名称">
            <el-input v-if="mounted" v-model="data.blogInfo.name" />
        </el-form-item>
        <el-form-item prop="blogInfo.separator" label="分隔符">
            <el-input v-if="mounted" v-model="data.blogInfo.separator" />
        </el-form-item>

        <h2>管理员信息</h2>
        <el-form-item prop="user.username" label="用户名">
            <el-input v-if="mounted" v-model="data.user.username" />
        </el-form-item>
        <el-form-item prop="user.nickname" label="昵称">
            <el-input v-if="mounted" v-model="data.user.nickname" />
        </el-form-item>
        <el-form-item prop="user.email" label="邮箱">
            <el-input v-if="mounted" v-model="data.user.email" />
        </el-form-item>
        <el-form-item prop="user.password" label="密码">
            <el-input v-if="mounted" v-model="data.user.password" type="password" show-password />
        </el-form-item>
        <el-form-item prop="confirmPassword" label="确认密码">
            <el-input v-if="mounted" v-model="data.confirmPassword" type="password" show-password />
        </el-form-item>
    </el-form>
    <div class="m-l-a">
        <el-button type="primary" @click="save">
            保存
        </el-button>
    </div>
</template>

<style scoped></style>
