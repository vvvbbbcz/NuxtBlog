<script setup lang="ts">
import 'highlight.js/styles/default.css';
import {aesDecrypt} from "~/utils/aesCrypto";
import {Clock, CollectionTag, User} from "@element-plus/icons-vue";

const route = useRoute();

const year = route.params.year;
const name = route.params.name;
const {data: article, error} = await useFetch(`/api/article/get`, {query: {year: year, name: name}});

useHead({
	title: article.value?.ti,
});

const password = ref<string>('');
const incorrect = ref<boolean>(false);

async function decrypt() {
	try {
		article.value.ht = await aesDecrypt(password.value, new Uint8Array(article.value.iv), article.value.ht);
		article.value.vi = 0;
	} catch (e) {
		incorrect.value = true
	}
}

const mounted = ref<boolean>(false);
onMounted(() => {
	mounted.value = true;
});
</script>

<template>
	<el-card v-highlight>
		<div v-if="error?.statusCode === 404">
			<h1 class="main-title m-0">404 Not Found</h1>
			<hr/>
			<p>文章不存在</p>
		</div>
		<div v-else>
			<h1 class="main-title m-0 m-b-1">{{ article?.ti }}</h1>
			<div class="d-fl j-c-c gap-_5 f-w m-b-_5">
				<el-text>
					<el-icon><User/></el-icon>
					作者：{{ article?.au?.ti }}
				</el-text>
				<el-text>
					<el-icon><CollectionTag/></el-icon>
					标签：
					<a v-for="tag in article?.tg" :href="`/tag?name=${tag.urlName}`" class="m-r-_5">
						<el-tag type="primary">
							{{ tag.ti }}
						</el-tag>
					</a>
				</el-text>
			</div>
			<div class="d-fl j-c-c gap-_5 f-w">
				<el-text>
					<el-icon><Clock/></el-icon>
					发布时间：{{ article?.pu }}
				</el-text>
				<el-text>
					<el-icon><Clock/></el-icon>
					上次编辑：{{ article?.up }}
				</el-text>
			</div>
			<hr/>
			<div class="content" v-if="article?.vi === 2">
				<h1>密码保护的文章</h1>
				<el-text>请输入密码：</el-text>
				<el-input v-model="password"></el-input>
				<el-button type="primary" @click="decrypt">解密</el-button>
				<p v-if="incorrect">密码错误</p>
			</div>
			<div v-else class="content" v-html="article?.ht"></div>
		</div>
	</el-card>
</template>

<style scoped>
h1.main-title {
	text-align: center;
	font-size: 2rem;
}
</style>