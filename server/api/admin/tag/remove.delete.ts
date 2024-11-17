import Tag from "~/server/utils/models/Tag";
import {apiStatus} from "~/server/utils/util";

export default defineEventHandler(async (event) => {
	const id = parseInt((await readBody(event))._id);
	if (!isNaN(id)) {
		const result = await Tag.deleteOne({_id: id}).exec();
		if (result.deletedCount < 1) {
			return apiStatus.error(event, 404);
		}

		return apiStatus.success;
	}
	return apiStatus.error(event, 400);
});