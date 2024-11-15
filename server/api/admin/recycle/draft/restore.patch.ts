import DeletedDraft from "~/server/utils/models/DeletedDraft";
import Draft from "~/server/utils/models/Draft";
import {apiStatus} from "~/server/utils/util";

export default defineEventHandler(async (event) => {
	const id = parseInt((await readBody(event))._id);
	if (!isNaN(id)) {
		const model: any = await DeletedDraft.findByIdAndDelete(id).exec().catch(error => {
			console.error(error);
		});
		if (!model) {
			setResponseStatus(event, 404);
			return apiStatus.error;
		}

		const result = await Draft.create({...model._doc}).catch(async error => {
			await DeletedDraft.create({...model._doc}).catch(error => {
				console.error(error);
			});
			console.error(error);
		});
		if (!result) {
			setResponseStatus(event, 500);
			return apiStatus.error;
		}

		return apiStatus.success;
	}
	setResponseStatus(event, 400);
	return apiStatus.error;
});