import Article from "~/server/utils/models/Article";
import truncate from "html-truncate";
import {apiStatus} from "~/server/utils/util";
import Markdown from "~/server/utils/models/Markdown";
import ArticleContent from "~/server/utils/models/ArticleContent";

function filter(body: any) {
	const data = {
		_id: body._id,
		article: {
			urlName: body.urlName,
			title: body.title,
			tagId: body.tagId,
			updateDate: body.date,
			author: body.author._id,
			visible: body.visible,
			draft: body.draft,
			deleted: false,
		},
		markdown: {
			markdown: body.markdown
		},
		content: {
			content: ''
		}
	}

	if (!body.draft) {
		Object.defineProperty(data.article, 'abstract', {
			value: truncate(body.content, 200, {ellipsis: false}),
			enumerable: true
		});
		data.content.content = body.content;
	}

	if (body.publish) {
		Object.defineProperty(data.article, 'publishDate', {value: body.date, enumerable: true});
	}

	return data;
}

export default defineEventHandler(async (event) => {
	const body = filter(await readBody(event));
	const id = parseInt(body._id);
	if (!isNaN(id)) {
		const result = await Article.updateOne({_id: id}, body.article).exec();
		if (result.matchedCount < 1) {
			return apiStatus.error(event, 404);
		} else {
			if (body.article.draft) {
				await Markdown.updateOne({_id: id}, body.markdown)
			} else {
				await Promise.all([
					Markdown.updateOne({_id: id}, body.markdown),
					ArticleContent.updateOne({_id: id}, body.content)
				]);
			}
			return apiStatus.success;
		}
	}
	return apiStatus.error(event, 400);
});