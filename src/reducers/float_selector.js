export const SelectorReducer = (state = "All", action) => {
	switch (action.type) {
		case "DISPATCH_SELECTED_LIST":
			return (state = action.payload);
		case "CLEAR_SELECTED_LIST":
			return (state = "All");
		default:
			return state;
	}
};
