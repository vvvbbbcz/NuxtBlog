import BlogData from "~/server/utils/models/BlogData";
import apiStatus from "~/server/utils/apiStatus";

export default defineEventHandler(async (event) => {
	const data = await BlogData
		.findOne({_id: 0})
		.select(['-_id', 'blogInfo'])
		.lean();
	if (data?.blogInfo) {
		return data.blogInfo;
	} else {
		return apiStatus.error(event, {code: 404});
	}
});