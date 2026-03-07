import BlogInfo from "~/server/utils/models/BlogData";
import filters from "~/server/utils/filters";
import { fromDB } from "~/utils/dbTypes/blogInfo";

export default defineEventHandler(async (event) => {
    const data = fromDB(await BlogInfo
        .findOne(filters.blog_info())
        .select(['-_id', 'ti', 'md', 'au', 'co'])
        .lean());

    if (data) {
        return data;
    } else {
        throw createError({ statusCode: 404, statusMessage: 'Not Found' });
    }
});
