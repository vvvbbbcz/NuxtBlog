<script setup lang="ts">
import Vditor from "vditor";
import "vditor/dist/index.css";
import moment from "moment";
import ArticleInfoForm from "~/components/ArticleInfoForm.vue";
import { aesEncrypt, generateIV } from "~/utils/aesCrypto";
import type { Article } from "~/utils/dbTypes/article";

const props = defineProps({
	id: Number,
});

const article = ref<Article & { publish: boolean }>({
	id: props.id,
	url: '',
	title: '',
	markdown: '',
	html: '',
	tag: [],
	date: '',
	author: 0,
	password: '',
	iv: [],
	visible: 0,
	drafted: true,
	deleted: false,
	publish: false
});

if (props.id !== undefined) {
	const { data: articleData, status, error } =
		await useFetch('/api/admin/article/get', { query: { id: props.id } });

	if (articleData.value) {
		Object.assign(article.value, articleData.value);
	} else if (status.value === 'error') {
		ElNotification({ type: 'error', title: '获取文章失败', message: error.value?.message });
	}
}

const unsaved = ref<boolean>(false);
const form = ref<InstanceType<typeof ArticleInfoForm>>();

async function update(draft: boolean) {
	if (await form.value?.validate()) {
		const { user }: any = useUserSession();

		article.value.publish = false;
		if (!draft) {
			if (article.value.visible === 2) {
				const iv = generateIV();
				article.value.iv = Array.from(iv);
				article.value.html = await aesEncrypt(article.value.password || "", iv, vditor.getHTML());
			} else {
				article.value.html = vditor.getHTML();
			}

			if (article.value.drafted) {
				article.value.publish = true;
			}
		}

		article.value.markdown = vditor.getValue();
		article.value.date = moment().format("YYYY-MM-DD HH:mm:ss");
		article.value.author = user.value._id; // TODO
		article.value.drafted = draft;

		const { data, status }: any = await $fetch(`/api/admin/article/${props.id ? 'update' : 'create'}`, {
			method: props.id ? 'PATCH' : 'POST',
			body: article.value
		}).catch(error => {
			ElNotification({ type: 'error', title: '保存失败', message: error });
		});
		if (status === 'success') {
			ElMessage({ type: 'success', message: '保存成功' });
			unsaved.value = false;
			if (!props.id) { // create
				await navigateTo(`/admin/article/edit/${data._id}`);
			}
		}
	}
}

let vditor: Vditor;
onMounted(async () => {
	vditor = new Vditor('vditor', {
		height: '100%',
		value: article.value.markdown || "",
		toolbarConfig: {
			pin: true,
		},
		input(value) {
			unsaved.value = true;
		},
		cache: {
			enable: false,
		},
		cdn: "/vditor"
	});
})
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
		<div id="vditor"></div>
	</el-container>
</template>

<style scoped></style>