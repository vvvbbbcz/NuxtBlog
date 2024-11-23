<script setup lang="ts">
import Vditor from "vditor";
import "vditor/dist/index.css";
import moment from "moment";
import {ElMessage as message, ElNotification as notify, type FormInstance, type FormRules} from "element-plus";

const props = defineProps({
	id: Number,
});

interface Article {
	_id: number | undefined,
	urlName: string,
	title: string,
	markdown: {
		markdown: string
	},
	content: string,
	tagId: number[],
	date: string,
	author: number,
	visible: boolean,
	draft: boolean
}

const article = ref<Article>({
	_id: props.id,
	urlName: '',
	title: '',
	markdown: {
		markdown: ''
	},
	content: '',
	tagId: [],
	date: '',
	author: 0,
	visible: true,
	draft: true,
});
const form = ref<FormInstance>();
const rule = ref<FormRules<Article>>({
	urlName: [{required: true, message: '请输入 URL 标题', trigger: 'blur'}],
	title: [{required: true, message: '请输入标题', trigger: 'blur'}],
});


if (props.id) {
	const {data: articleData, status, error}: any =
		await useFetch('/api/admin/article/get', {
			query: {
				id: props.id
			}
		});
	if (status.value === 'success') {
		article.value = articleData.value;
	} else if (status.value === 'error') {
		notify({type: 'error', title: '获取文章失败', message: error.value.message});
	}
}

const {data: tagList, execute: startFetchTags, status: tagsStatus} =
	await useLazyFetch('/api/admin/tag/editorList', {
		key: 'tagList',
		immediate: false,
	});
const fetchedTags = ref<boolean>(false);

async function fetchTags() {
	if (fetchedTags.value) {
		useNuxtData('tagList');
	} else {
		await startFetchTags();
		if (tagsStatus.value === 'success') {
			fetchedTags.value = true;
		}
	}
}

const selectedTags = ref<any>(article.value.tagId);
const newTagName = ref<string>('')

async function confirmNewTag() {
	if (newTagName.value) {
		// useFetch('/api/addTag') // TODO
		newTagName.value = '';
	}
}

const unsaved = ref<boolean>(false);

async function update(draft: boolean) {
	await form.value?.validate(async (valid) => {
		if (valid) {
			const {user}: any = useUserSession();

			article.value.markdown.markdown = vditor.getValue();
			article.value.author = user.value.id;
			article.value.tagId = selectedTags.value;
			article.value.draft = draft;

			if (!draft) {
				article.value.content = vditor.getHTML();
				article.value.date = moment().format("YYYY-MM-DD HH:mm:ss");
			}

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
					await navigateTo(`/admin/article/edit/${data.id}`);
				}
			} else if (status === 'error') {
				notify({type: 'error', title: '保存失败', message: error.value.message});
			}
		}
	});
}

const mounted = ref(false);
let vditor: Vditor;
onMounted(async () => {
	mounted.value = true;

	vditor = new Vditor('vditor', {
		height: '100%',
		value: article.value.markdown.markdown,
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
	<el-card class="border-none height-100" :body-class="'height-100 border-box'">
		<el-container class="height-100" direction="vertical">
			<el-form ref="form" :model="article" :rules="rule" label-width="auto" hide-required-asterisk status-icon>
				<el-form-item prop="title" label="标题">
					<el-input v-if="mounted" v-model="article.title" @change="unsaved = true"/>
				</el-form-item>
				<el-form-item prop="urlName" label="URL">
					<el-input v-if="mounted" v-model="article.urlName" @change="unsaved = true"/>
				</el-form-item>
				<el-form-item prop="tagId" label="标签">
					<el-select
						v-if="mounted"
						v-model="selectedTags"
						multiple
						filterable
						remote
						collapse-tags
						collapse-tags-tooltip
						:max-collapse-tags="5"
						remote-show-suffix
						:remote-method="fetchTags"
						:loading="tagsStatus === 'pending'"
						@change="unsaved = true"
					>
						<el-option
							v-for="item in tagList"
							:label="item.name"
							:value="item._id"
						/>
						<template #loading>
							<svg class="circular" viewBox="0 0 50 50">
								<circle class="path" cx="25" cy="25" r="20" fill="none"/>
							</svg>
						</template>
						<template #footer>
							<el-input v-if="mounted" v-model="newTagName" class="tag-input"
									  placeholder="添加标签（暂不支持）"/>
							<el-button type="primary" @click="confirmNewTag">
								添加
							</el-button>
							<el-button @click="newTagName = ''">
								取消
							</el-button>
						</template>
					</el-select>
				</el-form-item>
			</el-form>
			<el-container class="options">
				<el-button-group>
					<el-button v-if="article.draft" type="primary" @click="update(true)">
						保存草稿
					</el-button>
					<el-button v-else type="primary" @click="update(true)">
						转为草稿
					</el-button>
					<el-button type="primary" @click="update(false)">
						发布
					</el-button>
				</el-button-group>
				<el-switch v-model="article.visible"
						   size="large"
						   active-text="公开"
						   inactive-text="私密"
						   @change="unsaved = true"
				/>
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