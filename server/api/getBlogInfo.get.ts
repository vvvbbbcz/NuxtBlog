import BlogInfo from '~/server/utils/models/BlogInfo';
import mongoose from "mongoose";

export default defineEventHandler(async (event) => {
	if (mongoose.connection.readyState) {
		const data = await BlogInfo.findOne()
			.select(['-_id', 'name', 'icon', 'separator', 'background'])
			.lean();
		if (data) {
			return data;
		}
	}
	return apiStatus.error(event, 500);
})
