import Tag from "~/server/utils/models/BlogData";
import apiStatus from "~/server/utils/apiStatus";
import filters from "~/server/utils/filters";

function filter(id: number, body: any) {
	return {
		_id: id,
		ur: body.ur,
		ti: body.ti,
		yr: 1,
	}
}

export default defineEventHandler(async (event) => {
	const data = await Tag
		.findOne(filters.tag)
		.sort({_id: 1})
		.select('_id')
		.lean();

	if (data?._id && (data._id <= -100000)) {
		throw createError({statusCode: 405, statusMessage: 'Tags are full'});
	}

	const id = data?._id ? (data._id - 1) : -1001;
	const body = filter(id, await readBody(event));

	try {
		await Tag.create(body);
	} catch (error: any) {
		throw createError({statusCode: 500, statusMessage: error});
	}

	return apiStatus.success(event, {code: 201, data: {id: id}});
})