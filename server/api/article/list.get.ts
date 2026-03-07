import Article from "~/server/utils/models/BlogData";
import { fromDB } from "~/utils/dbTypes/article";

export default defineEventHandler(async () => {
    return (await Article
        .find(filters.article.published({ vi: 0 }))
        .limit(10)
        .sort({ _id: -1 })
        .select(['-_id', 'ur', 'ti', 'ab', 'co', 'yr', 'da'])
        .populate('tg', ['-_id', 'ur', 'ti'])
        .populate('au', ['-_id', 'ur', 'ti', 'co'])
        .lean())
        .map(fromDB)
        .filter((i) => i !== null);
});
