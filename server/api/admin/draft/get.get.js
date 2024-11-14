import Draft from "~/server/utils/models/Draft";
import {adminFlush} from "~/server/utils/util";

function removeUnnecessary(data) {
	adminFlush(data);

	return data;
}

export default defineEventHandler(async (event) => {
	const id = parseInt(getQuery(event).id);
	if (!isNaN(id)) {
		const data = await Draft.findById(id).populate('author').exec().catch(err => {
			console.error(err);
		});
		if (data) {
			return removeUnnecessary(data);
		} else {
			setResponseStatus(event, 404);
			return null;
		}
	}
	setResponseStatus(event, 400);
	return null;
});