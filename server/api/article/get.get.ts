import Article from '~/server/utils/models/BlogData';
import apiStatus from '~/server/utils/apiStatus';

export default defineEventHandler(async (event) => {
	const query = getQuery(event);
	const year = parseInt(Array.isArray(query.year) ? query.year[0] : query.year);
	const name = Array.isArray(query.name) ? query.name[0] : query.name;

	if (!isNaN(year) && name) {
		const data = await Article
			.findOne({_id: {$gt: 0}, ur: name, yr: year, vi: {$in: [0, 2]}, dr: false, de: false})
			.select(['-_id', 'ti', 'ht', 'co', 'pu', 'up', 'iv', 'vi'])
			.populate('tg', ['-_id', 'ur', 'ti'])
			.populate('au', ['-_id', 'ur', 'ti', 'co'])
			.lean();
		if (data) {
			return data;
		} else {
			return apiStatus.error(event, {code: 404});
		}
	}

	return apiStatus.error(event, {code: 400});
})
