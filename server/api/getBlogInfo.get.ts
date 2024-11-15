import BlogInfo from '~/server/utils/models/BlogInfo';

export default defineEventHandler(async (event) => {
	const data = await BlogInfo.findOne().exec().catch(error => {
		console.error(error);
	});
	if (data) {
		return {
			name: data.name,
			icon: data.icon,
			separator: data.separator,
			background: data.background
		};
	} else {
		setResponseStatus(event, 500);
		return null;
	}
})
