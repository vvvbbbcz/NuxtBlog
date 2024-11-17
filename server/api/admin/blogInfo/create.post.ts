import BlogInfo from "~/server/utils/models/BlogInfo";
import User from "~/server/utils/models/User";
import {apiStatus} from "~/server/utils/util";

async function filter(body: any) {
	return {
		blogInfo: {
			name: body.name,
			icon: body.icon,
			separator: body.separator,
			background: body.background,
			owner: 0,
			articleID: 0,
			tagID: 0,
			pictureID: 0,
			userID: 1
		},
		admin: {
			_id: 0,
			username: body.username,
			nickname: body.nickname,
			email: body.email,
			password: await hashPassword(body.password),
			avatar: 0,
			admin: true
		}
	}
}

export async function createBlogInfo(body: any) {
	return new BlogInfo(body);
}

export async function createAdmin(body: any) {
	return new User(body);
}

export default defineEventHandler(async (event) => {
	if (!process.env.INSTALL) {
		return apiStatus.error(event, 405);
	}

	// check if installed
	if (await BlogInfo.findOne().exec()) {
		return apiStatus.error(event, 405);
	}

	const body = await filter(await readBody(event));
	await Promise.all([BlogInfo.create(body.blogInfo), User.create(body.admin)]);

	return apiStatus.successWith(event, 201);
})