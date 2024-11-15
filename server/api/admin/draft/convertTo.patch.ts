import Article from "~/server/utils/models/Article";
import Draft from "~/server/utils/models/Draft";
import {apiStatus} from "~/server/utils/util";

function filter(body: any) {
	return {
		_id: body._id,
		urlName: body.urlName,
		title: body.title,
		markdown: body.markdown,
		tagId: body.tagId,
		author: body.author._id,
		visible: body.visible,
	}
}

export async function createDraft(article: any, body: any) {
	return new Draft({...article._doc, ...body});
}

export default defineEventHandler(async (event) => {
	const body = filter(await readBody(event));

	const article: any = await Article.findByIdAndDelete(body._id).exec().catch(error => {
		console.error(error);
	});
	if (!article) {
		setResponseStatus(event, 404);
		return apiStatus.error;
	}
	
	const draft = await createDraft(article, body);
	const result = await draft.save().catch(async error => {
		await Article.create({...article._doc}).catch(error => {
			console.error(error);
		});
		console.error(error);
	});
	if (!result) {
		setResponseStatus(event, 500);
		return apiStatus.error;
	}

	return {
		...apiStatus.success,
		data: {id: body._id}
	};
});