import {sha256sum} from "~/server/utils/util";
import User from "~/server/utils/models/User";

function filter(body: any) {
	return {
		username: body.username,
		password: sha256sum(body.password)
	};
}

export default defineEventHandler(async (event) => {
	const body = filter(await readBody(event));

	if (process.env.INSTALL) {
		const isValid = (body.username === 'installer') &&
			(body.password === '3f756651bff16fd0195c6170de995c64abbf710c5773f0788b659c435b7f6da1'); // 'installer'
		if (!isValid) {
			setResponseStatus(event, 422);
			return null;
		}


		await setUserSession(event, {
			user: {
				id: 0,
				username: 'installer',
			},
			loggedInAt: new Date()
		});
	} else {
		const user = await User.findOne({username: body.username}).select('+password').exec().catch(error => {
			console.error(error);
		});
		if (!user) {
			setResponseStatus(event, 422);
			return null;
		}

		const isValid = body.password === user.password;
		if (!isValid) {
			setResponseStatus(event, 422);
			return null;
		}

		await setUserSession(event, {
			user: {
				id: user._id,
				username: body.username,
			},
			loggedInAt: new Date()
		});
	}
});