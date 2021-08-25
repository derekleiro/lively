export const timer_feed = (data) => {
    return {
        type: "HANDLE_TIMER_FEED",
        payload: data,
    };
};

export const reset_timer_feed = {
    type: "RESET_TIMER_FEED",
};

export const timer_feed_title = (data) => {
    return {
        type: "HANDLE_TIMER_FEED_TITLE",
        payload: data,
    };
};

export const reset_timer_feed_state = {
    type: "RESET_TIMER_FEED_STATE",
};
