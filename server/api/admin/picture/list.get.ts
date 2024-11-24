import Picture from "~/server/utils/models/Picture";

export default defineEventHandler(async (event) => {
	return Picture.find()
		.limit(20)
		.sort({_id: -1})
		.populate('author', ['_id', 'avatar', 'nickname'])
		.lean();
});