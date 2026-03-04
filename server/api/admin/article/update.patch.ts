import DB from "~/server/utils/models/BlogData";
import truncate from "html-truncate";
import apiStatus from "~/server/utils/apiStatus";
import { Article, toDB } from "~/utils/dbTypes/article";

function filter(body: Article) {
	if (!body.drafted && body.visible === 0) body.abstract = truncate(body.html || "", 200);

	const data = {
		id: body.id === undefined ? NaN : Number(body.id),
		article: toDB(body)
	}

	return data;
}

export default defineEventHandler(async (event) => {
	const body = filter(await readBody(event));
	const id = body.id;

	if (!isNaN(id) && id > 0) {
		const result = await DB.updateOne({ _id: id }, body.article).exec();
		if (result.matchedCount < 1) {
			throw createError({ statusCode: 404, statusMessage: 'Article Not Found' });
		}
		return apiStatus.success();
	}
	throw createError({ statusCode: 400, statusMessage: 'Invalid ID' });
});