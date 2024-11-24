import OSS from "ali-oss";
import consola from "consola";
import {initAliyun} from "~/server/utils/storage";

// const aliyunOSS = new OSS({
// 	region: process.env.ALI_OSS_REGION,
// 	accessKeyId: process.env.ALI_OSS_ACCESS_KEY_ID,
// 	accessKeySecret: process.env.ALI_OSS_ACCESS_KEY_SECRET,
// 	bucket: process.env.ALI_OSS_BUCKET
// });

export default defineNitroPlugin(() => {
	if (process.env.STORAGE_TYPE === 'aliyun-oss') {
		if (!process.env.ALI_OSS_REGION ||
			!process.env.ALI_OSS_ACCESS_KEY_ID ||
			!process.env.ALI_OSS_ACCESS_KEY_SECRET ||
			!process.env.ALI_OSS_BUCKET) {
			return;
		}
		const client = new OSS({
			region: process.env.ALI_OSS_REGION,
			accessKeyId: process.env.ALI_OSS_ACCESS_KEY_ID,
			accessKeySecret: process.env.ALI_OSS_ACCESS_KEY_SECRET,
			bucket: process.env.ALI_OSS_BUCKET,
		});
		initAliyun(client);
		consola.success('Initial storage AliyunOSS finished')
	} else if (!process.env.STORAGE_TYPE) {
		// TODO
	}
});
