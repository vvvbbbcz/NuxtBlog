import Article from "~/server/utils/models/BlogData";
import filters from "~/server/utils/filters";

export default defineEventHandler(async () => {
	return Article.find(filters.recycle)
		.limit(20)
		.sort({_id: -1})
		.select(['ti', 'vi', 'dr'])
		.populate('au', ['co', 'ti'])
		.lean();
});
