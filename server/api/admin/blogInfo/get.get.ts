import BlogData from "~/server/utils/models/BlogData";

export default defineEventHandler(async (event) => {
	const data = await BlogData
		.findOne({_id: 0})
		.select(['-_id', 'blogInfo'])
		.lean();
	if (data?.blogInfo) {
		return data.blogInfo;
	} else {
		throw createError({statusCode: 404, statusMessage: 'Not Found'});
	}
});