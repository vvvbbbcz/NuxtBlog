import DB from "~/server/utils/models/BlogData";
import { Tag, toDB } from "~/utils/dbTypes/tag";
import filters from "~/server/utils/filters";
import apiStatus from "~/server/utils/apiStatus";

function filter(body: Tag) {
    return {
        id: body.id === undefined ? NaN : Number(body.id),
        tag: { ...toDB(body), _id: undefined }
    }
}

export default defineEventHandler(async (event) => {
    const body = filter(await readBody(event));
    const id = body.id;

    if (filters.isTag(id)) {
        const tag = await DB.updateOne({ _id: id }, body.tag).exec();
        if (tag.matchedCount < 1) {
            throw createError({ statusCode: 404, statusMessage: 'Tag Not Found' });
        } else {
            return apiStatus.success();
        }
    }
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' });
});
