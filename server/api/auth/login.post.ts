import User from "~/server/utils/models/BlogData";
import apiStatus from "~/server/utils/apiStatus";

function filter(body: any) {
	return {
		ur: body.ur,
		pw: body.pw
	};
}

export default defineEventHandler(async (event) => {
	const body = filter(await readBody(event));

	if (process.env.INSTALL) {
		// 'installer'
		const hashedPassword =
			await hashPassword('9c0d294c05fc1d88d698034609bb81c0c69196327594e4c69d2915c80fd9850c')
		const isValid = (body.ur === 'installer') &&
			(await verifyPassword(hashedPassword, body.pw));
		if (!isValid) {
			return apiStatus.error(event, {code: 422});
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
			.findOne({_id: {$gt: -1001, $lt: 0}, ur: body.ur})
			.select(['pw'])
			.lean();

		if (!user || !user.pw) {
			return apiStatus.error(event, {code: 422});
		}

		if (!await verifyPassword(user.pw, body.pw)) {
			return apiStatus.error(event, {code: 422});
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