import Draft from "~/server/utils/models/Draft";
import DeletedDraft from "~/server/utils/models/DeletedDraft";

export default defineEventHandler(async (event) => {
	const id = parseInt(getQuery(event).id);
	if (!isNaN(id)) {
		const model = await Draft.findByIdAndDelete(id).exec().catch(error => {
			console.error(error);
		});
		if (!model) {
			setResponseStatus(event, 404);
			return null;
		}

		const result = await DeletedDraft.create({...model._doc}).catch(async error => {
			await Draft.create({...model._doc}).catch(error => {
				console.error(error);
			});
			console.error(error);
		});
		if (!result) {
			setResponseStatus(event, 500);
			return {error: "move draft to recycle bin failed, may be database error."};
		}

		return {id: model._id}; // TODO
	}
	setResponseStatus(event, 400);
	return null;
});