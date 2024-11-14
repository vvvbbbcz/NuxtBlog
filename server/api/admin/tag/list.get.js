import Tag from "~/server/utils/models/Tag";

function removeUnnecessary(data) {
	for (const tag of data) {
		tag.__v = undefined;
	}

	return data;
}

export default defineEventHandler(async (event) => {
	const data = await Tag.find()
		.limit(20)
		.sort({_id: -1})
		.exec().catch(err => {
			console.error(err);
		});
	if (data) {
		return removeUnnecessary(data);
	} else {
		return [];
	}
});