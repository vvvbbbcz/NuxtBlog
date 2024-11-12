import BlogInfo from "~/server/utils/models/BlogInfo";
import Article from "~/server/utils/models/Article";
import trimHtml from "trim-html";

function filter(body) {
	return {
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

export async function createArticle(id, requestBody) {
	const model = new Article(requestBody);
	model._id = id;
	// model.content = await Vditor.md2html(model.markdown, {
	// 	cdn: "/vditor"
	// });
	model.abstract = trimHtml(model.content, {limit: 200}).html;
	model.publishDate = requestBody.date;
	model.updateDate = requestBody.date;
	model.visible = requestBody.visible;

	return model;
}

export default defineEventHandler(async (event) => {
	const info = await BlogInfo.findOne().exec().catch(error => {
		console.error(error);
	});
	if (!info) {
		setResponseStatus(event, 500);
		return {error: "can't get blog info, may be database error."};
	}

	const body = filter(await readBody(event));
	const model = await createArticle(info.articleID++, body);

	const infoResult = await info.save().catch(error => {
		console.error(error);
	});
	if (!infoResult) {
		setResponseStatus(event, 500);
		return {error: "save article id failed, may be database error."};
	}

	const articleResult = await model.save().catch(error => {
		console.error(error);
	});
	if (!articleResult) {
		setResponseStatus(event, 500);
		return {error: "save article failed, may be database error."};
	}

	return sendRedirect(event, `/admin/article/edit/${model._id}`, 201); // TODO
})