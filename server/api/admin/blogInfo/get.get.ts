import BlogInfo from "~/server/utils/models/BlogInfo";
import {apiStatus} from "~/server/utils/util";

export default defineEventHandler(async (event) => {
	const data = await BlogInfo.findOne()
		.select(['-_id', 'name', 'icon', 'separator', 'background'])
		.lean();
	if (data) {
		return data;
	} else {
		return apiStatus.error(event, 404);
	}
});