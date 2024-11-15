import DeletedArticle from "~/server/utils/models/DeletedArticle";
import {status} from "~/server/utils/util";

export default defineEventHandler(async (event) => {
	const id = parseInt((await readBody(event))._id);
	if (!isNaN(id)) {
		const model = await DeletedArticle.findByIdAndDelete(id).exec().catch(error => {
			console.error(error);
		});
		if (!model) {
			setResponseStatus(event, 404);
			return status.error;
		}

		return status.success;
	}
	setResponseStatus(event, 400);
	return status.error;
});