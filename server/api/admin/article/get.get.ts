import Article from "~/server/utils/models/Article";
import {apiStatus} from "~/server/utils/util";

export default defineEventHandler(async (event) => {
	const query = getQuery(event).id;
	const id = parseInt(Array.isArray(query) ? query[0] : query);
	if (!isNaN(id)) {
		const data = await Article.findOne({_id: id, deleted: false})
			.select(['urlName', 'title', 'tagId', 'draft', 'visible'])
			.populate('markdown', ['-_id', 'markdown'])
			.lean();
		if (data) {
			return data;
		} else {
			return apiStatus.error(event, 404);
		}
	}
	return apiStatus.error(event, 400);
});