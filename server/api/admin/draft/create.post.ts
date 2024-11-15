import BlogInfo from "~/server/utils/models/BlogInfo";
import Draft from "~/server/utils/models/Draft";
import {apiStatus} from "~/server/utils/util";

function filter(body: any) {
    return {
        urlName: body.urlName,
        title: body.title,
        markdown: body.markdown,
        tagId: body.tagId,
        author: body.author._id,
        visible: body.visible,
    }
}

export async function createDraft(id: number, body: any) {
    const model = new Draft(body);
    model._id = id;

    return model;
}

export default defineEventHandler(async (event) => {
    const info: any = await BlogInfo.findOne().exec().catch(error => {
        console.error(error);
    });
    if (!info) {
        setResponseStatus(event, 500);
        return apiStatus.error;
    }

    const body = filter(await readBody(event));
    const model = await createDraft(info.articleID++, body);

    const infoResult = await info.save().catch((error: any) => {
        console.error(error);
    });
    if (!infoResult) {
        setResponseStatus(event, 500);
        return apiStatus.error;
    }

    const draftResult = await model.save().catch(error => {
        console.error(error);
    });
    if (!draftResult) {
        setResponseStatus(event, 500);
        return apiStatus.error;
    }

    setResponseStatus(event, 201);
    return {
        ...apiStatus.success,
        data: {id: model._id}
    };
})