export const EarlierCollapseReducer = (state = 0, action) => {
    switch (action.type) {
        case "ADD_EARLIER_COLLAPSE":
            return (state = state + 1);
        case "RESET_EARLIER_COLLAPSE":
            return (state = 0);
        default:
            return state;
    }
};

export const YesterdayCollapseReducer = (state = 0, action) => {
    switch (action.type) {
        case "ADD_YESTERDAY_COLLAPSE":
            return (state = state + 1);
        case "RESET_YESTERDAY_COLLAPSE":
            return (state = 0);
        default:
            return state;
    }
};

export const TodayCollapseReducer = (state = 0, action) => {
    switch (action.type) {
        case "ADD_TODAY_COLLAPSE":
            return (state = state + 1);
        case "RESET_TODAY_COLLAPSE":
            return (state = 0);
        default:
            return state;
    }
};

export const TomorrowCollapseReducer = (state = 0, action) => {
    switch (action.type) {
        case "ADD_TOMORROW_COLLAPSE":
            return (state = state + 1);
        case "RESET_TOMORROW_COLLAPSE":
            return (state = 0);
        default:
            return state;
    }
};

export const LaterCollapseReducer = (state = 0, action) => {
    switch (action.type) {
        case "ADD_LATER_COLLAPSE":
            return (state = state + 1);
        case "RESET_LATER_COLLAPSE":
            return (state = 0);
        default:
            return state;
    }
};
