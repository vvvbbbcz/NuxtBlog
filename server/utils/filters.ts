export default {
	article: {
		all: function (additional?: any) { return { _id: { $gt: 0 }, ...additional } },
		published: function (additional?: any) { return { _id: { $gt: 0 }, dr: false, de: false, ...additional } },
		updated: function (additional?: any) { return { _id: { $gt: 0 }, dr: false, de: false, ...additional } },
		drafted: function (additional?: any) { return { _id: { $gt: 0 }, dr: true, de: false, ...additional } },
		deleted: function (additional?: any) { return { _id: { $gt: 0 }, de: true, ...additional } },
	},
	blog_info: function (additional?: any) { return { _id: 0, ...additional } },
	user: function (additional?: any) { return { _id: { $gte: -128, $lt: 0 }, ...additional } },
	menuItem: function (additional?: any) { return { _id: { $gte: -256, $lt: -128 }, ...additional } },
	tag: function (additional?: any) { return { _id: { $gte: -8192, $lt: -256 }, ...additional } },
}