import DeletedArticle from "~/server/utils/models/DeletedArticle";
import {adminFlush} from "~/server/utils/util";

function removeUnnecessary(data: any) {
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
	const data = await DeletedArticle.find()
		.limit(20)
		.sort({_id: -1})
		.populate('author')
		.exec().catch(err => {
			console.error(err);
		});
	if (data) {
		return removeUnnecessary(data);
	} else {
		return [];
	}
});