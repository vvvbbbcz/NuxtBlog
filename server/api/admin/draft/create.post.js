import BlogInfo from "~/server/utils/models/BlogInfo";
import Draft from "~/server/utils/models/Draft";

function filter(body) {
    return {
        urlName: body.urlName,
        title: body.title,
        markdown: body.markdown,
        tagId: body.tagId,
        author: body.author,
        visible: body.visible,
    }
}

export async function createArticle(id, requestBody) {
    const model = new Draft(requestBody);
    model._id = id;

    return model;
}

export default defineEventHandler(async (event) => {
    const info = await BlogInfo.findOne().exec().catch(error => {
        console.error(error);
    });
    if (!info) {
        setResponseStatus(event, 500);
        return {error: "can't get blog info, may be database error."};
    }

    const body = filter(await readBody(event));
    const model = await createArticle(info.articleID++, body);

    const infoResult = await info.save().catch(error => {
        console.error(error);
    });
    if (!infoResult) {
        setResponseStatus(event, 500);
        return {error: "save article id failed, may be database error."};
    }

    const articleResult = await model.save().catch(error => {
        console.error(error);
    });
    if (!articleResult) {
        setResponseStatus(event, 500);
        return {error: "save article failed, may be database error."};
    }

    setResponseStatus(event, 201);
    return {id: model._id}; // TODO
})