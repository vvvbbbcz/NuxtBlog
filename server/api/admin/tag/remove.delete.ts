import Tag from "~/server/utils/models/BlogData";
import apiStatus from "~/server/utils/apiStatus";

export default defineEventHandler(async (event) => {
	const id = parseInt((await readBody(event))._id);
	if (!isNaN(id) && id >= -100000 && id <= -1001) {
		const result = await Tag.deleteOne({_id: id}).exec();
		if (result.deletedCount < 1) {
			throw createError({statusCode: 404, statusMessage: 'Tag Not Found'});
		}

		return apiStatus.success();
	}
	throw createError({statusCode: 400, statusMessage: 'Invalid ID'});
});