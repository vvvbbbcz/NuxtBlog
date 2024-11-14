import BlogInfo from "~/server/utils/models/BlogInfo";
import Tag from "~/server/utils/models/Tag";
import {status} from "~/server/utils/util";

function filter(body: any) {
	return {
		urlName: body.urlName,
		name: body.name
	}
}

function createTag(id: number, body: any) {
	const model = new Tag(body);
	model._id = id;

	return model;
}

export default defineEventHandler(async (event) => {
	const info = await BlogInfo.findOne().exec().catch(error => {
		console.error(error);
	});
	if (!info) {
		setResponseStatus(event, 500);
		return status.error;
	}

	const body = filter(await readBody(event));
	const model = createTag(info.tagID++, body);

	const infoResult = await info.save().catch(error => {
		console.error(error);
	});
	if (!infoResult) {
		setResponseStatus(event, 500);
		return status.error;
	}

	const tagResult = await model.save().catch(error => {
		console.error(error);
	});
	if (!tagResult) {
		setResponseStatus(event, 500);
		return status.error;
	}

	return status.success; // TODO
})