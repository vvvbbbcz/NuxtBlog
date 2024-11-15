import BlogInfo from "~/server/utils/models/BlogInfo";
import {apiStatus} from "~/server/utils/util";

function removeUnnecessary(data: any) {
	return {
		name: data.name,
		icon: data.icon,
		separator: data.separator,
		background: data.background
	};
}

export default defineEventHandler(async (event) => {
	const data = await BlogInfo.findOne().exec().catch(error => {
		console.error(error);
	});
	if (data) {
		return removeUnnecessary(data);
	} else {
		setResponseStatus(event, 404);
		return apiStatus.error;
	}
});