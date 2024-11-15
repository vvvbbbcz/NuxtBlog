import Article from "~/server/utils/models/Article";
import Draft from "~/server/utils/models/Draft";
import {apiStatus} from "~/server/utils/util";
import trimHtml from "trim-html";

function filter(body: any) {
	return {
		_id: body._id,
		urlName: body.urlName,
		title: body.title,
		markdown: body.markdown,
		content: body.content,
		date: body.date,
		tagId: body.tagId,
		author: body.author._id,
		visible: body.visible,
	}
}

export async function createArticle(draft: any, body: any) {
	const model = new Article({...draft._doc, ...body});
	model.abstract = trimHtml(model.content, {limit: 200}).html;
	model.publishDate = body.date;
	model.updateDate = body.date;

	return model;
}

export default defineEventHandler(async (event) => {
	const body = filter(await readBody(event));

	const draft: any = await Draft.findByIdAndDelete(body._id).exec().catch(error => {
		console.error(error);
	});
	if (!draft) {
		setResponseStatus(event, 404);
		return apiStatus.error;
	}

	const article = await createArticle(draft, body);
	const result = await article.save().catch(async error => {
		await Draft.create({...draft._doc}).catch(error => {
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