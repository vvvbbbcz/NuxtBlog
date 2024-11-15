import Draft from "~/server/utils/models/Draft";
import {adminFlush, apiStatus} from "~/server/utils/util";

function removeUnnecessary(data: any) {
	adminFlush(data);

	return data;
}

export default defineEventHandler(async (event) => {
	const query = getQuery(event).id;
	const id = parseInt(Array.isArray(query) ? query[0] : query);
	if (!isNaN(id)) {
		const data = await Draft.findById(id).populate('author').exec().catch(error => {
			console.error(error);
		});
		if (data) {
			return removeUnnecessary(data);
		} else {
			setResponseStatus(event, 404);
			return apiStatus.error;
		}
	}
	setResponseStatus(event, 400);
	return apiStatus.error;
});