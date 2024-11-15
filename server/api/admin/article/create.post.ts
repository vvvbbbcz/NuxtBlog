import BlogInfo from "~/server/utils/models/BlogInfo";
import Article from "~/server/utils/models/Article";
import {apiStatus} from "~/server/utils/util";
import truncate from "html-truncate";


function filter(body: any) {
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

export async function createArticle(id: number, body: any) {
	const model = new Article(body);
	model._id = id;
	// model.content = await Vditor.md2html(model.markdown, {
	// 	cdn: "/vditor"
	// });
	model.abstract = truncate(body.content, 200, {ellipsis: false});
	model.publishDate = body.date;
	model.updateDate = body.date;
	model.visible = body.visible;

	return model;
}

export default defineEventHandler(async (event) => {
	const info: any = await BlogInfo.findOne().exec().catch(error => {
		console.error(error);
	});
	if (!info) {
		setResponseStatus(event, 500);
		return apiStatus.error;
	}

	const body = filter(await readBody(event));
	const model = await createArticle(info.articleID++, body);

	const infoResult = await info.save().catch((error: any) => {
		console.error(error);
	});
	if (!infoResult) {
		setResponseStatus(event, 500);
		return apiStatus.error;
	}

	const articleResult = await model.save().catch(error => {
		console.error(error);
	});
	if (!articleResult) {
		setResponseStatus(event, 500);
		return apiStatus.error;
	}

	setResponseStatus(event, 201);
	return {
		...apiStatus.success,
		data: {id: model._id}
	};
})