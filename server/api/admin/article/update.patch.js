import Article from "~/server/utils/models/Article";
import trimHtml from "trim-html";

function filter(body) {
	return  {
		_id: body._id,
		urlName: body.urlName,
		title: body.title,
		markdown: body.markdown,
		abstract: trimHtml(body.content, {limit: 200}).html,
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
		return {
			status: "fail"
		};
	} else {
		setResponseStatus(event, 200);
		return {
			status: "success"
		}; // TODO
	}
});