import moment from "moment";

const compute_count = (reducerData, payloadData) => {
    if (reducerData === 0 && payloadData === -1) {
        return 0;
    } else {
        return reducerData + payloadData;
    }
};

export const TimerFeedReducer = (state = [], action) => {
    switch (action.type) {
        case "HANDLE_TIMER_FEED":
            return (state = action.payload);
        case "EDIT_TIMER_FEED":
            const { month, year } = action.payload;

            let month_to_edit = state.filter(
                (data) => data.month === month && data.year === year
            );

            if (month_to_edit[0]) {
                month_to_edit[0].totalFocus =
                    month_to_edit[0].totalFocus + action.payload.totalFocus;

                month_to_edit[0].tasksFocus =
                    month_to_edit[0].tasksFocus + action.payload.tasksFocus;

                month_to_edit[0].goalsFocus =
                    month_to_edit[0].goalsFocus + action.payload.goalsFocus;

                month_to_edit[0].completedGoals = compute_count(
                    month_to_edit[0].completedGoals,
                    action.payload.completedGoals
                );

                month_to_edit[0].completedTasks = compute_count(
                    month_to_edit[0].completedTasks,
                    action.payload.completedTasks
                );
            }

            return state;
        case "RESET_TIMER_FEED":
            return (state = []);
        default:
            return state;
    }
};

export const TimerFeedTodayReducer = (
    state = {
        tasks: 0,
        goals: 0,
        totalFocus: 0,
        tasksFocus: 0,
        goalsFocus: 0,
        timestamp: null,
    },
    action
) => {
    switch (action.type) {
        case "HANDLE_TIMER_FEED_TODAY":
            return (state = {
                tasks: action.payload.tasks,
                goals: action.payload.goals,
                totalFocus: action.payload.totalFocus,
                tasksFocus: action.payload.tasksFocus,
                goalsFocus: action.payload.goalsFocus,
                timestamp: action.payload.timestamp,
            });
        case "EDIT_TIMER_FEED_TODAY":
            if (!moment(state.timestamp).calendar().includes("Today")) {
                state.timestamp = new Date();
                state.tasks = action.payload.tasks;
                state.goals = action.payload.goals;
                state.goalsFocus = action.payload.goalsFocus;
                state.tasksFocus = action.payload.tasksFocus;
                state.totalFocus = action.payload.totalFocus;
            } else {
                state.tasks = compute_count(state.tasks, action.payload.tasks);
                state.goals = compute_count(state.goals, action.payload.goals);
                state.goalsFocus = state.goalsFocus + action.payload.goalsFocus;
                state.tasksFocus = state.tasksFocus + action.payload.tasksFocus;
                state.totalFocus = state.totalFocus + action.payload.totalFocus;
            }

            return state;
        case "RESET_TIMER_FEED_TODAY":
            return (state = {
                tasks: 0,
                goals: 0,
                totalFocus: 0,
                tasksFocus: 0,
                goalsFocus: 0,
                timestamp: null,
            });
        default:
            return state;
    }
};

export const TimerFeedWeekReducer = (
    state = {
        tasks: 0,
        goals: 0,
        totalFocus: 0,
        tasksFocus: 0,
        goalsFocus: 0,
        timestamp: null,
    },
    action
) => {
    switch (action.type) {
        case "HANDLE_TIMER_FEED_WEEK":
            return (state = {
                tasks: action.payload.tasks,
                goals: action.payload.goals,
                totalFocus: action.payload.totalFocus,
                tasksFocus: action.payload.tasksFocus,
                goalsFocus: action.payload.goalsFocus,
                timestamp: action.payload.timestamp,
            });
        case "EDIT_TIMER_FEED_WEEK":
            const now = moment();
            const days_passed = now.diff(state.timestamp, "days");

            if (days_passed >= 0 && days_passed <= 7) {
                state.tasks = compute_count(state.tasks, action.payload.tasks);
                state.goals = compute_count(state.goals, action.payload.goals);
                state.goalsFocus = state.goalsFocus + action.payload.goalsFocus;
                state.tasksFocus = state.tasksFocus + action.payload.tasksFocus;
                state.totalFocus = state.totalFocus + action.payload.totalFocus;
            } else {
                state.timestamp = new Date();
                state.tasks = action.payload.tasks;
                state.goals = action.payload.goals;
                state.goalsFocus = action.payload.goalsFocus;
                state.tasksFocus = action.payload.tasksFocus;
                state.totalFocus = action.payload.totalFocus;
            }

            return state;
        case "RESET_TIMER_FEED_WEEK":
            return (state = {
                tasks: 0,
                goals: 0,
                totalFocus: 0,
                tasksFocus: 0,
                goalsFocus: 0,
                timestamp: null,
            });
        default:
            return state;
    }
};

export const ToggleReducer = (state = 0, action) => {
    switch (action.type) {
        case "TOGGLE_TODAY":
            return (state = 0);
        case "TOGGLE_WEEK":
            return (state = state + 1);
        default:
            return state;
    }
};

export const MostFocusedReducer = (
    state = { today: null, week: null },
    action
) => {
    switch (action.type) {
        case "HANDLE_MOST_FOCUSED":
            state.today = action.payload.today;
            state.week = action.payload.week;

            return state;
        case "HANDLE_MOST_FOCUSED_EDIT":
            const chart_data = action.payload.data;

            const data_index = chart_data.today.ids.findIndex(
                (id) => id === action.payload.id
            );
            const data = chart_data.today.values[data_index];

            const most_focused_index = chart_data.today.ids.findIndex(
                (id) => id === state.today.id
            );

            const most_focused_today_data =
                chart_data.today.values[most_focused_index];

            if (data >= most_focused_today_data && data_index !== -1) {
                const new_name = chart_data.today.labels[data_index];

                state.today.name = new_name;
                state.today.id = chart_data.today.ids[data_index];
            }

            // ====== FOR WEEK ========
            const data_index_ = chart_data.week.ids.findIndex(
                (id) => id === action.payload.id
            );
            const data_ = chart_data.week.values[data_index_];

            const most_focused_index_ = chart_data.week.ids.findIndex(
                (id) => id === state.week.id
            );

            const most_focused_week_data =
                chart_data.week.values[most_focused_index_];

            console.log({
                data_index_,
                data_,
                most_focused_index_,
                most_focused_week_data,
            });

            if (data_ >= most_focused_week_data && data_index_ !== -1) {
                const new_name_ = chart_data.week.labels[data_index_];
                state.week.name = new_name_;
                state.week.id = chart_data.week.ids[data_index_];
            }

            return state;
        case "HANDLE_MOST_FOCUSED_CLEAR":
            return (state = { today: null, week: null });
        default:
            return state;
    }
};

export const ChartDataReducer = (
    state = { today: null, week: null },
    action
) => {
    switch (action.type) {
        case "HANDLE_CHART_DATA_DISPATCH":
            if (action.payload.today) {
                state.today = action.payload.today;
            }

            if (action.payload.week) {
                state.week = action.payload.week;
            }

            return state;

        case "HANDLE_CHART_DATA_EDIT":
            const label_index_today = state.today.ids.findIndex(
                (id) => id === action.payload.id
            );

            if (label_index_today !== -1) {
                state.today.values[label_index_today] =
                    state.today.values[label_index_today] +
                    action.payload.focustime / 60;
            } else {
                state.today.values[state.today.values.length - 1] =
                    state.today.values[state.today.values.length - 1] +
                    action.payload.focustime / 60;
            }

            const label_index = state.week.ids.findIndex(
                (id) => id === action.payload.id
            );

            if (label_index !== -1) {
                state.week.values[label_index] =
                    state.week.values[label_index] +
                    action.payload.focustime / 60;
            } else {
                state.week.values[state.week.values.length - 1] =
                    state.week.values[state.week.values.length - 1] +
                    action.payload.focustime / 60;
            }

            return state;
        case "HANDLE_CHART_DATA_NEW_TAG":
            if (state.today.labels.length < 5) {
                const new_label = action.payload.label;
                state.today.labels.push(
                    new_label.length > 9
                        ? `${new_label.slice(0, 8)}...`
                        : new_label
                );
                state.today.values.push(action.payload.value);
                state.today.ids.push(action.payload.id);
            } else {
                if (state.today.labels[5] === "Others") {
                    state.today.values[5] =
                        state.today.values[5] + action.payload.value;
                } else {
                    state.today.labels.push("Others");
                    state.today.values.push(action.payload.value);
                    state.today.ids.push("others");
                }
            }

            if (state.week.labels.length < 5) {
                const new_label = action.payload.label;
                state.week.labels.push(
                    new_label.length > 9
                        ? `${new_label.slice(0, 8)}...`
                        : new_label
                );
                state.week.values.push(action.payload.value);
                state.week.ids.push(action.payload.id);
            } else {
                if (state.week.labels[5] === "Others") {
                    state.week.values[5] =
                        state.week.values[5] + action.payload.value;
                } else {
                    state.week.labels.push("Others");
                    state.week.values.push(action.payload.value);
                    state.week.ids.push("others");
                }
            }

            return state;

        case "HANDLE_CHART_DATA_DELETE_TAG":
            const label_index_today_ = state.today.ids.findIndex(
                (id) => id === action.payload
            );

            if (label_index_today_ !== -1) {
                state.today.labels.splice(label_index_today_, 1);
                state.today.values.splice(label_index_today_, 1);
                state.today.ids.splice(label_index_today_, 1);
            }

            const label_index_ = state.week.ids.findIndex(
                (id) => id === action.payload
            );

            if (label_index_ !== -1) {
                state.week.labels.splice(label_index_, 1);
                state.week.values.splice(label_index_, 1);
                state.week.ids.splice(label_index_, 1);
            }

            return state;

        case "HANDLE_CHART_DATA_CLEAR":
            return (state = { today: null, week: null });
        default:
            return state;
    }
};
