import BlogData from "~/server/utils/models/BlogData";
import apiStatus from "~/server/utils/apiStatus";

async function filter(body: any) {
	return {
		blogInfo: {
			_id: 0,
			blogInfo: {
				name: body.name,
				icon: body.icon,
				separator: body.separator,
				background: body.background,
			},
		},
		admin: {
			_id: -1,
			ur: body.ur,
			ti: body.ti,
			md: body.md,
			pw: await hashPassword(body.pw),
			co: body.co,
			yr: 0,
			vi: 0
		}
	}
}

export default defineEventHandler(async (event) => {
	if (!process.env.INSTALL) {
		return apiStatus.error(event, {code: 405});
	}

	// check if installed
	if (await BlogData.exists({_id: 0}).exec()) {
		return apiStatus.error(event, {code: 405});
	}

	const body = await filter(await readBody(event));
	await Promise.all([BlogData.create(body.blogInfo), BlogData.create(body.admin)]);

	return apiStatus.success(event, {code: 201});
})