import Article from "~/server/utils/models/BlogData";
import apiStatus from "~/server/utils/apiStatus";
import filters from "~/server/utils/filters";

export default defineEventHandler(async (event) => {
    const id = parseInt((await readBody(event)).id);
    if (filters.isArticle(id)) {
        const result = await Article.deleteOne({ _id: id, de: true }).exec();

        if (result.deletedCount < 1) {
            throw createError({ statusCode: 404, statusMessage: 'Article Not Found' });
        }

        return apiStatus.success();
    }
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' });
});
