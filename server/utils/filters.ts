export default {
	article: {
		published: { _id: { $gt: 0 }, dr: false, de: false },
		drafted: { _id: { $gt: 0 }, dr: true, de: false },
		deleted: { _id: { $gt: 0 }, de: true },
	},
	blog_info: { _id: 0 },
	user: { _id: { $gte: -128, $lt: 0 } },
	menuItem: { _id: { $gte: -256, $lt: -128 } },
	tag: { _id: { $gte: -8192, $lt: -256 } },
}