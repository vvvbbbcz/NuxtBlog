import DB from "~/server/utils/models/BlogData";
import truncate from "html-truncate";
import apiStatus from "~/server/utils/apiStatus";
import { Article, toDB } from "~/utils/dbTypes/article";
import filters from "~/server/utils/filters";

function filter(body: Article) {
    if (!body.drafted && body.visible === 0) body.abstract = truncate(body.html || "", 200);

    const data = {
        id: body.id === undefined ? NaN : Number(body.id),
        article: { ...toDB(body), _id: undefined, yr: undefined }
    }

    return data;
}

export default defineEventHandler(async (event) => {
    const body = filter(await readBody(event));
    const id = body.id;

    if (filters.isArticle(id)) {
        const result = await DB.updateOne({ _id: id }, body.article).exec();
        if (result.matchedCount < 1) {
            throw createError({ statusCode: 404, statusMessage: 'Article Not Found' });
        }
        return apiStatus.success();
    }
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' });
});
