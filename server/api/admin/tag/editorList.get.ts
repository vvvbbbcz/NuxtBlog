import Tag from "~/server/utils/models/Tag";

export default defineEventHandler(async (event) => {
	return Tag.find()
		.limit(20)
		.sort({_id: -1})
		.select('name')
		.lean();
});