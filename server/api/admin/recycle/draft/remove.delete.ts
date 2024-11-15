import DeletedDraft from "~/server/utils/models/DeletedDraft";
import {apiStatus} from "~/server/utils/util";

export default defineEventHandler(async (event) => {
	const id = parseInt((await readBody(event))._id);
	if (!isNaN(id)) {
		const model = await DeletedDraft.findByIdAndDelete(id).exec().catch(error => {
			console.error(error);
		});
		if (!model) {
			setResponseStatus(event, 404);
			return apiStatus.error;
		}

		return apiStatus.success;
	}
	setResponseStatus(event, 400);
	return apiStatus.error;
});