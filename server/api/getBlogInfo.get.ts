import BlogInfo from "~/server/utils/models/BlogData";
import filters from "~/server/utils/filters";
import mongoose from "mongoose";
import { fromDB } from "~/utils/dbTypes/blogInfo";

export default defineEventHandler(async (event) => {
	if (mongoose.connection.readyState) {
		const data = await BlogInfo
			.findOne(filters.blog_info())
			.select(['-_id', 'ti', 'md', 'au'])
			.populate('co', ['-_id', 'ur'])
			.lean();

		if (data) {
			return fromDB(data);
		}
	}
	throw createError({ statusCode: 500 });
})
