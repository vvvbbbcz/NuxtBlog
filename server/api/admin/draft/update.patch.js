import Draft from "~/server/utils/models/Draft";

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const diff = {
		urlName: body.urlName,
		title: body.title,
		markdown: body.markdown,
		tagId: body.tagId,
		visible: body.visible
	};
	const model = await Draft.findByIdAndUpdate(body._id, diff).exec().catch(error => {
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