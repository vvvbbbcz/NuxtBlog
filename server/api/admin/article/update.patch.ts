import Article from "~/server/utils/models/Article";
import truncate from "html-truncate";
import {apiStatus} from "~/server/utils/util";

function filter(body: any) {
	return  {
		_id: body._id,
		urlName: body.urlName,
		title: body.title,
		markdown: body.markdown,
		abstract: truncate(body.content, 200, {ellipsis: false}),
		content: body.content,
		updateDate: body.date,
		tagId: body.tagId,
		visible: body.visible
	}
}

export default defineEventHandler(async (event) => {
	const body = filter(await readBody(event));
	const model = await Article.findByIdAndUpdate(body._id, body).exec().catch(error => {
		console.error(error);
	});
	if (!model) {
		setResponseStatus(event, 404);
		return apiStatus.error;
	} else {
		setResponseStatus(event, 200);
		return apiStatus.success;
	}
});