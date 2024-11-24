import Article from "~/server/utils/models/Article";
import Markdown from "~/server/utils/models/Markdown";
import ArticleContent from "~/server/utils/models/ArticleContent";
import {apiStatus} from "~/server/utils/util";

export default defineEventHandler(async (event) => {
	const id = parseInt((await readBody(event))._id);
	if (!isNaN(id)) {
		const results = await Promise.all([
			Article.deleteOne({_id: id, deleted: true}),
			ArticleContent.deleteOne({_id: id}),
			Markdown.deleteOne({_id: id})
		]);

		if (results[0].deletedCount < 1) {
			return apiStatus.error(event, 404);
		}

		return apiStatus.success;
	}
	return apiStatus.error(event, 400);
});