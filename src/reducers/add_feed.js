import moment from "moment";

const setTime = (timestamp) => {
	const now = moment();

	if (
		now.diff(timestamp, "days") >= 1 &&
		!moment(timestamp).calendar().includes("Yesterday")
	) {
		return "Earlier";
	} else if (moment(timestamp).calendar().includes("Yesterday")) {
		return "Yesterday";
	} else if (moment(timestamp).calendar().includes("Today")) {
		return "Today";
	} else if (moment(timestamp).calendar().includes("Tomorrow")) {
		return "Tomorrow";
	} else {
		return "Later";
	}
};

export const AddFeedNotifReducer = (state = 0, action) => {
	switch (action.type) {
		case "HANDLE_NOTIF_DISPATCH":
			return (state = state + 1);
		case "HANDLE_NOTIF_REMOVE":
			return (state = 0);
		default:
			return state;
	}
};

export const AddFeedURLReducer = (state = "", action) => {
	switch (action.type) {
		case "HANDLE_URL":
			return (state = action.payload);
		default:
			return state;
	}
};

export const AddFeedTextareaReducer = (state = false, action) => {
	switch (action.type) {
		case "HANDLE_TEXTAREA_STATE":
			return (state = action.payload);
		default:
			return state;
	}
};

export const AddFeedSwitchReducer = (state = "add", action) => {
	switch (action.type) {
		case "HANDLE_GOAL_SWITCH":
			return (state = "goal");
		case "HANDLE_ADD_SWITCH":
			return (state = "add");
		case "HANDLE_GOAL_SWITCH_UPDATE":
			return (state = "goal_");
		case "HANDLE_ADD_SWITCH_UPDATE":
			return (state = "add_");
		default:
			return state;
	}
};

export const AddFeedCompleteSetReducer = (state = 0, action) => {
	switch (action.type) {
		case "HANDLE_TODO_COMPLETE_SET":
			return (state = action.payload);
		default:
			return state;
	}
};

export const AddFeedImportantSetReducer = (state = 0, action) => {
	switch (action.type) {
		case "HANDLE_TODO_IMPORTANT_SET":
			return (state = action.payload);
		default:
			return state;
	}
};

export const AddTodosReducer = (state = { todos: [] }, action) => {
	switch (action.type) {
		case "DISPATCH_TODOS":
			return (state = {
				...state,
				todos: action.payload,
			});
		case "EDIT_TODO":
			const todo_to_edit = state.todos.find(
				(todo) => todo.todo_url === action.payload.todo_url
			);

			if (action.payload.focustime) {
				todo_to_edit.focustime = action.payload.focustime;
			}

			if (action.payload.desc) {
				todo_to_edit.desc = action.payload.desc;
			}

			if (action.payload.urgent) {
				todo_to_edit.urgent = action.payload.urgent;
			}

			if (action.payload.dueDate) {
				todo_to_edit.dueDate = action.payload.dueDate;
			}

			if (action.payload.category === null || action.payload.category) {
				todo_to_edit.category = action.payload.category;
			}

			if (action.payload.tag === null || action.payload.tag) {
				todo_to_edit.tag = action.payload.tag;
			}

			if (action.payload.tag_id === null || action.payload.tag_id) {
				todo_to_edit.tag_id = action.payload.tag_id;
			}

			if (action.payload.steps) {
				todo_to_edit.steps = action.payload.steps;
			}

			if (action.payload.step_edit) {
				todo_to_edit.steps.steps = todo_to_edit.steps.steps.filter(
					(step) => step.id !== action.payload.step_id
				);
			}

			if (action.payload.remindMe === null || action.payload.remindMe) {
				todo_to_edit.remindMe = action.payload.remindMe;
			}

			if (action.payload.notes) {
				todo_to_edit.notes = action.payload.notes;
			}

			if (action.payload.note_edit) {
				todo_to_edit.notes.notes = todo_to_edit.notes.notes.filter(
					(note) => note.id !== action.payload.note_id
				);
			}

			if (action.payload.complete === 0 || action.payload.complete === 1) {
				todo_to_edit.complete = action.payload.complete;

				if (action.payload.complete) {
					todo_to_edit.date_completed = new Date();
				} else {
					todo_to_edit.date_completed = null;
				}
			}

			if (action.payload.repeat) {
				todo_to_edit.repeat = action.payload.repeat;
			}

			if (action.payload.important === 0 || action.payload.important === 1) {
				todo_to_edit.important = action.payload.important;
			}

			return (state = {
				...state,
				todos: state.todos,
			});
		case "ADD_TODO_FOCUS":
			const todo_focus_edit = state.todos.find(
				(todo) => todo.todo_url === action.payload.url
			);

			todo_focus_edit.focustime = action.payload.focustime;

			return (state = {
				...state,
				goals: state.goals,
			});
		case "DELETE_TODO":
			return (state = {
				...state,
				todos: state.todos.filter(
					(todo) => todo.todo_url !== action.payload.todo_url
				),
			});
		case "COMPLETE_TODO":
			const todo_to_complete = state.todos.find(
				(todo) => todo.todo_url === action.payload.todo_url
			);

			todo_to_complete.complete = action.payload.complete;

			if (action.payload.complete) {
				todo_to_complete.date_completed = new Date();
			} else {
				todo_to_complete.date_completed = null;
			}

			return (state = {
				...state,
				todos: action.payload.complete
					? state.todos.filter(
							(todo) => todo.todo_url !== todo_to_complete.todo_url
					  )
					: state.todos,
			});
		case "IMPORTANT_TODO_SET":
			const todo_important = state.todos.find(
				(todo) => todo.todo_url === action.payload.todo_url
			);

			todo_important.important = action.payload.important;

			return (state = {
				...state,
				todos: state.todos,
			});
		case "HANDLE_TODOS":
			return (state = {
				...state,
				todos: state.todos.concat(action.payload),
			});
		case "HANDLE_TODOS_CATEGORY_CHANGE":
			const todos_to_edit = state.todos.filter(
				(todo) => todo.category === action.payload.category
			);

			todos_to_edit.forEach((todo) => {
				todo.category = action.payload.new_name;
			});

			return (state = {
				...state,
				todos: state.todos,
			});
		case "HANDLE_TODOS_CATEGORY_REMOVE":
			return (state = {
				...state,
				todos: state.todos.filter((todo) => todo.category !== action.payload),
			});
		case "HANDLE_TODOS_TAG_REMOVE":
			return (state = {
				...state,
				todos: state.todos.filter((todo) => todo.tag !== action.payload),
			});
		case "HANDLE_TODOS_CLEAR":
			return (state = { todos: [] });
		default:
			return state;
	}
};

export const AddGoalsReducer = (state = { goals: [] }, action) => {
	switch (action.type) {
		case "DISPATCH_GOALS":
			return (state = {
				...state,
				goals: action.payload,
			});
		case "HANDLE_GOALS":
			return (state = {
				...state,
				goals: state.goals.concat(action.payload),
			});
		case "EDIT_GOAL":
			const goal_to_edit = state.goals.find(
				(goal) => goal.goal_url === action.payload.goal_url
			);

			if (action.payload.title) {
				goal_to_edit.title = action.payload.title;
			}

			if (action.payload.desc) {
				goal_to_edit.desc = action.payload.desc;
			}

			if (action.payload.tag === null || action.payload.tag) {
				goal_to_edit.tag = action.payload.tag;
			}

			if (action.payload.tag_id === null || action.payload.tag_id) {
				goal_to_edit.tag_id = action.payload.tag_id;
			}

			if (action.payload.steps) {
				goal_to_edit.steps = action.payload.steps;
			}

			if (action.payload.step_edit) {
				goal_to_edit.steps.steps = goal_to_edit.steps.steps.filter(
					(step) => step.id !== action.payload.step_id
				);
			}

			if (action.payload.notes) {
				goal_to_edit.notes = action.payload.notes;
			}

			if (action.payload.note_edit) {
				goal_to_edit.notes.notes = goal_to_edit.notes.notes.filter(
					(note) => note.id !== action.payload.note_id
				);
			}

			if (action.payload.focustime) {
				goal_to_edit.focustime = action.payload.focustime;
			}

			if (action.payload.complete) {
				goal_to_edit.complete = action.payload.complete;
			}

			return (state = {
				...state,
				goals: state.goals,
			});
		case "HANDLE_TODOS_TAG_CLEAR":
			const goals_with_tag = state.goals.filter(
				(goal) => goal.tag === action.payload
			);

			goals_with_tag.map((goal) => {
				goal.tag = null;
				goal.tag_id = null;
			});
			return (state = {
				...state,
				goals: state.goals,
			});
		case "ADD_GOAL_FOCUS":
			const goal_focus_edit = state.goals.find(
				(goal) => goal.goal_url === action.payload.url
			);
			goal_focus_edit.focustime = action.payload.focustime;

			return (state = {
				...state,
				goals: state.goals,
			});
		case "DELETE_GOAL":
			return (state = {
				...state,
				goals: state.goals.filter(
					(goal) => goal.goal_url !== action.payload.goal_url
				),
			});
		case "COMPLETE_GOAL":
			const goal_complete_edit = state.goals.find(
				(goal) => goal.goal_url === action.payload.goal_url
			);

			if (action.payload.complete) {
				goal_complete_edit.complete = action.payload.complete;
				goal_complete_edit.date_completed = new Date();
			} else {
				goal_complete_edit.complete = action.payload.complete;
				goal_complete_edit.date_completed = null;
			}

			return (state = {
				...state,
				goals: state.goals.filter(
					(goal) => goal.goal_url !== action.payload.goal_url
				),
			});

		default:
			return state;
	}
};

export const GoalsFeedReducer = (state = { completed: [] }, action) => {
	switch (action.type) {
		case "HANDLE_COMPLETED_GOALS":
			return (state = {
				...state,
				completed: state.completed.concat(action.payload),
			});
		case "DISPATCH_COMPLETED_GOALS":
			return (state = {
				...state,
				completed: action.payload,
			});
		case "REMOVE_COMPLETE_GOAL":
			const goal_complete_edit = state.completed.find(
				(goal) => goal.goal_url === action.payload.goal_url
			);

			goal_complete_edit.complete = action.payload.complete;
			goal_complete_edit.date_completed = null;

			return (state = {
				...state,
				completed: state.completed.filter(
					(goal) => goal.goal_url !== action.payload.goal_url
				),
			});
		case "CLEAR_COMPLETED_GOALS":
			return (state = {
				...state,
				completed: [],
			});

		default:
			return state;
	}
};

export const GoalBackIndexReducer = (state = 0, action) => {
	switch (action.type) {
		case "CHANGE_GOAL_INDEX_COMPLETE":
			return (state = state + 1);
		case "CHANGE_GOAL_INDEX_HOME":
			return (state = 0);
		default:
			return state;
	}
};

export const AddFeedTodoDescReducer = (state = "", action) => {
	switch (action.type) {
		case "HANDLE_TODO_DESC":
			return (state = action.payload);
		default:
			return state;
	}
};

export const AddFeedStepsReducer = (state = { steps: [] }, action) => {
	switch (action.type) {
		case "HANDLE_TODO_STEPS":
			return (state = {
				...state,
				steps: state.steps.concat(action.payload),
			});

		case "DISPATCH_TODO_STEPS":
			return (state = {
				...state,
				steps: action.payload,
			});

		case "CLEAR_STEPS":
			return (state = { steps: [] });

		case "HANDLE_EDIT_TODO_STEP":
			const step_to_edit = state.steps[action.payload.index];
			step_to_edit.text = action.payload.text;

			return (state = {
				...state,
				steps: state.steps,
			});

		case "HANDLE_STEP_COMPLETE":
			const step_complete = state.steps[action.payload.index];

			step_complete.complete = action.payload.complete;

			return (state = {
				...state,
				steps: state.steps,
			});

		case "HANDLE_STEP_DELETE":
			return (state = {
				...state,
				steps: state.steps.filter((step) => step.id !== action.payload.id),
			});

		default:
			return state;
	}
};

export const AddFeedListReducer = (state = { lists: [] }, action) => {
	switch (action.type) {
		case "HANDLE_TODO_LIST_OPTION":
			return (state = {
				...state,
				lists: state.lists.concat(action.payload),
			});

		case "CLEAR_LISTS":
			return (state = { lists: [] });

		default:
			return state;
	}
};

export const AddFeedListSelectedReducer = (state = null, action) => {
	switch (action.type) {
		case "HANDLE_TODO_LIST_SELECTED":
			return (state = action.payload);
		default:
			return state;
	}
};

export const AddFeedTagReducer = (state = { tags: [] }, action) => {
	switch (action.type) {
		case "HANDLE_TODO_TAG_OPTION":
			return (state = {
				...state,
				tags: state.tags.concat(action.payload),
			});

		case "CLEAR_TAGS":
			return (state = { tags: [] });

		default:
			return state;
	}
};

export const AddFeedTagSelectedReducer = (
	state = { tag: null, id: null },
	action
) => {
	switch (action.type) {
		case "HANDLE_TODO_TAG_SELECTED":
			return (state = action.payload);
		default:
			return state;
	}
};

export const AddFeedDueDateReducer = (state = null, action) => {
	switch (action.type) {
		case "HANDLE_TODO_DUEDATE":
			return (state = action.payload);
		default:
			return state;
	}
};

export const AddFeedRemindReducer = (state = null, action) => {
	switch (action.type) {
		case "HANDLE_TODO_REMIND":
			return (state = action.payload);
		case "HANDLE_REMOVE_TODO_REMIND":
			return (state = null);
		default:
			return state;
	}
};

export const AddFeedRepeatReducer = (state = "Never", action) => {
	switch (action.type) {
		case "HANDLE_TODO_REPEAT_OPTION":
			return (state = action.payload);
		default:
			return state;
	}
};

export const AddFeedSummaryReducer = (state = "", action) => {
	switch (action.type) {
		case "HANDLE_GOAL_SUMMARY":
			return (state = action.payload);
		default:
			return state;
	}
};

export const AddFeedNotesReducer = (state = { notes: [] }, action) => {
	switch (action.type) {
		case "HANDLE_TODO_NOTES_OPTION":
			return (state = {
				...state,
				notes: state.notes.concat(action.payload),
			});

		case "DISPATCH_TODO_NOTES":
			return (state = {
				...state,
				notes: action.payload,
			});

		case "HANDLE_EDIT_TODO_NOTE_OPTION":
			const note_to_edit = state.notes[action.payload.index];
			note_to_edit.text = action.payload.text;
			return (state = {
				...state,
				notes: state.notes,
			});

		case "HANDLE_NOTE_DELETE":
			return (state = {
				...state,
				notes: state.notes.filter((note) => note.id !== action.payload.id),
			});

		case "CLEAR_NOTES":
			return (state = { notes: [] });

		default:
			return state;
	}
};

export const AddFeedFocusTimeReducer = (state = 0, action) => {
	switch (action.type) {
		case "HANDLE_FOCUSTIME":
			return (state = action.payload);
		default:
			return state;
	}
};

export const UsersListsReducer = (state = [], action) => {
	switch (action.type) {
		case "HANDLE_USER_LIST_DISPATCH":
			return (state = action.payload);
		case "HANDLE_USER_LIST_CHANGES":
			const todos_to_edit = state.filter(
				(todo) => todo.category === action.payload.category
			);

			todos_to_edit.forEach((todo) => {
				todo.category = action.payload.new_name;
			});

			return state;
		default:
			return state;
	}
};

export const TodoIndexReducer = (state = null, action) => {
	switch (action.type) {
		case "HANDLE_TODO_INDEX":
			return (state = action.payload);
		default:
			return state;
	}
};

export const BackIndexReducer = (state = "/", action) => {
	switch (action.type) {
		case "HANDLE_BACK_INDEX":
			return (state = action.payload);
		default:
			return state;
	}
};

export const TipsReducer = (state = 0, action) => {
	switch (action.type) {
		case "HANDLE_TIP_STATE":
			return (state = state + 1);
		default:
			return state;
	}
};

export const DateCompletedReducer = (state = null, action) => {
	switch (action.type) {
		case "HANDLE_DATE_COMPLETED":
			return (state = action.payload);
		case "RESET_DATE_COMPLETED":
			return (state = null);
		default:
			return state;
	}
};

export const UrgencyReducer = (state = "No", action) => {
	switch (action.type) {
		case "HANDLE_URGENCY_SET":
			return (state = action.payload);
		case "HANDLE_URGENCY_RESET":
			return (state = action.payload);
		default:
			return state;
	}
};
