import {H3Event} from "h3";

interface IApiStatus {
	status: string;
	data: any;
}

interface responseOptions {
	code?: number;
	data?: any;
}

export default {
	success(event?: H3Event, options?: responseOptions): IApiStatus {
		if (event && options?.code) setResponseStatus(event, options.code);
		return {status: 'success', data: options?.data};
	},

	error(event: H3Event, options?: responseOptions): IApiStatus {
		setResponseStatus(event, options?.code || 500);
		return {status: 'error', data: options?.data};
	},
}

