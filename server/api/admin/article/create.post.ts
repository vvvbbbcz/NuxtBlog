import DB from "~/server/utils/models/BlogData";
import apiStatus from "~/server/utils/apiStatus";
import truncate from "html-truncate";
import { Article, toDB } from "~/utils/dbTypes/article";


function filter(id: number, body: Article) {
    if (!body.drafted && body.visible === 0) body.abstract = truncate(body.html || "", 200);

    return toDB({ ...body, id: id });
}

export default defineEventHandler(async (event) => {
    const data = await DB
        .findOne({ _id: { $gt: 0 } })
        .sort({ _id: -1 })
        .select('_id')
        .lean();

    const id = data?._id ? (data._id + 1) : 1;
    const body = filter(id, await readBody(event))

    try {
        await DB.create(body);
    } catch (error) {
        throw createError({ statusCode: 500, statusMessage: String(error) });
    }

    return apiStatus.success(event, { code: 201, data: { id: id } });
})
