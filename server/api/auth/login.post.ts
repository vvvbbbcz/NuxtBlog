import User from "~/server/utils/models/BlogData";
import apiStatus from "~/server/utils/apiStatus";

function filter(body: any) {
	return {
		ur: body.ur,
		pw: body.pw,
	};
}

export default defineEventHandler(async (event) => {
	const body = filter(await readBody(event));

	if (process.env.INSTALL) {
		const isValid = (body.ur === 'installer') &&
			(await verifyPassword(await hashPassword('installer'), body.pw));

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
		const user = await User
			.findOne(filters.user({ ur: body.ur }))
			.select(['pw'])
			.lean();

		if (!user || !user.pw) {
			throw createError({ statusCode: 422 });
		}

		if (!await verifyPassword(user.pw, body.pw)) {
			throw createError({ statusCode: 422 });
		}

		await setUserSession(event, {
			user: {
				_id: user._id,
				ur: body.ur,
			},
			loggedInAt: new Date()
		});
	}
	return apiStatus.success();
});