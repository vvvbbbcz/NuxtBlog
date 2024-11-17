import User from "~/server/utils/models/User";
import {apiStatus} from "~/server/utils/util";
import {getUserSession} from "#imports";

export default defineEventHandler(async (event) => {
	const query = getQuery(event).id;
	const id = parseInt(Array.isArray(query) ? query[0] : query);
	if (!isNaN(id)) {
		const {user}: any = await getUserSession(event);
		if (user.id !== id) {
			return apiStatus.error(event, 404);
		}

		const data = await User.findById(id)
			.select(['-_id', 'username', 'nickname', 'email', 'avatar'])
			.lean();
		if (data) {
			return data;
		} else {
			return apiStatus.error(event, 404);
		}
	}
	return apiStatus.error(event, 400);
});