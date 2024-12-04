import BlogInfo from "~/server/utils/models/BlogData";
import mongoose from "mongoose";

export default defineEventHandler(async (event) => {
	if (mongoose.connection.readyState) {
		const data = await BlogInfo
			.findOne({_id: 0})
			.select(['-_id', 'blogInfo'])
			.populate('blogInfo.background', ['-_id', 'ur'])
			.lean();
		if (data?.blogInfo) {
			return data.blogInfo;
		}
	}
	throw createError({statusCode: 500});
})
