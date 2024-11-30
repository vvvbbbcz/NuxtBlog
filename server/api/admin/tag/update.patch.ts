import Tag from "~/server/utils/models/BlogData";

function filter(body: any) {
	return {
		_id: body._id,
		tag: {
			ur: body.ur,
			ti: body.ti
		}
	}
}

export default defineEventHandler(async (event) => {
	const body = filter(await readBody(event));
	const id = parseInt(body._id);
	if (!isNaN(id)) {
		const tag = await Tag.updateOne({_id: id}, body.tag).exec();
		if (tag.matchedCount < 1) {
			return apiStatus.error(event, 404);
		} else {
			return apiStatus.success();
		}
	}
	return apiStatus.error(event, 400);
});