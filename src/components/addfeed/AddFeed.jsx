import React, { useEffect } from "react";
import Dexie from "dexie";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

import "./add-feed.css";

import {
    add_switch_goal,
    add_switch_goal_update,
    add_switch_add,
    add_switch_add_update,
    todo_desc,
    todo_list_selected,
    todo_due_date,
    todo_remind_timestamp,
    todo_repeat_option,
    goal_summary,
    todo_steps_clear,
    todo_list_clear,
    todo_notes_clear,
    todos,
    todo_delete,
    goals,
    goal_delete,
    todo_complete_set,
    todo_important_set,
    textarea_state,
    handle_focustime,
    handle_url,
    todo_tag_selected,
    remove_notif,
    todos_clear,
    clear_completed_goals,
} from "../../actions/add_feed";

import { home_timeout_clear } from "../../actions/timeouts";

import back_icon from "../../assets/icons/back.png";
import back_icon_light from "../../assets/icons/back_light.png";

import TextBar from "./textbar/Textbar";
import Category from "./category/Category";
import DueDate from "./duedate/DueDate";
import Repeat from "./repeat/Repeat";
import Remind from "./remind/Remind";
import Notes from "./notes/Notes";
import { mode } from "../../constants/color";
import Summary from "./summary/Summary";
import {
    remove_notification,
    schedule_notification,
} from "../../util/notifications";
import { refresh_list_state } from "../../actions/list_feed";
import { list_timeout_clear } from "../../actions/timeouts";
import Tag from "./Tag/Tag";
import { navStateLists } from "../../actions/bottom_nav";
import { clear_chart_data } from "../../actions/timer_feed";
import { session_add } from "../../util/session_add";
import add_session from "../../util/session";
import repeat from "../../util/repeat";

const AddFeed = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const darkMode = useSelector((state) => state.dark_mode);
    const switch_to_add = useSelector((state) => state.addfeed_switch);

    const todo_complete_set_state = useSelector(
        (state) => state.todo_complete_set
    );
    const todo_desc_state = useSelector((state) => state.todo_desc);
    const todo_important_set_state = useSelector(
        (state) => state.todo_important_set
    );
    const todo_steps_state = useSelector((state) => state.todo_steps.steps);
    const todo_list_selected_state = useSelector(
        (state) => state.todo_list_selected
    );
    const todo_tag_selected_state = useSelector(
        (state) => state.todo_tag_selected
    );

    const todo_due_date_state = useSelector((state) => state.todo_due_date);
    const todo_remind_timestamp_state = useSelector(
        (state) => state.todo_remind_timestamp
    );
    const todo_notes_option_state = useSelector(
        (state) => state.todo_notes_option.notes
    );
    const todo_repeat_option_state = useSelector(
        (state) => state.todo_repeat_option
    );
    const todos_state = useSelector((state) => state.todos.todos);
    const goal_summary_state = useSelector((state) => state.goal_summary);
    const todo_index = useSelector((state) => state.todo_index);
    const back_index = useSelector((state) => state.back_index);
    const goal_index = useSelector((state) => state.goal_index);
    const notif_state = useSelector((state) => state.notif_state);

    const month = moment(new Date()).format("MMMM");
    const year = moment(new Date()).format("yyyy");

    const uid = window.location.href.substring(
        window.location.href.lastIndexOf("/") + 1
    );

    const style = {
        add: {
            color:
                switch_to_add === "add" || switch_to_add === "add_"
                    ? "white"
                    : "grey",
            margin: "0 5px",
            fontSize: "22px",
        },
        goal: {
            color:
                switch_to_add === "goal" || switch_to_add === "goal_"
                    ? "white"
                    : "grey",
            margin: "0 5px",
            fontSize: "22px",
        },
        addDark: {
            color:
                switch_to_add === "add" || switch_to_add === "add_"
                    ? "black"
                    : "lightgrey",
            margin: "0 5px",
            fontSize: "22px",
        },
        goalDark: {
            color:
                switch_to_add === "goal" || switch_to_add === "goal_"
                    ? "black"
                    : "lightgrey",
            margin: "0 5px",
            fontSize: "22px",
        },
    };

    const todoDB = new Dexie("LivelyTodos");
    todoDB.version(1).stores({
        todos: `todo_url,desc,dueDate,category,tag,tag_id,steps,focustime,index,date_completed,remindMe,notes,todo_url,complete`,
    });

    const goalDB = new Dexie("LivelyGoals");
    goalDB.version(1).stores({
        goals: `goal_url,title,desc,steps,notes,focustime,date_completed,goal_url,complete`,
    });

    const listDB = new Dexie("LivelyLists");
    listDB.version(1).stores({
        lists: `list_id,name,todo,completed,list_id,index`,
    });

    const generateURL = (switch_to_add) => {
        const uuid = uuidv4();
        let url;
        if (switch_to_add === "add") {
            url = `add_${uuid}`;
        } else {
            url = `goal_${uuid}`;
        }

        return url;
    };

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

    const clearState = () => {
        dispatch(todo_desc(""));
        dispatch(todo_steps_clear);
        dispatch(todo_list_selected(null));
        dispatch(todo_tag_selected({ tag: null, id: null }));
        dispatch(todo_list_clear);
        dispatch(todo_due_date(null));
        dispatch(todo_remind_timestamp(null));
        dispatch(todo_repeat_option(""));
        dispatch(goal_summary(""));
        dispatch(todo_notes_clear);
        dispatch(todo_complete_set(0));
        dispatch(todo_important_set(0));
        dispatch(textarea_state(false));
        dispatch(handle_focustime(0));
        dispatch(add_switch_add);
        dispatch(handle_url(""));
        dispatch(remove_notif);
    };

    const set_all_list = async () => {
        const list = await listDB.lists
            .filter((list) => {
                return list.list_id === "All_default" && list.default === true;
            })
            .toArray();

        if (list.length === 0) {
            await listDB.lists
                .add({
                    name: "All",
                    list_id: "All_default",
                    index: 0,
                    default: true,
                })
                .then(() => console.log("list added..."))
                .catch((e) => console.log(e));
        }
    };

    const add_todo = async () => {
        const url = generateURL(switch_to_add);

        const index = JSON.parse(localStorage.getItem("todo_index"));
        const todo_index = index + 1;

        const todo = {
            desc: todo_desc_state,
            dueDate: todo_due_date_state,
            category: todo_list_selected_state,
            tag: todo_tag_selected_state.tag,
            tag_id: todo_tag_selected_state.id,
            steps: { steps: todo_steps_state },
            focustime: 0,
            index: todo_index,
            remindMe: todo_remind_timestamp_state,
            notes: { notes: todo_notes_option_state },
            todo_url: url,
            complete: todo_complete_set_state,
            repeat: todo_repeat_option_state,
            important: todo_important_set_state,
            default: "All",
            date_completed: null,
        };

        dispatch(todos(todo));
        if (todos_state.length === 0) {
            const todosToday = await todoDB.todos
                .filter((todo) => {
                    return setTime(todo.dueDate) === "Today";
                })
                .toArray();

            const todos_ = await todoDB.todos
                .filter((todo) => {
                    return (
                        setTime(todo.dueDate) !== "Today" && todo.complete === 0
                    );
                })
                .toArray();

            dispatch(
                todos(
                    [].concat(todosToday, todos_).sort((todoA, todoB) => {
                        return todoA.dueDate - todoB.dueDate;
                    })
                )
            );
        }

        if (todo_remind_timestamp_state && !todo_complete_set_state) {
            schedule_notification(
                todo_remind_timestamp_state.timestamp,
                todo_desc_state,
                todo_index,
                {
                    text: todo.desc,
                    focustime: 0,
                    url: todo.todo_url,
                    type: "task",
                    steps: todo.steps.steps,
                    tag: todo.tag,
                    tag_id: todo.tag_id,
                }
            );
        }

        localStorage.setItem("todo_index", todo_index);

        if (todo_complete_set_state) {
            const data_1 = {
                month,
                year,
                createdAt: new Date(),
                totalFocus: 0,
                tasksFocus: 0,
                goalsFocus: 0,
                completedGoals: 0,
                completedTasks: 1,
            };
            const todo = {
                desc: todo_desc_state,
                dueDate: todo_due_date_state,
                category: todo_list_selected_state,
                date_completed: new Date(),
                tag: todo_tag_selected_state.tag,
                tag_id: todo_tag_selected_state.id,
                steps: { steps: todo_steps_state },
                focustime: 0,
                index: todo_index,
                remindMe: todo_remind_timestamp_state,
                notes: { notes: todo_notes_option_state },
                todo_url: url,
                repeat: todo_repeat_option_state,
                complete: todo_complete_set_state,
                important: todo_important_set_state,
                default: "All",
            };
            await todoDB.todos.add(todo);

            repeat(todo).then((data) => {
                if (data) {
                    const dispatch_timeout = setTimeout(() => {
                        dispatch(todos(data));
                        clearTimeout(dispatch_timeout);
                    }, 500);
                }
            });

            add_session(data_1);
            session_add({
                tasks: 0,
                goals: 0,
                total: 0,
                todos_count: 1,
                goals_count: 0,
            });
        } else {
            await todoDB.todos.add(todo);
        }

        set_all_list();
        dispatch(add_switch_add);
        dispatch(refresh_list_state);
        dispatch(list_timeout_clear);
        clearState();
    };

    const add_goal = async () => {
        const goal = {
            title: todo_desc_state,
            desc: goal_summary_state,
            steps: { steps: todo_steps_state },
            notes: { notes: todo_notes_option_state },
            focustime: 0,
            goal_url: generateURL(switch_to_add),
            complete: todo_complete_set_state,
            createdAt: new Date(),
            date_completed: null,
        };

        dispatch(goals(goal));
        dispatch(add_switch_add);

        await goalDB.goals.add(goal);

        clearState();
    };

    const delete_todo = async () => {
        const todo = { todo_url: uid };
        dispatch(todo_delete(todo));

        remove_notification(todo_index);
        dispatch(refresh_list_state);
        dispatch(list_timeout_clear);

        await todoDB.todos
            .filter((todo) => {
                return todo.todo_url === uid;
            })
            .delete()
            .then(() => {
                dispatch(add_switch_add);
            });

        if (back_index === "_list") {
            history.goBack();
        } else {
            history.replace("/");
        }
    };

    const delete_goal = async () => {
        const goal = { goal_url: uid };
        dispatch(goal_delete(goal));

        await goalDB.goals
            .filter((goal) => {
                return goal.goal_url === uid;
            })
            .delete()
            .then(() => {
                dispatch(add_switch_add);
            });

        history.goBack();
    };

    useEffect(() => {
        if (notif_state) {
            dispatch(todos_clear);
            dispatch(home_timeout_clear);
            dispatch(navStateLists);
            dispatch(clear_chart_data);
        }

        return () => {
            if (switch_to_add === "add_" || switch_to_add === "goal_") {
                clearState();
            }
        };
    }, []);

    useEffect(() => {
        return () => {
            if (goal_index) {
                dispatch(clear_completed_goals);
            }
        };
    }, []);

    return (
        <div className="container" style={{ marginBottom: "125px" }}>
            <div
                className="container_top_nav"
                style={{ backgroundColor: darkMode ? mode.dark : mode.light }}
            >
                <span className="back_icon">
                    <img
                        src={darkMode ? back_icon_light : back_icon}
                        alt="Go back"
                        onClick={() => {
                            if (
                                switch_to_add === "add" ||
                                switch_to_add === "add_"
                            ) {
                                if (
                                    back_index === "home" ||
                                    back_index === "/"
                                ) {
                                    history.replace("/");
                                } else {
                                    history.goBack();
                                }
                            } else {
                                history.goBack();
                            }
                        }}
                    />
                </span>
                {switch_to_add === "add_" ? (
                    <span
                        className="title"
                        onClick={() => {
                            if (uid.slice(0, 4) === "add_") {
                                dispatch(add_switch_add_update);
                            } else {
                                dispatch(add_switch_add);
                            }
                        }}
                        style={darkMode ? style.add : style.addDark}
                    >
                        Todo
                    </span>
                ) : switch_to_add === "goal_" ? (
                    <span
                        className="title"
                        onClick={() => {
                            if (uid.slice(0, 5) === "goal_") {
                                dispatch(add_switch_goal_update);
                            } else {
                                dispatch(add_switch_goal);
                            }
                        }}
                        style={darkMode ? style.goal : style.goalDark}
                    >
                        Goal
                    </span>
                ) : (
                    <>
                        <span
                            className="title"
                            onClick={() => {
                                if (uid.slice(0, 4) === "add_") {
                                    dispatch(add_switch_add_update);
                                } else {
                                    dispatch(add_switch_add);
                                }
                            }}
                            style={darkMode ? style.add : style.addDark}
                        >
                            Todo
                        </span>{" "}
                        |{" "}
                        <span
                            className="title"
                            onClick={() => {
                                if (uid.slice(0, 5) === "goal_") {
                                    dispatch(add_switch_goal_update);
                                } else {
                                    dispatch(add_switch_goal);
                                }
                            }}
                            style={darkMode ? style.goal : style.goalDark}
                        >
                            Goal
                        </span>{" "}
                    </>
                )}

                <div id="create_todo">
                    {switch_to_add === "add" || switch_to_add === "add_" ? (
                        <>
                            {todo_desc_state && switch_to_add === "add" ? (
                                <Link to="/" onClick={add_todo}>
                                    Create
                                </Link>
                            ) : (
                                <>
                                    {switch_to_add === "add" ? (
                                        <span style={{ color: "grey" }}>
                                            Create
                                        </span>
                                    ) : (
                                        <span onClick={delete_todo}>
                                            Delete
                                        </span>
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            {switch_to_add === "goal" ? (
                                <>
                                    {todo_desc_state && goal_summary_state ? (
                                        <Link to="/goals" onClick={add_goal}>
                                            Create
                                        </Link>
                                    ) : (
                                        <span style={{ color: "grey" }}>
                                            Create
                                        </span>
                                    )}
                                </>
                            ) : (
                                <>
                                    <span
                                        style={{ color: "#1395ff" }}
                                        onClick={delete_goal}
                                    >
                                        Delete
                                    </span>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="space"></div>

            {switch_to_add === "add" || switch_to_add === "add_" ? (
                <span>
                    <TextBar />
                    <Category />
                    <Tag />
                    <DueDate />
                    <Remind />
                    <Repeat />
                    <Notes />
                </span>
            ) : (
                <span>
                    <TextBar goal={true} />
                    <Summary />
                    <Notes goal={true} />
                </span>
            )}
        </div>
    );
};

export default AddFeed;
