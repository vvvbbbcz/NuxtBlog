import Article from "~/server/utils/models/Article";
import DeletedArticle from "~/server/utils/models/DeletedArticle";

export default defineEventHandler(async (event) => {
	const id = parseInt(getQuery(event).id);
	if (!isNaN(id)) {
		const model = await Article.findByIdAndDelete(id).exec().catch(error => {
			console.error(error);
		});
		if (!model) {
			setResponseStatus(event, 404);
			return null;
		}

		const result = await DeletedArticle.create({...model._doc}).catch(async error => {
			await Article.create({...model._doc}).catch(error => {
				console.error(error);
			});
			console.error(error);
		});
		if (!result) {
			setResponseStatus(event, 500);
			return {error: "move article to recycle bin failed, may be database error."};
		}

		return {id: model._id}; // TODO
	}
	setResponseStatus(event, 400);
	return null;
});