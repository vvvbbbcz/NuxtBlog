import BlogInfo from "~/server/utils/models/BlogInfo";
import Article from "~/server/utils/models/Article";
import {apiStatus} from "~/server/utils/util";
import truncate from "html-truncate";
import Markdown from "~/server/utils/models/Markdown";
import ArticleContent from "~/server/utils/models/ArticleContent";


function filter(id: number, body: any) {
	const data = {
		article: {
			_id: id,
			urlName: body.urlName,
			title: body.title,
			markdown: id,
			abstract: '',
			content: id,
			tagId: body.tagId,
			publishDate: body.date,
			updateDate: body.date,
			author: body.author,
			visible: body.visible,
			draft: body.draft,
			deleted: false,
		},
		markdown: {
			_id: id,
			markdown: body.markdown.markdown
		},
		content: {
			_id: id,
			content: ''
		}
	}

	if (!body.draft) {
		data.article.abstract = truncate(body.content, 200, {ellipsis: false});
		data.content.content = body.content;
		// model.content = await Vditor.md2html(model.markdown, {
		// 	cdn: "/vditor"
		// });
	}

	return data;
}

export default defineEventHandler(async (event) => {
	const info: any = await BlogInfo.findOne().exec();
	if (!info) {
		return apiStatus.error(event, 500);
	}

	const id = info.articleID++;
	const body = filter(id, await readBody(event))

	await Promise.all([
		Article.create(body.article),
		Markdown.create(body.markdown),
		ArticleContent.create(body.content),
		info.save()
	]);

	return apiStatus.successWith(event, 201, {id: id});
})