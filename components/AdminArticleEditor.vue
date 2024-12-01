<script setup lang="ts">
import Vditor from "vditor";
import "vditor/dist/index.css";
import moment from "moment";
import {ElMessage as message, ElNotification as notify} from "element-plus";
import ArticleInfoForm from "~/components/ArticleInfoForm.vue";
import {aesEncrypt, generateIV} from "~/utils/aesCrypto";

const props = defineProps({
	id: Number,
});

interface Article {
	_id: number | undefined,
	ur: string,
	ti: string,
	md: string,
	ht: string,
	tg: number[],
	date: string,
	au: number,
	pw: string,
	iv: number[]
	vi: number,
	dr: boolean,
	publish: boolean
}

const article = ref<Article>({
	_id: props.id,
	ur: '',
	ti: '',
	md: '',
	ht: '',
	tg: [],
	date: '',
	au: 0,
	pw: '',
	iv: [],
	vi: 0,
	dr: true,
	publish: false,
});

if (props.id) {
	const {data: articleData, status, error}: any =
		await useFetch('/api/admin/article/get', {query: {id: props.id}});
	if (status.value === 'success') {
		Object.assign(article.value, articleData.value);
	} else if (status.value === 'error') {
		notify({type: 'error', title: '获取文章失败', message: error.value.message});
	}
}

const unsaved = ref<boolean>(false);
const form = ref<InstanceType<typeof ArticleInfoForm>>();

async function update(draft: boolean) {
	if (await form.value?.validate()) {
		const {user}: any = useUserSession();

		article.value.publish = false;
		if (!draft) {
			if (article.value.vi === 2) {
				const iv = generateIV();
				article.value.iv = Array.from(iv);
				article.value.ht = await aesEncrypt(article.value.pw, iv, vditor.getHTML());
			} else {
				article.value.ht = vditor.getHTML();
			}
			if (article.value.dr) {
				article.value.publish = true;
			}
		}
		article.value.md = vditor.getValue();
		article.value.date = moment().format("YYYY-MM-DD HH:mm:ss");
		article.value.au = user.value._id; // TODO
		article.value.dr = draft;

		const {data, status, error}: any = await $fetch(`/api/admin/article/${props.id ? 'update' : 'create'}`, {
			method: props.id ? 'PATCH' : 'POST',
			body: article.value
		}).catch(error => {
			notify({type: 'error', title: '保存失败', message: error});
		});
		if (status === 'success') {
			message({type: 'success', message: '保存成功'});
			unsaved.value = false;
			if (!props.id) { // create
				await navigateTo(`/admin/article/edit/${data._id}`);
			}
		} else if (status === 'error') {
			notify({type: 'error', title: '保存失败', message: error.value.message});
		}
	}
}

let vditor: Vditor;
onMounted(async () => {
	vditor = new Vditor('vditor', {
		height: '100%',
		value: article.value.md,
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
	<el-card class="h-100p border-box" :body-class="'h-100p border-box'">
		<el-container class="h-100p" direction="vertical">
			<ArticleInfoForm ref="form" :info="article" @change="unsaved = true"/>
			<el-container class="options">
				<el-button-group>
					<el-button v-if="article.dr" type="primary" @click="update(true)">
						保存草稿
					</el-button>
					<el-button v-else type="primary" @click="update(true)">
						转为草稿
					</el-button>
					<el-button type="primary" @click="update(false)">
						发布
					</el-button>
				</el-button-group>
				<el-text v-if="unsaved" type="warning">未保存</el-text>
			</el-container>
			<div id="vditor"></div>
		</el-container>
	</el-card>
</template>

<script>

</script>

<style scoped>
.tag-input {
	width: 100%;
	margin-bottom: 0.5rem;
}

.options {
	margin-bottom: 1rem;
	align-items: center;
}

.el-button-group {
	margin-right: 1rem;
}

.el-text {
	margin-left: 1rem;
}
</style>