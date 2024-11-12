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
	date: '',
	author: 0,
	visible: true,
});

if (props.id) {
	const type = props.draft ? 'draft' : 'article';
	const {data} = await useFetch(`/api/admin/${type}/get?id=${props.id}`);
	if (data && data.value) {
		article.value = data.value;
	}
}


const loading = ref(false)
const tags = ref([{}]);

async function fetchTags() {
	const {data} = await $fetch(`/api/admin/tag/editorList`, {method: 'GET'});

	if (data.value) {
		tags.value = data.value;
	} else {
		tags.value.push({
			_id: null,
			name: '无法获取标签列表'
		});
	}
}

const selectedTags = ref([{}]);
const selectTag = (tag: any) => {
	if (tag._id != null) {
		selectedTags.value.push(tag);
	}
}

const newTagName = ref('')
const confirmNewTag = () => {
	if (newTagName.value) {
		// useFetch('/api/addTag') // TODO
		clear()
	}
}

function clear() {
	newTagName.value = ''
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

async function convertToDraft() {
	await update(true);
}

async function saveDraft() {
	await update(true);
}

async function publish() {
	await update(false);
}

async function update(draft: any) {
	article.value.markdown = vditor.getValue();

	if (!draft) {
		article.value.content = vditor.getHTML();
		article.value.date = moment().format("YYYY-MM-DD HH:mm:ss");
	}

	const aimArticleType = draft ? 'draft' : 'article';
	const apiType = props.id ? (props.draft === draft ? 'update' : 'convertTo') : 'create';
	const method = props.id ? 'PATCH' : 'POST';

	const {status}: any = await $fetch(`/api/admin/${aimArticleType}/${apiType}`, {
		method: method,
		body: article.value
	}).catch(error => {
		saveStatus.value.fail(error);
	});
	if (status === 'success') {
		saveStatus.value.success();
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
						multiple
						filterable
						collapse-tags
						placeholder="暂不支持"
						:loading="loading"
						style="width: 100%"
					>
						<template #loading>
							<svg class="circular" viewBox="0 0 50 50">
								<circle class="path" cx="25" cy="25" r="20" fill="none"/>
							</svg>
						</template>
						<template #footer>
							<el-input v-if="input" class="tag-input"/>
							<el-button type="primary" @click="confirmNewTag">
								添加
							</el-button>
							<el-button @click="clear">
								取消
							</el-button>
						</template>
					</el-select>
				</el-form-item>
			</el-form>
			<el-container class="publish-settings">
				<el-button-group>
					<el-button v-if="props.draft" type="primary" @click="saveDraft">
						保存草稿
					</el-button>
					<el-button v-else type="primary" @click="convertToDraft">
						转为草稿
					</el-button>
					<el-button type="primary" @click="publish">
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