import Article from "~/server/utils/models/BlogData";
import filters from "~/server/utils/filters";

export default defineEventHandler(async () => {
	return Article.find(filters.article)
		.limit(20)
		.sort({_id: -1})
		.select(['ur', 'ti', 'pu', 'up', 'vi'])
		.populate('au', ['co', 'ti'])
		.populate('tg', 'ti')
		.lean();
});