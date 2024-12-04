import Article from "~/server/utils/models/BlogData";
import apiStatus from "~/server/utils/apiStatus";

export default defineEventHandler(async (event) => {
	const id = parseInt((await readBody(event))._id);
	if (!isNaN(id) && id > 0) {
		const result = await Article.updateOne({_id: id}, {de: false}).exec();

		if (result.matchedCount < 1) {
			throw createError({statusCode: 404, statusMessage: 'Article Not Found'});
		}

		return apiStatus.success();
	}
	throw createError({statusCode: 400, statusMessage: 'Invalid ID'});
});