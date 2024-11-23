import Article from "~/server/utils/models/Article";

export default defineEventHandler(async (event) => {
	return Article.find({draft: false, deleted: false})
		.limit(20)
		.sort({_id: -1})
		.select(['urlName', 'title', 'publishDate', 'updateDate', 'visible'])
		.populate('author', ['_id', 'avatar', 'nickname'])
		.populate('tagId', ['_id', 'name'])
		.lean();
});