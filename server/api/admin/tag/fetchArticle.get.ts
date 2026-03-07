import Article from "~/server/utils/models/BlogData";
import filters from "~/server/utils/filters";
import { fromDB } from "~/utils/dbTypes/article";

export default defineEventHandler(async (event) => {
    const query = getQuery(event).id;
    const id = parseInt(Array.isArray(query) ? query[0] : query);

    if (filters.isTag(id)) {
        return (await Article.find(filters.article.all({ tg: id }))
            .select(['ur', 'ti', 'vi'])
            .populate('au', ['co', 'ti'])
            .lean())
            .map(fromDB)
            .filter((i) => i !== null);
    }
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' });
});
