import User from "~/server/utils/models/BlogData";
import apiStatus from "~/server/utils/apiStatus";
import {getUserSession} from "#imports";

export default defineEventHandler(async (event) => {
	const query = getQuery(event).id;
	const id = parseInt(Array.isArray(query) ? query[0] : query);
	if (!isNaN(id) && id >= -1000 && id <= -1) {
		const {user}: any = await getUserSession(event);
		if (user._id !== id) {
			return apiStatus.error(event, {code: 404});
		}

		const data = await User
			.findById(id)
			.select(['-_id', 'ur', 'ti', 'md', 'co'])
			.lean();
		if (data) {
			return data;
		} else {
			return apiStatus.error(event, {code: 404});
		}
	}
	return apiStatus.error(event, {code: 400});
});