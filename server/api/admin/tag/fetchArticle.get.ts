import Tag from "~/server/utils/models/Tag";
import {apiStatus} from "~/server/utils/util";

export default defineEventHandler(async (event) => {
	const query = getQuery(event).id;
	const id = parseInt(Array.isArray(query) ? query[0] : query);
	if (!isNaN(id)) {
		const data = await Tag.findById(id)
			.select('articles')
			.populate('articles', 'title')
			.lean();

		if (data) {
			return data.articles;
		} else {
			return apiStatus.error(event, 404);
		}
	}
	return apiStatus.error(event, 400);
});