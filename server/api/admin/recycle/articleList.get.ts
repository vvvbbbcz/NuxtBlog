import Article from "~/server/utils/models/Article";

export default defineEventHandler(async (event) => {
	return Article.find({draft: false, deleted: true})
		.limit(20)
		.sort({_id: -1})
		.select(['title', 'author', 'visible'])
		.populate('author', ['_id', 'avatar', 'nickname'])
		.lean();
});
