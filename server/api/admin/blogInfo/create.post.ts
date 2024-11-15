import BlogInfo from "~/server/utils/models/BlogInfo";
import User from "~/server/utils/models/User";
import {apiStatus} from "~/server/utils/util";

function filter(body: any) {
	return {
		blogInfo: {
			name: body.name,
			icon: body.icon,
			separator: body.separator,
			background: body.background,
		},
		admin: {
			username: body.username,
			nickname: body.nickname,
			email: body.email,
			password: body.password,
		}
	}
}

export async function createBlogInfo(body: any) {
	const model = new BlogInfo(body);
	model.owner = 0;
	model.articleID = 0;
	model.tagID = 0;
	model.pictureID = 0;
	model.userID = 1;

	return model;
}

export async function createAdmin(body: any) {
	const model = new User(body);
	model._id = 0;
	model.avatar = 0;
	model.admin = true;

	return model;
}

export default defineEventHandler(async (event) => {
	if (!process.env.INSTALL) {
		setResponseStatus(event, 405);
		return apiStatus.error;
	}

	// check if installed
	const info = await BlogInfo.findOne().exec().catch(error => {
		console.error(error);
	});
	if (info) {
		setResponseStatus(event, 405);
		return apiStatus.error;
	}

	const body = filter(await readBody(event));

	const blogInfo = await createBlogInfo(body.blogInfo);
	const infoResult = await blogInfo.save().catch(error => {
		console.error(error);
	});
	if (!infoResult) {
		setResponseStatus(event, 500);
		return apiStatus.error;
	}

	const admin = await createAdmin(body.admin);
	const adminResult = await admin.save().catch(error => {
		console.error(error);
	});
	if (!adminResult) {
		setResponseStatus(event, 500);
		return apiStatus.error;
	}

	setResponseStatus(event, 201);
	return apiStatus.error;
})