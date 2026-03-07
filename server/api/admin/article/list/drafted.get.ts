import Article from "~/server/utils/models/BlogData";
import filters from "~/server/utils/filters";
import { fromDB } from "~/utils/dbTypes/article";

export default defineEventHandler(async () => {
    return (await Article.find(filters.article.drafted())
        .limit(20)
        .sort({ _id: -1 })
        .select(['ur', 'ti', 'vi'])
        .populate('au', ['co', 'ti'])
        .populate('tg', 'ti')
        .lean())
        .map(fromDB)
        .filter((i) => i !== null);
});
