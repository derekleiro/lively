export const focus_info = (data) => {
    return {
        type: "HANDLE_FOCUS_INFO",
        payload: data,
    };
};

export const clear_focus = {
    type: "HANDLE_CLEAR_FOCUS",
};

export const focus_timeSET = (data) => {
    return {
        type: "HANDLE_FOCUS_TIMESET",
        payload: data,
    };
};

export const focus_time_reduce = {
    type: "HANDLE_TIME_REDUCE",
};

export const focus_done = (data) => {
    return {
        type: "HANDLE_FOCUS_DONE",
        payload: data,
    };
};
