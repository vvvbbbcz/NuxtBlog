import crypto from "node:crypto";

const status = {
	error: {
		status: 'error'
	},
	success: {
		status: 'success'
	}
}

export {status}

export function flush(data: any) {
	for (const tag of data.tagId) {
		if (tag._id) {
			tag._id = undefined;
			tag.articles = undefined;
			tag.__v = undefined;
		}
	}

	data._id = undefined;
	data.markdown = undefined;
	data.visible = undefined;
	data.__v = undefined;

	const author = data.author;
	if (author._id) {
		author._id = undefined;
		author.admin = undefined;
		author.__v = undefined;
	}

	return data;
}

export function adminFlush(data: any) {
	for (const tag of data.tagId) {
		if (tag._id) {
			tag.articles = undefined;
			tag.urlName = undefined;
			tag.__v = undefined;
		}
	}

	data.__v = undefined;

	const author = data.author;
	if (author._id) {
		author.username = undefined;
		author.email = undefined;
		author.admin = undefined;
		author.__v = undefined;
	}

	return data;
}

export function sha256sum(value: string) {
	const hash = crypto.createHash('sha256');
	hash.update(value);
	return hash.digest('hex');
}
