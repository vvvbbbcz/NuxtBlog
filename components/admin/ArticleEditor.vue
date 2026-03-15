<script setup lang="ts">
import moment from "moment";
import ArticleInfoForm from "~/components/ArticleInfoForm.vue";
import { aesEncrypt, generateIV } from "~/utils/aesCrypto";
import type { Article } from "~/utils/dbTypes/article";
import type { User } from "~/utils/dbTypes/user";
import { MdEditor } from "md-editor-v3";
import 'md-editor-v3/lib/style.css';
import markdownit from "markdown-it";
import Shiki from '@shikijs/markdown-it'

const props = defineProps({
    id: Number,
});

const { user }: { user: ComputedRef<User | null> } = useUserSession();
const isDark = inject('isDark') as WritableComputedRef<boolean, boolean>;
const article = ref<Article>({ visible: 0, drafted: true });
const unsaved = ref<boolean>(false);
const form = ref<InstanceType<typeof ArticleInfoForm>>();
const md = markdownit();

md.use(await Shiki({
    themes: {
        light: 'github-light',
        dark: 'github-dark',
    }
}))

if (props.id !== undefined) {
    const { data, status, error } =
        await useFetch('/api/admin/article/get', { query: { id: props.id } });

    if (data.value) {
        article.value = data.value;
    } else if (status.value === 'error') {
        ElNotification({ type: 'error', title: '获取文章失败', message: error.value?.message });
    }
}

async function update(draft: boolean) {
    if (await form.value?.validate()) {
        const edited = article.value;

        if (!draft) {
            const html = md.render(edited.markdown ?? '');

            if (edited.visible === 2) {
                const iv = generateIV();
                edited.iv = Array.from(iv);
                edited.html = await aesEncrypt(edited.password || "", iv, html);
            } else {
                edited.iv = undefined;
                edited.html = html;
            }
        } else {
            edited.iv = undefined;
            edited.html = undefined;
        }

        article.value.drafted = draft;

        const { data, status }: any = await $fetch(`/api/admin/article/${props.id ? 'update' : 'create'}`, {
            method: props.id ? 'PATCH' : 'POST',
            body: {
                ...edited,
                ...form.value?.getValue(),
                date: moment().format("YYYY-MM-DD HH:mm:ss"),
                year: moment().year(),
                author: user.value?.id
            }
        }).catch(error => {
            ElNotification({ type: 'error', title: '保存失败', message: error });
        });
        if (status === 'success') {
            ElMessage({ type: 'success', message: '保存成功' });
            unsaved.value = false;
            // if (!props.id) { // create
            //     await navigateTo(`/admin/article/edit/${data.id}`);
            // }
        }
    }
}
</script>

<template>
    <el-container class="h-100p" direction="vertical">
        <ArticleInfoForm ref="form" :info="article" @change="unsaved = true" />
        <div class="m-b-1 d-fl a-i-c">
            <el-button-group class="m-r-1">
                <el-button v-if="article.drafted" type="primary" @click="update(true)">
                    保存草稿
                </el-button>
                <el-button v-else type="primary" @click="update(true)">
                    转为草稿
                </el-button>
                <el-button type="primary" @click="update(false)">
                    发布
                </el-button>
            </el-button-group>
            <el-text v-if="unsaved" class="m-l-1" type="warning">未保存</el-text>
        </div>
        <MdEditor v-model="article.markdown" :theme="isDark ? 'dark' : 'light'" />
    </el-container>
</template>

<style scoped></style>
