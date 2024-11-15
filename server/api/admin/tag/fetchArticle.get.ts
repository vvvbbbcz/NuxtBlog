import Tag from "~/server/utils/models/Tag";

function removeUnnecessary(articles: any[]) {
	const result: object[] = [];

	for (const article of articles) {
		result.push({
			_id: article._id,
			title: article.title
		});
	}

	return result;
}

export default defineEventHandler(async (event) => {
	const query = getQuery(event).id;
	const id = parseInt(Array.isArray(query) ? query[0] : query);
	const data = await Tag.findById(id).populate('articles')
		.exec().catch(error => {
			console.error(error);
		});
	if (data) {
		return removeUnnecessary(data.articles);
	} else {
		return [];
	}
});