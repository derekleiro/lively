const compute_count = (reducerData, payloadData) => {
	if (reducerData === 0 && payloadData === -1) {
		return 0;
	} else {
		return reducerData + payloadData;
	}
};

export const TimerFeedReducer = (
	state = {
		tasks: 0,
		goals: 0,
		totalFocus: 0,
		tasksFocus: 0,
		goalsFocus: 0,
		graph: null,
		dispatch: false,
	},
	action
) => {
	switch (action.type) {
		case "HANDLE_TIMER_FEED":
			return (state = { ...action.payload, dispatch: true });
		case "RESET_TIMER_FEED":
			return (state = {
				tasks: 0,
				goals: 0,
				totalFocus: 0,
				tasksFocus: 0,
				goalsFocus: 0,
				graph: null,
				dispatch: false,
			});
		default:
			return state;
	}
};

export const TimerFeedStateReducer = (state = "Today", action) => {
	switch (action.type) {
		case "HANDLE_TIMER_FEED_TITLE":
			return (state = action.payload);
		case "RESET_TIMER_FEED_STATE":
			return (state = "Today");
		default:
			return state;
	}
};
