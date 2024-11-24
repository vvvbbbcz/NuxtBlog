import Picture from "~/server/utils/models/Picture";
import {apiStatus} from "~/server/utils/util";

export default defineEventHandler(async (event) => {
	const query = getQuery(event).id;
	const id = Array.isArray(query) ? query[0] : query;
	if (isNaN(id)) {
		const data = await Picture.findOne({_id: id, visible: true})
			.select('url')
			.lean();
		if (data) {
			return data.url;
		} else {
			return apiStatus.error(event, 404);
		}
	}

	return apiStatus.error(event, 400);
});