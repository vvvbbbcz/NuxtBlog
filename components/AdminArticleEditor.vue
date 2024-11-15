<script setup lang="ts">
import Vditor from "vditor";
import "vditor/dist/index.css";
import moment from "moment";
import {ElNotification as notify} from "element-plus";

const props = defineProps({
	id: Number,
	draft: Boolean
});

const mounted = ref(false);

const article = ref({
	_id: props.id,
	urlName: '',
	title: '',
	markdown: '',
	content: '',
	tagId: [],
	date: '',
	author: {
		_id: 0
	},
	visible: true,
});

if (props.id) {
	const type = props.draft ? 'draft' : 'article';
	const {data: articleData} = await useFetch(`/api/admin/${type}/get?id=${props.id}`);
	if (articleData && articleData.value) {
		article.value = articleData.value;
	}
}

const {data: tagList, execute: startFetchTags, status: tagsStatus} = await useLazyFetch('/api/admin/tag/editorList', {
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

async function update(draft: any) {
	const {user}: any = useUserSession();

	article.value.markdown = vditor.getValue();
	article.value.author._id = user.value.id;
	article.value.tagId = selectedTags.value;

	if (!draft) {
		article.value.content = vditor.getHTML();
		article.value.date = moment().format("YYYY-MM-DD HH:mm:ss");
	}

	const aimArticleType = draft ? 'draft' : 'article';
	const apiType = props.id ? (props.draft === draft ? 'update' : 'convertTo') : 'create';
	const method = props.id ? 'PATCH' : 'POST';

	const {data, status}: any = await $fetch(`/api/admin/${aimArticleType}/${apiType}`, {
		method: method,
		body: article.value
	}).catch(error => {
		notify({type: 'error', title: '创建失败', message: error});
	});
	if (status === 'success') {
		notify({type: 'success', title: '创建成功'});
		unsaved.value = false;
		if (!props.id || props.draft !== draft) { // create or convert
			await navigateTo(`/admin/${aimArticleType}/edit/${data.id}`);
		}
	} else if (status === 'error') {
		notify({type: 'error', title: '创建失败'});
	}
}

let vditor: Vditor;
onMounted(() => {
	mounted.value = true;

	vditor = new Vditor('vditor', {
		height: '100%',
		value: article.value.markdown,
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
			<el-form label-width="auto">
				<el-form-item label="标题">
					<el-input v-if="mounted" v-model="article.title"/>
				</el-form-item>
				<el-form-item label="URL">
					<el-input v-if="mounted" v-model="article.urlName"/>
				</el-form-item>
				<el-form-item label="标签">
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
					<el-button v-if="props.draft" type="primary" @click="update(true)">
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