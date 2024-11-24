import OSS, {PutObjectResult} from "ali-oss";

let getFile: (name: string) => Promise<any>;
let putFile: (name: string, file: any) => Promise<PutObjectResult | null>;
let deleteFile;
let replaceFile;
let existFile: (name: string, options?: OSS.HeadObjectOptions | any) => Promise<boolean>;

export function initAliyun(client: OSS) {
	getFile = async (name: string) => {
		return await client.get(name);
	};
	putFile = async (name: string, file: any) => {
		try {
			return await client.put(name, new Buffer.from(file), {headers: {"x-oss-forbid-overwrite": true}});
		} catch (error) {
			console.error(error);
			return null;
		}
	};
	existFile = async (name: string, options: OSS.HeadObjectOptions = {}) => {
		try {
			await client.head(name, options);
			return true;
		} catch (error) {
			return false;
		}
	}
}

export {getFile, putFile, deleteFile, replaceFile, existFile};
