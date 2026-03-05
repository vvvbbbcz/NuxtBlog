import DB from "~/server/utils/models/BlogData";
import apiStatus from "~/server/utils/apiStatus";
import { type BlogInfo, toDB as toBlogInfoDB } from "~/utils/dbTypes/blogInfo";
import { type User, toDB as toUserDB } from "~/utils/dbTypes/user";
import { randomUUID } from "node:crypto";

async function filter(body: { blogInfo: BlogInfo, user: User }) {
	body.blogInfo.id = 0;
	body.user = {
		...body.user,
		id: -1,
		password: await hashPassword(body.user.password || randomUUID()),
		adminLevel: 0
	}
	return {
		blogInfo: toBlogInfoDB(body.blogInfo),
		user: { ...toUserDB(body.user), yr: 0 },
	}
}

export default defineEventHandler(async (event) => {
	if (!process.env.INSTALL) {
		throw createError({ statusCode: 405, statusMessage: 'Not in install mode' });
	}

	// check if installed
	if (await DB.exists({ _id: 0 }).exec()) {
		throw createError({ statusCode: 405, statusMessage: 'Installed' });
	}

	const body = await filter(await readBody(event));
	await Promise.all([DB.create(body.blogInfo), DB.create(body.user)]);

	return apiStatus.success(event, { code: 201 });
})
