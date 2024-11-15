<script setup lang="ts">
import Vditor from "vditor";
import "vditor/dist/index.css";
import moment from "moment";

const props = defineProps({
	id: Number,
	draft: Boolean
});

const input = ref(false);

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

const saveStatus = ref({
	type: 'warning',
	msg: '未保存',
	errMsg: '',
	success: () => {
		saveStatus.value.type = 'success';
		saveStatus.value.msg = '保存成功';
		saveStatus.value.errMsg = '';
	},
	fail: (error: string) => {
		saveStatus.value.type = 'danger';
		saveStatus.value.msg = '保存失败';
		saveStatus.value.errMsg = error;
	},
	reset: () => {
		saveStatus.value.type = 'warning';
		saveStatus.value.msg = '未保存';
		saveStatus.value.errMsg = '';
	}
});

async function update(draft: any) {
	const {user} = useUserSession();

	article.value.markdown = vditor.getValue();
	article.value.author._id = user.value?.id;
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
		saveStatus.value.fail(error);
	});
	if (status === 'success') {
		saveStatus.value.success();
		if (!props.id || props.draft !== draft) { // create or convert
			await navigateTo(`/admin/${aimArticleType}/edit/${data.id}`);
		}
	} else if (status === 'error') {
		saveStatus.value.fail(data);
	}
}

let vditor: Vditor;
onMounted(() => {
	input.value = true;

	vditor = new Vditor('vditor', {
		height: '100%',
		value: article.value.markdown,
		toolbarConfig: {
			pin: true,
		},
		input(value) {
			saveStatus.value.reset();
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
					<el-input v-if="input" v-model="article.title"/>
				</el-form-item>
				<el-form-item label="URL">
					<el-input v-if="input" v-model="article.urlName"/>
				</el-form-item>
				<el-form-item label="标签">
					<el-select
						v-if="input"
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
							<el-input v-if="input" v-model="newTagName" class="tag-input" placeholder="添加标签（暂不支持）"/>
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
			<el-container class="publish-settings">
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
						   @change="saveStatus.reset"
				/>
				<el-text :type="saveStatus.type">{{ saveStatus.msg }}</el-text>
			</el-container>
			<el-text :type="saveStatus.type">{{ saveStatus.errMsg }}</el-text>
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

.publish-settings {
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