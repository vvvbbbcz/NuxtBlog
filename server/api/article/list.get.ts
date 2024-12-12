import Article from "~/server/utils/models/BlogData";

export default defineEventHandler(async () => {
	return Article.find({_id: {$gt: 0}, vi: 0, dr: false, de: false})
		.limit(10)
		.sort({_id: -1})
		.select(['-_id', 'ur', 'ti', 'ab', 'co', 'yr', 'da'])
		.populate('tg', ['-_id', 'ur', 'ti'])
		.populate('au', ['-_id', 'ur', 'ti', 'co'])
		.lean();
});
