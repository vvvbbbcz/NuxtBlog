import Article from "~/server/utils/models/Article";
import {apiStatus} from "~/server/utils/util";

export default defineEventHandler(async (event) => {
	const id = parseInt((await readBody(event))._id);
	if (!isNaN(id)) {
		const result = await Article.deleteOne({_id: id, deleted: true}).exec();
		if (result.deletedCount < 1) {
			return apiStatus.error(event, 404);
		}

		return apiStatus.success;
	}
	return apiStatus.error(event, 400);
});