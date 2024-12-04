import Article from "~/server/utils/models/BlogData";
import apiStatus from "~/server/utils/apiStatus";
import truncate from "html-truncate";


function filter(id: number, body: any) {
	const year = parseInt(body.date.split('-', 1)[0]);
	const data = {
		_id: id,
		ur: body.ur,
		ti: body.ti,
		md: body.md,
		ab: '',
		ht: body.ht,
		tg: body.tg,
		yr: isNaN(year) ? 0 : year,
		pu: body.date,
		up: body.date,
		au: body.au,
		pw: body.pw,
		iv: body.iv,
		vi: body.vi,
		dr: body.dr,
		de: false,
	}

	if (!body.dr && body.vi === 0) {
		data.ab = truncate(body.ht, 200, {ellipsis: false});
		// model.content = await Vditor.md2html(model.markdown, {
		// 	cdn: "/vditor"
		// });
	}

	return data;
}

export default defineEventHandler(async (event) => {
	const data = await Article
		.findOne({_id: {$gt: 0}})
		.sort({_id: -1})
		.select('_id')
		.lean();

	const id = data?._id ? (data._id + 1) : 1;
	const body = filter(id, await readBody(event))

	try {
		await Article.create(body);
	} catch (error: any) {
		throw createError({statusCode: 500, statusMessage: error});
	}

	return apiStatus.success(event, {code: 201, data: {_id: id}});
})