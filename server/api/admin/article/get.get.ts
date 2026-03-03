import Article from "~/server/utils/models/BlogData";
import { fromDB } from "~/utils/dbTypes/article";

export default defineEventHandler(async (event) => {
	const query = getQuery(event).id;
	const id = parseInt(Array.isArray(query) ? query[0] : query);

	if (!isNaN(id) && id > 0) {
		const data = fromDB(await Article.findOne({ _id: id, de: false })
			.select(['ur', 'ti', 'md', 'tg', 'pw', 'vi', 'dr'])
			.lean());
		if (data) {
			return data;
		} else {
			throw createError({ statusCode: 404, statusMessage: 'Article Not Found' });
		}
	}
	throw createError({ statusCode: 400, statusMessage: 'Invalid ID' });
});