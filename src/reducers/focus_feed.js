export const FocusInfoReducer = (state = null, action) => {
    switch (action.type) {
        case "HANDLE_FOCUS_INFO":
            return (state = action.payload);
        case "HANDLE_CLEAR_FOCUS":
            return (state = null);
        default:
            return state;
    }
};

export const FocusTimeSetReducer = (state = null, action) => {
    switch (action.type) {
        case "HANDLE_FOCUS_TIMESET":
            return (state = action.payload);
        case "HANDLE_TIME_REDUCE":
            return (state = 0);
        default:
            return state;
    }
};

export const FocusDoneReducer = (state = false, action) => {
    switch (action.type) {
        case "HANDLE_FOCUS_DONE":
            return (state = action.payload);
        default:
            return state;
    }
};
