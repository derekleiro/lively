export const GoalTimeoutReducer = (state = 0, action) => {
    switch (action.type) {
        case "HANDLE_GOAL_TIMEOUT":
            return (state = state + 1);
        default:
            return state;
    }
};

export const HomeTimeoutReducer = (state = 0, action) => {
    switch (action.type) {
        case "HANDLE_HOME_TIMEOUT":
            return (state = state + 1);
        case "HANDLE_HOME_TIMEOUT_CLEAR":
            return (state = 0);
        default:
            return state;
    }
};

export const ListTimeoutReducer = (state = 0, action) => {
    switch (action.type) {
        case "HANDLE_LIST_TIMEOUT":
            return (state = state + 1);
        case "HANDLE_LIST_TIMEOUT_CLEAR":
            return (state = 0);
        default:
            return state;
    }
};

export const ListViewTimeoutReducer = (state = 0, action) => {
    switch (action.type) {
        case "HANDLE_LISTVIEW_TIMEOUT":
            return (state = state + 1);
        case "HANDLE_LISTVIEW_TIMEOUT_CLEAR":
            return (state = 0);
        default:
            return state;
    }
};

export const FocusTimeoutReducer = (state = 0, action) => {
    switch (action.type) {
        case "HANDLE_FOCUS_TIMEOUT":
            return (state = state + 1);
        default:
            return state;
    }
};

export const TaskCompleteTimeoutReducer = (state = 0, action) => {
    switch (action.type) {
        case "HANDLE_TASK_COMPLETE_TIMEOUT":
            return (state = state + 1);
        case "HANDLE_TASK_COMPLETE_TIMEOUT_RESET":
            return (state = 0);
        default:
            return state;
    }
};

export const ImportantCompleteTimeoutReducer = (state = 0, action) => {
    switch (action.type) {
        case "HANDLE_IMPORTANT_COMPLETE_TIMEOUT":
            return (state = state + 1);
        case "HANDLE_IMPORTANT_COMPLETE_TIMEOUT_RESET":
            return (state = 0);
        default:
            return state;
    }
};


export const GoalCompleteTimeoutReducer = (state = 0, action) => {
    switch (action.type) {
        case "HANDLE_GOAL_COMPLETE_TIMEOUT":
            return (state = state + 1);
        case "HANDLE_GOAL_COMPLETE_TIMEOUT_RESET":
            return (state = 0);
        default:
            return state;
    }
};

export const CompletedGoalsTimeoutReducer = (state = 0, action) => {
    switch (action.type) {
        case "HANDLE_COMPLETED_GOALS_TIMEOUT":
            return (state = state + 1);
        case "HANDLE_COMPLETED_GOALS_TIMEOUT_RESET":
            return (state = 0);
        default:
            return state;
    }
};
