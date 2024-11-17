import Article from '~/server/utils/models/Article';
import {apiStatus} from '~/server/utils/util';

export default defineEventHandler(async (event) => {
	const query = getQuery(event).name;
	const name = Array.isArray(query) ? query[0] : query;
	if (name) {
		const data = await Article.findOne({urlName: name, visible: true})
			.select(['-_id', 'title', 'cover', 'publishDate', 'updateDate'])
			.populate('tagId', ['-_id', 'urlName', 'name'])
			.populate('author', ['-_id', 'username', 'nickname', 'avatar'])
			.populate('content', ['-_id', 'content'])
			.lean();
		if (data) {
			return data;
		} else {
			return apiStatus.error(event, 404);
		}
	}

	return apiStatus.error(event, 400);
})
