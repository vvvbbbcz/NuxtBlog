import User from "~/server/utils/models/BlogData";
import {getUserSession} from "#imports";

export default defineEventHandler(async (event) => {
	const query = getQuery(event).id;
	const id = parseInt(Array.isArray(query) ? query[0] : query);
	if (!isNaN(id) && id >= -1000 && id <= -1) {
		const {user}: any = await getUserSession(event);
		if (user._id !== id) {
			throw createError({statusCode: 404, statusMessage: 'User Not Found'});
		}

		const data = await User
			.findById(id)
			.select(['-_id', 'ur', 'ti', 'md', 'co'])
			.lean();
		if (data) {
			return data;
		} else {
			throw createError({statusCode: 404, statusMessage: 'User Not Found'});
		}
	}
	throw createError({statusCode: 400, statusMessage: 'Invalid ID'});
});