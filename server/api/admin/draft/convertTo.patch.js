import Article from "~/server/utils/models/Article";
import Draft from "~/server/utils/models/Draft";

function filter(body) {
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

export async function createDraft(article, body) {
	const model = new Draft({...article._doc, ...body});

	return model;
}

export default defineEventHandler(async (event) => {
	const body = filter(await readBody(event));

	const article = await Article.findByIdAndDelete(body._id).exec().catch(error => {
		console.error(error);
	});
	if (!article) {
		setResponseStatus(event, 404);
		return null;
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
		return {error: "save article failed, may be database error."};
	}

	return {id: body.id};
});