import Article from "~/server/utils/models/Article";
import {flush} from "~/server/utils/util";

function removeUnnecessary(data) {
	for (const item of data) {
		flush(item);
		item.content = undefined;
	}
	return data;
}

export default defineEventHandler(async (event) => {
	const data = await Article.find({visible: true})
		.limit(10)
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
