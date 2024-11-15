import Article from "~/server/utils/models/Article";
import DeletedArticle from "~/server/utils/models/DeletedArticle";
import {apiStatus} from "~/server/utils/util";

export default defineEventHandler(async (event) => {
	const id = parseInt((await readBody(event))._id);
	if (!isNaN(id)) {
		const model: any = await Article.findByIdAndDelete(id).exec().catch(error => {
			console.error(error);
		});
		if (!model) {
			setResponseStatus(event, 404);
			return apiStatus.error;
		}

		const result = await DeletedArticle.create({...model._doc}).catch(async error => {
			await Article.create({...model._doc}).catch(error => {
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