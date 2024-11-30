import Article from "~/server/utils/models/BlogData";
import apiStatus from "~/server/utils/apiStatus";

export default defineEventHandler(async (event) => {
	const id = parseInt((await readBody(event))._id);
	if (!isNaN(id) && id > 0) {
		const result = await Article.deleteOne({_id: id, de: true}).exec();

		if (result.deletedCount < 1) {
			return apiStatus.error(event, {code: 404});
		}

		return apiStatus.success();
	}
	return apiStatus.error(event, {code: 400});
});