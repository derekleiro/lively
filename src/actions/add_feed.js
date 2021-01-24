export const add_switch_goal = {
    type: "HANDLE_GOAL_SWITCH",
};

export const add_switch_add = {
    type: "HANDLE_ADD_SWITCH",
};

export const add_switch_goal_update = {
    type: "HANDLE_GOAL_SWITCH_UPDATE",
};

export const add_switch_add_update = {
    type: "HANDLE_ADD_SWITCH_UPDATE",
};

export const dispatch_notif = {
    type: "HANDLE_NOTIF_DISPATCH",
};

export const remove_notif = {
    type: "HANDLE_NOTIF_REMOVE",
};

export const handle_url = (data) => {
    return {
        type: "HANDLE_URL",
        payload: data,
    };
};

export const textarea_state = (data) => {
    return {
        type: "HANDLE_TEXTAREA_STATE",
        payload: data,
    };
};

export const dispatch_todos = (data) => {
    return {
        type: "DISPATCH_TODOS",
        payload: data,
    };
};

export const todo_edit = (data) => {
    return {
        type: "EDIT_TODO",
        payload: data,
    };
};

export const todo_focus_edit = (data) => {
    return {
        type: "ADD_TODO_FOCUS",
        payload: data,
    };
};

export const todo_delete = (data) => {
    return {
        type: "DELETE_TODO",
        payload: data,
    };
};

export const todo_complete = (data) => {
    return {
        type: "COMPLETE_TODO",
        payload: data,
    };
};

export const todos = (data) => {
    return {
        type: "HANDLE_TODOS",
        payload: data,
    };
};

export const todos_category_change = (data) => {
    return {
        type: "HANDLE_TODOS_CATEGORY_CHANGE",
        payload: data,
    };
};

export const todos_category_remove = (data) => {
    return {
        type: "HANDLE_TODOS_CATEGORY_REMOVE",
        payload: data,
    };
};

export const todos_tag_remove = (data) => {
    return {
        type: "HANDLE_TODOS_TAG_REMOVE",
        payload: data,
    };
};

export const todos_clear = {
    type: "HANDLE_TODOS_CLEAR",
};

export const dispatch_goals = (data) => {
    return {
        type: "DISPATCH_GOALS",
        payload: data,
    };
};

export const goals = (data) => {
    return {
        type: "HANDLE_GOALS",
        payload: data,
    };
};

export const goal_edit = (data) => {
    return {
        type: "EDIT_GOAL",
        payload: data,
    };
};

export const goal_focus_edit = (data) => {
    return {
        type: "ADD_GOAL_FOCUS",
        payload: data,
    };
};

export const goal_delete = (data) => {
    return {
        type: "DELETE_GOAL",
        payload: data,
    };
};

export const goal_complete = (data) => {
    return {
        type: "COMPLETE_GOAL",
        payload: data,
    };
};

export const completed_goals = (data) => {
    return {
        type: "HANDLE_COMPLETED_GOALS",
        payload: data,
    };
};

export const dispatch_completed_goals = (data) => {
    return {
        type: "DISPATCH_COMPLETED_GOALS",
        payload: data,
    };
};

export const remove_goal_complete = (data) => {
    return {
        type: "REMOVE_COMPLETE_GOAL",
        payload: data,
    };
};

export const todo_complete_set = (data) => {
    return {
        type: "HANDLE_TODO_COMPLETE_SET",
        payload: data,
    };
};

export const goal_index_home = {
    type: "CHANGE_GOAL_INDEX_HOME"
}

export const goal_index_completed = {
    type: "CHANGE_GOAL_INDEX_COMPLETE"
}

export const todo_desc = (data) => {
    return {
        type: "HANDLE_TODO_DESC",
        payload: data,
    };
};

export const todo_important_set = (data) => {
    return {
        type: "HANDLE_TODO_IMPORTANT_SET",
        payload: data,
    };
};

export const important_todo_set = (data) => {
    return {
        type: "IMPORTANT_TODO_SET",
        payload: data,
    };
};

export const todo_steps = (data) => {
    return {
        type: "HANDLE_TODO_STEPS",
        payload: data,
    };
};

export const dispatch_todo_steps = (data) => {
    return {
        type: "DISPATCH_TODO_STEPS",
        payload: data,
    };
};

export const todo_edit_step = (data) => {
    return {
        type: "HANDLE_EDIT_TODO_STEP",
        payload: data,
    };
};

export const todo_step_delete = (data) => {
    return {
        type: "HANDLE_STEP_DELETE",
        payload: data,
    };
};

export const todo_step_complete = (data) => {
    return {
        type: "HANDLE_STEP_COMPLETE",
        payload: data,
    };
};

export const todo_steps_clear = {
    type: "CLEAR_STEPS",
};

export const todo_list_option = (data) => {
    return {
        type: "HANDLE_TODO_LIST_OPTION",
        payload: data,
    };
};

export const todo_list_selected = (data) => {
    return {
        type: "HANDLE_TODO_LIST_SELECTED",
        payload: data,
    };
};

export const todo_list_clear = {
    type: "CLEAR_LISTS",
};

export const todo_tag_option = (data) => {
    return {
        type: "HANDLE_TODO_TAG_OPTION",
        payload: data,
    };
};

export const todo_tag_selected = (data) => {
    return {
        type: "HANDLE_TODO_TAG_SELECTED",
        payload: data,
    };
};

export const todo_tag_clear = {
    type: "CLEAR_TAGS",
};

export const todo_due_date = (data) => {
    return {
        type: "HANDLE_TODO_DUEDATE",
        payload: data,
    };
};

export const todo_remind_timestamp = (data) => {
    return {
        type: "HANDLE_TODO_REMIND",
        payload: data,
    };
};

export const todo_remove_reminder= {
    type: "HANDLE_REMOVE_TODO_REMIND",
};

export const todo_repeat_option = (data) => {
    return {
        type: "HANDLE_TODO_REPEAT_OPTION",
        payload: data,
    };
};

export const goal_summary = (data) => {
    return {
        type: "HANDLE_GOAL_SUMMARY",
        payload: data,
    };
};

export const todo_notes_option = (data) => {
    return {
        type: "HANDLE_TODO_NOTES_OPTION",
        payload: data,
    };
};

export const dispatch_todo_notes = (data) => {
    return {
        type: "DISPATCH_TODO_NOTES",
        payload: data,
    };
};

export const todo_edit_note_option = (data) => {
    return {
        type: "HANDLE_EDIT_TODO_NOTE_OPTION",
        payload: data,
    };
};

export const todo_notes_clear = {
    type: "CLEAR_NOTES",
};

export const clear_completed_goals= {
    type: "CLEAR_COMPLETED_GOALS",
};

export const todo_note_delete = (data) => {
    return {
        type: "HANDLE_NOTE_DELETE",
        payload: data,
    };
};

export const handle_focustime = (data) => {
    return {
        type: "HANDLE_FOCUSTIME",
        payload: data,
    };
};

export const handle_default_lists = (data) => {
    return {
        type: "HANDLE_DEFAULT_LIST_DISPATCH",
        payload: data,
    };
};

export const handle_users_lists = (data) => {
    return {
        type: "HANDLE_USER_LIST_DISPATCH",
        payload: data,
    };
};

export const handle_users_lists_changes = (data) => {
    return {
        type: "HANDLE_USER_LIST_CHANGES",
        payload: data,
    };
};

export const todo_index = (data) => {
    return {
        type: "HANDLE_TODO_INDEX",
        payload: data,
    };
};

export const back_index = (data) => {
    return {
        type: "HANDLE_BACK_INDEX",
        payload: data,
    };
};
