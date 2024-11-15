import Tag from "~/server/utils/models/Tag";

function filter(body: any) {
	return {
		_id: body._id,
		urlName: body.urlName,
		name: body.name
	}
}

export default defineEventHandler(async (event) => {
	const body = filter(await readBody(event));
	const model = await Tag.findByIdAndUpdate(body._id, body).exec().catch(error => {
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