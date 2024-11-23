import Article from "~/server/utils/models/Article";

export default defineEventHandler(async (event) => {
	return Article.find({visible: true, draft: false, deleted: false})
		.limit(10)
		.sort({_id: -1})
		.select(['-_id', 'urlName', 'title', 'abstract', 'cover', 'publishDate', 'updateDate'])
		.populate('tagId', ['-_id', 'urlName', 'name'])
		.populate('author', ['-_id', 'username', 'nickname', 'avatar'])
		.lean();
});
