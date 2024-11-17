import Tag from "~/server/utils/models/Tag";

function removeUnnecessary(data: any[]) {
	for (const tag of data) {
		tag.__v = undefined;
	}

	return data;
}

export default defineEventHandler(async (event) => {
	return Tag.find()
		.limit(20)
		.sort({_id: -1})
		.select(['urlName', 'name'])
		.lean();
});