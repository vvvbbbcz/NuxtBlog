import {H3Event} from "h3";

const apiStatus = {
	success: {
		status: 'success'
	},
	successWith(event: H3Event, code: number, data?: any) {
		setResponseStatus(event, code);
		return {...this.success, data: {...data}};
	},
	error(event: H3Event, code: number) {
		setResponseStatus(event, code);
		return {status: 'error'};
	}
}

export {apiStatus}
