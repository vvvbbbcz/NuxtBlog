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
	const id = parseInt(body._id);
	if (!isNaN(id)) {
		const tag = await Tag.updateOne({_id: id}, body).exec();
		if (tag.matchedCount < 1) {
			return apiStatus.error(event, 404);
		} else {
			return apiStatus.success;
		}
	}
	return apiStatus.error(event, 400);
});