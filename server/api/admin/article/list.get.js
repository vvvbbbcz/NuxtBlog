import Article from "~/server/utils/models/Article";
import {adminFlush} from "~/server/utils/util";

function removeUnnecessary(data) {
	for (const item of data) {
		adminFlush(item);
		item.urlName = undefined;
		item.cover = undefined;
		item.markdown = undefined;
		item.abstract = undefined;
		item.content = undefined;
	}
	return data;
}

export default defineEventHandler(async (event) => {
	const data = await Article.find()
		.limit(20)
		.sort({_id: -1})
		.populate(['tagId', 'author'])
		.exec().catch(err => {
			console.error(err);
		});
	if (data) {
		return removeUnnecessary(data);
	} else {
		return [];
	}
});