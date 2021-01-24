export const timer_feed = (data) => {
    return {
        type: "HANDLE_TIMER_FEED",
        payload: data,
    };
};

export const edit_timer_feed = (data) => {
    return {
        type: "EDIT_TIMER_FEED",
        payload: data,
    };
};

export const reset_timer_feed = {
    type: "RESET_TIMER_FEED",
};

export const timer_feed_today = (data) => {
    return {
        type: "HANDLE_TIMER_FEED_TODAY",
        payload: data,
    };
};

export const edit_timer_feed_today = (data) => {
    return {
        type: "EDIT_TIMER_FEED_TODAY",
        payload: data,
    };
};

export const reset_timer_feed_today = {
    type: "RESET_TIMER_FEED_TODAY",
};

export const timer_feed_week = (data) => {
    return {
        type: "HANDLE_TIMER_FEED_WEEK",
        payload: data,
    };
};

export const edit_timer_feed_week = (data) => {
    return {
        type: "EDIT_TIMER_FEED_WEEK",
        payload: data,
    };
};

export const reset_timer_feed_week = {
    type: "RESET_TIMER_FEED_WEEK",
};

export const toggle_week = {
    type: "TOGGLE_WEEK",
};

export const toggle_today = {
    type: "TOGGLE_TODAY",
};

export const most_focused = (data) => {
    return {
        type: "HANDLE_MOST_FOCUSED",
        payload: data,
    };
};

export const most_focused_edit = (data) => {
    return {
        type: "HANDLE_MOST_FOCUSED_EDIT",
        payload: data,
    };
};

export const clear_most_focused = {
    type: "HANDLE_MOST_FOCUSED_CLEAR",
};

export const chart_data = (data) => {
    return {
        type: "HANDLE_CHART_DATA_DISPATCH",
        payload: data,
    };
};

export const clear_chart_data = {
    type: "HANDLE_CHART_DATA_CLEAR",
};

export const edit_chart_data = (data) => {
    return {
        type: "HANDLE_CHART_DATA_EDIT",
        payload: data,
    };
};

export const add_chart_data_tag = (data) => {
    return {
        type: "HANDLE_CHART_DATA_NEW_TAG",
        payload: data,
    };
};

export const delete_chart_data_tag = (data) => {
    return {
        type: "HANDLE_CHART_DATA_DELETE_TAG",
        payload: data,
    };
};
