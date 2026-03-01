import Article from "~/server/utils/models/BlogData";

export default defineEventHandler(async (event) => {
	const query = getQuery(event).id;
	const id = parseInt(Array.isArray(query) ? query[0] : query);
	if (!isNaN(id) && id >= -8192 && id < -256) {
		return Article.find(filters.article.all({ tg: id }))
			.select(['ur', 'ti', 'vi'])
			.populate('au', ['co', 'ti'])
			.lean();
	}
	throw createError({ statusCode: 400, statusMessage: 'Invalid ID' });
});