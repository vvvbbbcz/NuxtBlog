import Article from "~/server/utils/models/BlogData";
import truncate from "html-truncate";
import apiStatus from "~/server/utils/apiStatus";

function filter(body: any) {
	const data = {
		_id: body._id,
		article: {
			ur: body.ur,
			ti: body.ti,
			md: body.md,
			tg: body.tg,
			up: body.date,
			au: body.au,
			pw: body.pw,
			vi: body.vi,
			dr: body.dr,
		}
	}

	if (!body.dr) {
		if (body.vi === 0) {
			Object.defineProperty(data.article, 'ab', {
				value: truncate(body.ht, 200, {ellipsis: false}),
				enumerable: true
			});
		}
		Object.defineProperty(data.article, 'ht', {value: body.ht, enumerable: true});
		Object.defineProperty(data.article, 'iv', {value: body.iv, enumerable: true});
	}

	if (body.publish) { // publish from draft
		Object.defineProperty(data.article, 'yr', {value: body.date.split('-', 1)[0], enumerable: true});
		Object.defineProperty(data.article, 'pu', {value: body.date, enumerable: true});
	}

	return data;
}

export default defineEventHandler(async (event) => {
	const body = filter(await readBody(event));
	const id = parseInt(body._id);

	if (!isNaN(id) && id > 0) {
		const result = await Article.updateOne({_id: id}, body.article).exec();
		if (result.matchedCount < 1) {
			throw createError({statusCode: 404, statusMessage: 'Article Not Found'});
		}
		return apiStatus.success();
	}
	throw createError({statusCode: 400, statusMessage: 'Invalid ID'});
});