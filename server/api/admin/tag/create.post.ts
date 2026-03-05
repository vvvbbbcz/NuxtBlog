import DB from "~/server/utils/models/BlogData";
import apiStatus from "~/server/utils/apiStatus";
import filters from "~/server/utils/filters";
import { type Tag, toDB } from "~/utils/dbTypes/tag";

function filter(id: number, body: Tag) {
    return { ...toDB({ ...body, id: id }), yr: 2 };
}

export default defineEventHandler(async (event) => {
    const data = await DB
        .findOne(filters.tag())
        .sort({ _id: 1 })
        .select('_id')
        .lean();

    if (data?._id && (data._id <= -8192)) {
        throw createError({ statusCode: 405, statusMessage: 'Tags are full' });
    }

    const id = data?._id ? (data._id - 1) : -256 - 1;
    const body = filter(id, await readBody(event));

    try {
        await DB.create(body);
    } catch (error) {
        throw createError({ statusCode: 500, statusMessage: String(error) });
    }

    return apiStatus.success(event, { code: 201, data: { id: id } });
})
