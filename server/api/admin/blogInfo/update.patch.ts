import BlogInfo from "~/server/utils/models/BlogInfo";
import {apiStatus} from "~/server/utils/util";

function filter(body: any) {
	return  {
		name: body.name,
		// icon: body.icon,
		separator: body.separator,
		// background: body.background,
	}
}

export default defineEventHandler(async (event) => {
	const body = filter(await readBody(event));
	const result = await BlogInfo.updateOne({}, body).exec();
	if (result.matchedCount < 1) {
		setResponseStatus(event, 404);
		return apiStatus.error(event, 404);
	} else {
		return apiStatus.success;
	}
});