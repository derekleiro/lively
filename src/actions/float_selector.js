export const dispatch_selected_list = (data) => {
	return {
		type: "DISPATCH_SELECTED_LIST",
		payload: data,
	};
};

export const clear_selected_list = {
	type: "CLEAR_SELECTED_LIST",
};
