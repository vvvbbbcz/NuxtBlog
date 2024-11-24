import BlogInfo from "~/server/utils/models/BlogInfo";
import {apiStatus} from "~/server/utils/util";

function filter(id: number, body: any) {
	return {
		info: {
			_id: id,
			name: body.name,
			date: body.date,
			url: '',
			uid: body.uid,
			visible: body.visible
		},
		content: body.content
	}
}

export default defineEventHandler(async (event) => {
	const info: any = await BlogInfo.findOne().exec();
	if (!info) {
		return apiStatus.error(event, 500);
	}

	// console.log(await readBody(event));

	// const id = info.tagID++;
	// const body = filter(id, await readBody(event));
	//
	// const fileName = `${moment().year()}/${moment().month() + 1}/${body.info.name}`;
	// const result = await putFile(fileName, body.content);
	//
	// // await Promise.all([Picture.create(body.info), info.save()]);
	//
	// return apiStatus.successWith(event, 201, {id: id});
});