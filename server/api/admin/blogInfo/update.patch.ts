import BlogInfo from "~/server/utils/models/BlogData";
import apiStatus from "~/server/utils/apiStatus";
import { toDB } from "~/utils/dbTypes/blogInfo";

export default defineEventHandler(async (event) => {
    const data = toDB(await readBody(event));

    const result = await BlogInfo.updateOne({ _id: 0 }, data).exec().catch((err) => {
        throw createError({ statusCode: 500, statusMessage: String(err) });
    });

    if (result.matchedCount < 1) {
        throw createError({ statusCode: 404, statusMessage: 'Not Found' });
    } else {
        return apiStatus.success();
    }
});
