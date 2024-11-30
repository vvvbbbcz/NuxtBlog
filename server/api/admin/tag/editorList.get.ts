import Tag from "~/server/utils/models/BlogData";
import filters from "~/server/utils/filters";

export default defineEventHandler(async () => {
	return Tag.find(filters.tag)
		.limit(20)
		.sort({_id: -1})
		.select('ti')
		.lean();
});