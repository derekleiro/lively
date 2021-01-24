export const ListFeedReducer = (state = { lists: [] }, action) => {
    switch (action.type) {
        case "MOUNT_LISTS_DISPATCH":
            return (state = {
                ...state,
                lists: action.payload,
            });

        case "DISPATCH_LISTS":
            return (state = {
                ...state,
                lists: state.lists.concat(action.payload),
            });
        case "DELETE_LIST":
            return (state = {
                ...state,
                lists: state.lists.filter(
                    (list) => list.id !== action.payload.id
                ),
            });
        case "EDIT_LIST":
            const list_to_edit = state.lists.filter(
                (list) => list.list_id === action.payload.list_id
            );

            if (action.payload.new_name) {
                list_to_edit[0].name = action.payload.new_name;
            }

            if (action.payload.values) {
                list_to_edit[0].values = action.payload.values;
            }

            return (state = {
                ...state,
                lists: state.lists,
            });
        case "REFRESH_LIST_STATE":
            return (state = { lists: [] });

        default:
            return state;
    }
};

export const ListInfo = (state = {}, action) => {
    switch (action.type) {
        case "LIST_INFO":
            return (state = action.payload);
        default:
            return state;
    }
};

export const ListTasks = (state = { todos: [] }, action) => {
    switch (action.type) {
        case "LIST_TASKS":
            return (state = {
                ...state,
                todos: action.payload,
            });
        case "LIST_TASKS_APPEND":
            return (state = {
                ...state,
                todos: state.todos.concat(action.payload),
            });
        case "LIST_TASK_COMPLETE":
            const todo_to_complete = state.todos.find(
                (todo) => todo.todo_url === action.payload.todo_url
            );

            todo_to_complete.complete = action.payload.complete;

            return (state = {
                ...state,
                todos: state.todos,
            });
        case "LIST_TASK_IMPORTANT":
            const todo_important = state.todos.find(
                (todo) => todo.todo_url === action.payload.todo_url
            );

            todo_important.important = action.payload.important;

            return (state = {
                ...state,
                todos: state.todos,
            });
        case "LIST_TASKS_CLEAR":
            return (state = { todos: [] });
        default:
            return state;
    }
};

export const ListDefault = (state = {}, action) => {
    switch (action.type) {
        case "SET_LIST_DEFAULT":
            return (state = action.payload);

        default:
            return state;
    }
};

export const ListImportant = (state = {}, action) => {
    switch (action.type) {
        case "SET_LIST_IMPORTANT":
            return (state = action.payload);

        default:
            return state;
    }
};

export const ListCompleted = (state = {}, action) => {
    switch (action.type) {
        case "SET_LIST_COMPLETED":
            return (state = action.payload);

        default:
            return state;
    }
};
