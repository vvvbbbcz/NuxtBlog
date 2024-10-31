import Article from '~/server/utils/models/Article';
import {flush} from "~/server/utils/util";

function removeUnnecessary(data) {
	flush(data);
	data.abstract = undefined;

	return data;
}

export default defineEventHandler(async (event) => {
	const query = getQuery(event);

	const name = query.name;
	if (name) {
		const data = await Article.findOne({urlName: name, visible: true}).populate(['tagId', 'author']).exec().catch(error => {
			console.error(error);
		});
		if (data) {
			return removeUnnecessary(data);
		} else {
			setResponseStatus(event, 404);
			return null;
		}
	}

	setResponseStatus(event, 400);
	return null;
})
