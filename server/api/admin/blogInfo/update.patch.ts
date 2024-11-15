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
	const model = await BlogInfo.findOneAndUpdate({}, body).exec().catch(error => {
		console.error(error);
	});
	if (!model) {
		setResponseStatus(event, 404);
		return apiStatus.error;
	} else {
		setResponseStatus(event, 200);
		return apiStatus.success;
	}
});