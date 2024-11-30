import BlogInfo from "~/server/utils/models/BlogData";
import apiStatus from "~/server/utils/apiStatus";
import mongoose from "mongoose";

export default defineEventHandler(async (event) => {
	if (mongoose.connection.readyState) {
		const data = await BlogInfo
			.findOne({_id: 0})
			.select(['-_id', 'blogInfo'])
			.lean();
		if (data?.blogInfo) {
			return data.blogInfo;
		}
	}
	return apiStatus.error(event);
})
