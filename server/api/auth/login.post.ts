import User from "~/server/utils/models/BlogData";
import apiStatus from "~/server/utils/apiStatus";
import { fromDB } from "~/utils/dbTypes/user";

function filter(body: any) {
	return {
		username: String(body.username),
		password: String(body.password),
	};
}

export default defineEventHandler(async (event) => {
	const body = filter(await readBody(event));

	if (process.env.INSTALL) {
		const isValid = (body.username === 'installer') &&
			(await verifyPassword(await hashPassword('installer'), body.password));

		if (!isValid) {
			throw createError({ statusCode: 422 });
		}

		await setUserSession(event, {
			user: {
				_id: 0,
				ur: 'installer',
			},
			loggedInAt: new Date()
		});
	} else {
		const user = fromDB(await User
			.findOne(filters.user({ ur: body.username }))
			.select('pw')
			.lean());

		if (!user?.id || !user.password || !await verifyPassword(user.password, body.password)) {
			throw createError({ statusCode: 422 });
		}

		await setUserSession(event, {
			user: {
				_id: user.id,
				ur: body.username,
			},
			loggedInAt: new Date()
		});
	}
	return apiStatus.success();
});