import Article from "~/server/utils/models/BlogData";
import filters from "~/server/utils/filters";
import { fromDB } from "~/utils/dbTypes/article";

export default defineEventHandler(async () => {
    return await Article
        .find(filters.article.published())
        .limit(20)
        .sort({ _id: -1 })
        .select(['ur', 'ti', 'da', 'vi'])
        .populate('au', ['co', 'ti'])
        .populate('tg', 'ti')
        .lean()
        .then((res) => res.map(fromDB).filter((i) => i !== null))
        .catch((err) => {
            throw createError({ statusCode: 500, statusMessage: String(err) });
        });
});
