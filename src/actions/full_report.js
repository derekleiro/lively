export const dispatch_full_report = (data) => {
	return {
		type: "DISPATCH_REPORT_DATA",
		payload: data,
	};
};

export const clear_full_report = {
	type: "CLEAR_REPORT_DATA",
};

export const dispatch_full_report_state = (data) => {
	return {
		type: "DISPATCH_REPORT_DATA_STATE",
		payload: data,
	};
};

export const clear_full_report_state = {
	type: "CLEAR_REPORT_DATA_STATE",
};
