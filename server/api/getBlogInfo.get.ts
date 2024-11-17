import BlogInfo from '~/server/utils/models/BlogInfo';

export default defineEventHandler(async (event) => {
	const data = await BlogInfo.findOne()
		.select(['-_id', 'name', 'icon', 'separator', 'background'])
		.lean();
	if (data) {
		return data;
	} else {
		return apiStatus.error(event, 500);
	}
})
