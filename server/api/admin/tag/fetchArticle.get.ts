import Article from "~/server/utils/models/BlogData";
import apiStatus from "~/server/utils/apiStatus";

export default defineEventHandler(async (event) => {
	const query = getQuery(event).id;
	const id = parseInt(Array.isArray(query) ? query[0] : query);
	if (!isNaN(id) && id >= -100000 && id <= -1001) {
		return Article.find({_id: {$gt: 0}, tg: id})
			.select(['ur', 'ti', 'vi'])
			.populate('au', ['co', 'ti'])
			.lean();
	}
	return apiStatus.error(event, {code: 400});
});