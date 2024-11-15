import Tag from "~/server/utils/models/Tag";

function removeUnnecessary(data: any[]) {
	for (const tag of data) {
		tag.urlName = undefined;
		tag.articleID = undefined;
		tag.__v = undefined;
	}

	return data;
}

export default defineEventHandler(async (event) => {
	const data = await Tag.find()
		.limit(20)
		.sort({_id: -1})
		.exec().catch(error => {
			console.error(error);
		});
	if (data) {
		return removeUnnecessary(data);
	} else {
		return [];
	}
});