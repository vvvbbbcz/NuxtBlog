import BlogInfo from "~/server/utils/models/BlogInfo";
import Tag from "~/server/utils/models/Tag";
import {apiStatus} from "~/server/utils/util";

function filter(id: number, body: any) {
	return {
		_id: id,
		urlName: body.urlName,
		name: body.name
	}
}

export default defineEventHandler(async (event) => {
	const info: any = await BlogInfo.findOne().exec();
	if (!info) {
		return apiStatus.error(event, 500);
	}

	const id = info.tagID++;
	const body = filter(id, await readBody(event));
	await Promise.all([Tag.create(body), info.save()]);

	return apiStatus.successWith(event, 201, {id: id});
})