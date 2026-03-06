<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import type { FormValidateCallback } from "element-plus/es/components/form/src/types";
import type { Article } from "~/utils/dbTypes/article";

const props = defineProps<{ info: Article }>();
const undef = undefined;

const form = ref<FormInstance>();
const rule = ref<FormRules<Article>>({
    url: [{ required: true, message: '请输入 URL 标题', trigger: 'blur' }],
    title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
    password: [{ required: true, validator: validatePassword, trigger: 'blur' }],
});

function validatePassword(rule: any, value: any, callback: any) {
    if (props.info.visible === 2 && !value) { // strength bigger than 0
        callback(new Error('请输入密码'))
    } else {
        callback()
    }
}

async function validate(callback?: FormValidateCallback): Promise<boolean> {
    return form.value?.validate(callback) || false;
}

defineExpose({ validate })

const visibleOptions = [
    { value: 0, label: '公开' },
    { value: 1, label: '私密' },
    { value: 2, label: '加密' }
]


const tagList = ref<any[]>([]);
const { data: tagListData, execute: startFetchTags, status: tagsStatus } =
    await useLazyFetch('/api/admin/tag/editorList', { key: 'tagList', immediate: false });

async function fetchTags() {
    const { data: tags } = useNuxtData('tagList');
    if (tags.value) {
        tagList.value = tags.value;
    } else {
        await startFetchTags();
        if (tagsStatus.value === 'success') {
            tagList.value = tagListData.value || [];
        } else if (tagsStatus.value === 'error') {
            ElMessage({ type: 'error', message: '获取标签失败' });
        }
    }
}

const newTagName = ref<string>('')

async function confirmNewTag() {
    if (newTagName.value) {
        // useFetch('/api/addTag') // TODO
        newTagName.value = '';
    }
}

const mounted = ref(false);
onMounted(async () => {
    mounted.value = true;
});
</script>

<template>
    <el-form v-if="mounted" ref="form" :model="props.info" :rules="rule" label-width="auto" hide-required-asterisk
        status-icon>
        <el-form-item prop="ti" label="标题">
            <el-input v-model="props.info.title" @change="$emit('change')" />
        </el-form-item>
        <el-form-item prop="ur" label="URL">
            <el-input v-model="props.info.url" @change="$emit('change')" />
        </el-form-item>
        <el-form-item prop="tg" label="标签">
            <el-select v-model="props.info.tag" multiple filterable remote collapse-tags collapse-tags-tooltip
                :max-collapse-tags="5" remote-show-suffix :remote-method="fetchTags" :loading="tagsStatus === 'pending'"
                @change="$emit('change')">
                <el-option v-for="item in tagList" :label="item.ti || ''" :value="item._id" />
                <template #loading>
                    <svg class="circular" viewBox="0 0 50 50">
                        <circle class="path" cx="25" cy="25" r="20" fill="none" />
                    </svg>
                </template>
                <template #footer>
                    <el-input v-model="newTagName" class="w-100p m-b-_5" placeholder="添加标签（暂不支持）" />
                    <el-button type="primary" @click="confirmNewTag">
                        添加
                    </el-button>
                    <el-button @click="newTagName = ''">
                        取消
                    </el-button>
                </template>
            </el-select>
        </el-form-item>
        <el-form-item prop="visible" label="可见性">
            <div style="display: flex;">
                <el-segmented v-if="props.info.visible !== null" v-model="props.info.visible" :options="visibleOptions">
                    <template #default="{ item }">
                        <div class="flex flex-col items-center gap-2 p-2">
                            <div>{{ item.label }}</div>
                        </div>
                    </template>
                </el-segmented>
                <el-segmented v-else v-model="undef" :options="visibleOptions">
                    <template #default="{ item }">
                        <div class="flex flex-col items-center gap-2 p-2">
                            <div>{{ item.label }}</div>
                        </div>
                    </template>
                </el-segmented>
                <el-form-item prop="pw" label="密码" v-if="props.info.visible === 2">
                    <el-input v-model="props.info.password" type="password" show-password />
                </el-form-item>
            </div>
        </el-form-item>
    </el-form>
</template>

<style scoped></style>
