export const HomeHeightReducer = (state = 0, action) => {
    switch (action.type) {
        case "HANDLE_HOME_HEIGHT":
            return (state = action.payload);
        default:
            return state;
    }
};

export const ListHeightReducer = (state = 0, action) => {
    switch (action.type) {
        case "HANDLE_LISTS_HEIGHT":
            return (state = action.payload);
        default:
            return state;
    }
};

export const ListViewHeightReducer = (state = 0, action) => {
    switch (action.type) {
        case "HANDLE_LISTVIEW_HEIGHT":
            return (state = action.payload);
        default:
            return state;
    }
};

export const GoalHeightReducer = (state = 0, action) => {
    switch (action.type) {
        case "HANDLE_GOALS_HEIGHT":
            return (state = action.payload);
        default:
            return state;
    }
};

export const GoalCompleteHeightReducer = (state = 0, action) => {
    switch (action.type) {
        case "HANDLE_GOALS_COMPLETE_HEIGHT":
            return (state = action.payload);
        default:
            return state;
    }
};

export const TimerHeightReducer = (state = 0, action) => {
    switch (action.type) {
        case "HANDLE_TIMER_HEIGHT":
            return (state = action.payload);
        default:
            return state;
    }
};

export const SettingsHeightReducer = (state = 0, action) => {
    switch (action.type) {
        case "HANDLE_SETTINGS_HEIGHT":
            return (state = action.payload);
        default:
            return state;
    }
};
