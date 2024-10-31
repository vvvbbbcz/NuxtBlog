import Article from "~/server/utils/models/Article";
import {adminFlush} from "~/server/utils/util";

function removeUnnecessary(data) {
	adminFlush(data);
	data.abstract = undefined;
	data.content = undefined;

	return data;
}

export default defineEventHandler(async (event) => {
	const id = parseInt(getQuery(event).id);
	if (!isNaN(id)) {
		const data = await Article.findById(id).populate(['tagId', 'author']).exec().catch(err => {
			console.error(err);
		});
		if (data) {
			return removeUnnecessary(data);
		} else {
			setResponseStatus(event, 404);
			return null;
		}
	}
	setResponseStatus(event, 400);
	return null;
});