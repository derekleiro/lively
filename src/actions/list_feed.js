export const lists_dispatch = (data) => {
    return {
        type: "DISPATCH_LISTS",
        payload: data,
    };
};

export const dispatch_lists = (data) => {
    return {
        type: "MOUNT_LISTS_DISPATCH",
        payload: data,
    };
};

export const list_delete = (data) => {
    return {
        type: "DELETE_LIST",
        payload: data,
    };
};

export const list_edit = (data) => {
    return {
        type: "EDIT_LIST",
        payload: data,
    };
};

export const list_info = (data) => {
    return {
        type: "LIST_INFO",
        payload: data,
    };
};

export const dispatch_list_tasks = (data) => {
    return {
        type: "LIST_TASKS",
        payload: data,
    };
};

export const append_list_tasks = (data) => {
    return {
        type: "LIST_TASKS_APPEND",
        payload: data,
    };
};

export const clear_list = {
    type: "LIST_TASKS_CLEAR",
};

export const refresh_list_state = {
    type: "REFRESH_LIST_STATE",
};

export const dispatch_list_default = (data) => {
    return {
        type: "SET_LIST_DEFAULT",
        payload: data,
    };
};

export const dispatch_list_important = (data) => {
    return {
        type: "SET_LIST_IMPORTANT",
        payload: data,
    };
};

export const dispatch_list_completed = (data) => {
    return {
        type: "SET_LIST_COMPLETED",
        payload: data,
    };
};

export const list_task_complete = (data) => {
    return {
        type: "LIST_TASK_COMPLETE",
        payload: data,
    };
};

export const list_task_important = (data) => {
    return {
        type: "LIST_TASK_IMPORTANT",
        payload: data,
    };
};
