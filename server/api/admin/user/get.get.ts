import User from "~/server/utils/models/User";
import {apiStatus} from "~/server/utils/util";
import {getUserSession} from "#imports";

function removeUnnecessary(data: any) {
	data._id = undefined;
	data.admin = undefined;

	return data;
}

export default defineEventHandler(async (event) => {
	const query = getQuery(event).id;
	const id = parseInt(Array.isArray(query) ? query[0] : query);
	if (!isNaN(id)) {
		const {user}: any = await getUserSession(event);
		if (user.id !== id) {
			setResponseStatus(event, 404);
			return apiStatus.error;
		}

		const data = await User.findById(id).exec().catch(error => {
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