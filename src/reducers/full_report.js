export const ReportReducer = (
	state = {
		data: {
			tasks: 0,
			goals: 0,
			totalFocus: 0,
			tasksFocus: 0,
			goalsFocus: 0,
			tag: 0,
		},
		graphdata: { data: null, most_focused: { name: null } },
	},
	action
) => {
	switch (action.type) {
		case "DISPATCH_REPORT_DATA":
			return (state = action.payload);
		case "CLEAR_REPORT_DATA":
			return (state = {
				data: {
					tasks: 0,
					goals: 0,
					totalFocus: 0,
					tasksFocus: 0,
					goalsFocus: 0,
					tag: 0,
				},
				graphdata: { data: null, most_focused: { name: null } },
			});
		default:
			return state;
	}
};

export const ReportStateReducer = (
	state = { name: "", timeframe: null },
	action
) => {
	switch (action.type) {
		case "DISPATCH_REPORT_DATA_STATE":
			return (state = action.payload);
		case "CLEAR_REPORT_DATA_STATE":
			return (state = { name: "", timeframe: null });
		default:
			return state;
	}
};
