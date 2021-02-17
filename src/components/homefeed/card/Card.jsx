import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import { Plugins } from "@capacitor/core";
import Dexie from "dexie";
import { Howl } from "howler";
import confetti from "canvas-confetti";

import "./card.css";

import star from "../../../assets/icons/star.png";
import star_active from "../../../assets/icons/star_active.png";
import star_light from "../../../assets/icons/star_light.png";
import todo_incomplete from "../../../assets/icons/todo_incomplete.png";
import todo_incomplete_light from "../../../assets/icons/todo_incomplete_light.png";
import todo_complete_icon from "../../../assets/icons/todo_complete.png";

import checked_icon from "../../../assets/icons/edit_complete.png";
import checked_light from "../../../assets/icons/edit_complete_light.png";

import repeat_icon from "../../../assets/icons/repeat.png";
import repeat_light from "../../../assets/icons/repeat_light.png";
import remind from "../../../assets/icons/remind.png";
import remind_light from "../../../assets/icons/remind_light.png";
import list_icon from "../../../assets/icons/lists.png";
import list_light from "../../../assets/icons/lists_light.png";
import tag_icon from "../../../assets/icons/tag.png";
import tag_light from "../../../assets/icons/tag_light.png";
import due_icon from "../../../assets/icons/due.png";
import due_light from "../../../assets/icons/due_light.png";

import {
    todo_desc,
    todo_list_selected,
    todo_due_date,
    todo_remind_timestamp,
    todo_repeat_option,
    todo_complete,
    todo_complete_set,
    todo_important_set,
    textarea_state,
    handle_focustime,
    dispatch_todo_steps,
    dispatch_todo_notes,
    important_todo_set,
    add_switch_add_update,
    handle_url,
    todos,
    todo_index,
    todos_clear,
    back_index,
    todo_tag_selected,
} from "../../../actions/add_feed";
import { focus_info } from "../../../actions/focus_feed";

import completed_sound from "../../../assets/sounds/for-sure.webm";
import add_session from "../../../util/session";
import repeat from "../../../util/repeat";
import {
    list_task_complete,
    refresh_list_state,
    list_task_important,
    append_list_tasks,
} from "../../../actions/list_feed";
import {
    edit_timer_feed,
    edit_timer_feed_today,
    edit_timer_feed_week,
    reset_timer_feed,
} from "../../../actions/timer_feed";
import {
    remove_notification,
    schedule_notification,
} from "../../../util/notifications";
import { navStateHome } from "../../../actions/bottom_nav";
import {
    list_timeout_clear,
    task_complete_timeout,
    task_complete_timeout_reset,
    important_complete_timeout,
    important_complete_timeout_reset,
} from "../../../actions/timeouts";
import { session_add } from "../../../util/session_add";
import {
    set_list_complete,
    set_list_important,
} from "../../../util/new_default_lists";
import { encouragements } from "../../../constants/encouragements";

const sound = new Howl({
    src: [completed_sound],
    html5: true,
    preload: true,
    format: ["webm"],
});

const Card = (props) => {
    const { Toast } = Plugins;

    const celebration = {
        wohoo: () => {
            var count = 100;
            var defaults = {
                origin: { y: 0.7 },
            };

            const fire = (particleRatio, opts) => {
                confetti(
                    Object.assign({}, defaults, opts, {
                        particleCount: Math.floor(count * particleRatio),
                    })
                );
            };

            fire(0.25, {
                spread: 26,
                startVelocity: 55,
            });
            fire(0.2, {
                spread: 60,
            });
            fire(0.35, {
                spread: 100,
                decay: 0.91,
                scalar: 0.8,
            });
            fire(0.1, {
                spread: 120,
                startVelocity: 25,
                decay: 0.92,
                scalar: 1.2,
            });
            fire(0.1, {
                spread: 120,
                startVelocity: 45,
            });
        },
    };

    const dispatch = useDispatch();

    const setTime = (timestamp) => {
        if (moment(timestamp).calendar().includes("Today")) {
            return "Today";
        } else if (moment(timestamp).calendar().includes("Tomorrow")) {
            return "Tomorrow";
        } else if (moment(timestamp).calendar().includes("Yesterday")) {
            return "Yesterday";
        } else {
            return moment(timestamp).format("ddd MMM Do YYYY");
        }
    };

    const setTimeRemind = (timestamp) => {
        if (moment(timestamp).calendar().includes("Yesterday")) {
            return `Yesterday, ${moment(timestamp).format("LT")}`;
        } else if (moment(timestamp).calendar().includes("Today")) {
            return `Today, ${moment(timestamp).format("LT")}`;
        } else if (moment(timestamp).calendar().includes("Tomorrow")) {
            return `Tomorrow, ${moment(timestamp).format("LT")}`;
        } else {
            return `${moment(timestamp).format("ddd MMM Do YYYY")}, ${moment(
                timestamp
            ).format("LT")}`;
        }
    };

    const month = moment(new Date()).format("MMMM");
    const year = moment(new Date()).format("yyyy");

    const darkMode = useSelector((state) => state.dark_mode);
    const timer_feed = useSelector((state) => state.timer_feed);

    const task_complete = useSelector((state) => state.task_complete);
    const important_complete = useSelector((state) => state.important_complete);

    const [checked, setChecked] = useState(
        props.listView
            ? props.complete
            : setTime(props.dueDate) === "Today"
            ? props.complete
            : 0
    );
    const [starred, setStarred] = useState(props.important);

    const stepsDone = props.steps.filter((step) => step.complete === 1).length;

    const db = new Dexie("LivelyTodos");
    db.version(1).stores({
        todos: `todo_url,desc,dueDate,category,tag,tag_id,steps,focustime,index,date_completed,remindMe,notes,todo_url,complete`,
    });

    const readableTime = (time) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor(time / 60);

        if (minutes === 1) {
            return `${minutes} minute`;
        } else if (minutes < 1) {
            return `Less than a minute`;
        } else if (minutes < 60 && minutes > 1) {
            return `${minutes} minutes`;
        } else if (time % 3600 === 0) {
            if (time > 3600) {
                return `${hours} hours`;
            } else if (time === 3600) {
                return `${hours} hour`;
            }
        } else if (minutes > 60 && minutes < 120) {
            return `${hours} hours ${minutes % 60} minutes`;
        } else{
            return `${hours} hours ${minutes % 60 !== 0 ? ` ${minutes % 60} minutes` : ``}`;
        }
    };

    const handleCompletedClick = async () => {
        dispatch(task_complete_timeout);
        dispatch(refresh_list_state);
        dispatch(list_timeout_clear);
        dispatch(navStateHome);

        if (props.listView) {
            dispatch(navStateHome);
            dispatch(todos_clear);
        }

        if (checked) {
            if (props.listView) {
                setChecked(false);
            } else {
                if (setTime(props.dueDate) === "Today") {
                    setChecked(false);
                }
            }

            const todo = {
                todo_url: props.URL,
                complete: 0,
                dueDate: props.dueDate,
            };

            const data = {
                month,
                year,
                createdAt: new Date(),
                totalFocus: 0,
                tasksFocus: 0,
                goalsFocus: 0,
                completedGoals: 0,
                completedTasks: -1,
            };

            add_session(data);

            session_add({
                tasks: 0,
                goals: 0,
                total: 0,
                todos_count: -1,
                goals_count: 0,
            });

            if (timer_feed.length !== 0) {
                const exists = timer_feed.filter(
                    (time) => time.month === month && time.year === year
                );

                if (exists.length !== 0) {
                    dispatch(edit_timer_feed(data));
                } else {
                    dispatch(reset_timer_feed);
                }
            }

            const data_ = {
                tasks: -1,
                goals: 0,
                totalFocus: 0,
                tasksFocus: 0,
                goalsFocus: 0,
            };

            dispatch(edit_timer_feed_today(data_));
            dispatch(edit_timer_feed_week(data_));

            await db.todos
                .filter((todo) => {
                    return todo.todo_url === props.URL;
                })
                .modify({ complete: 0, date_completed: null });

            if (props.listView) {
                dispatch(list_task_complete(todo));
            } else {
                dispatch(todo_complete(todo));
            }

            if (props.remindMe) {
                schedule_notification(
                    props.remindMe.timestamp,
                    props.cardDesc,
                    props.index,
                    {
                        text: props.cardDesc,
                        focustime: props.focustime ? props.focustime : 0,
                        url: props.URL,
                        type: "task",
                        steps: props.steps,
                        tag: props.tag,
                        tag_id: props.tag_id,
                    }
                );
            }
        } else {
            const todo = {
                todo_url: props.URL,
                complete: 1,
                dueDate: props.dueDate,
            };

            const data = {
                month,
                year,
                createdAt: new Date(),
                totalFocus: 0,
                tasksFocus: 0,
                goalsFocus: 0,
                completedGoals: 0,
                completedTasks: 1,
            };

            repeat({
                repeat: props.repeat,
                todo_url: props.URL,
                desc: props.cardDesc,
                dueDate: props.dueDate,
                date_completed: props.date_completed,
                category: props.category,
                tag: props.tag,
                tag_id: props.tag_id,
                steps: { steps: props.steps },
                focustime: props.focustime,
                index: props.index,
                remindMe: props.remindMe,
                notes: { notes: props.notes },
                complete: props.complete,
                important: props.important,
            }).then((data) => {
                if (data) {
                    if (props.listView) {
                        const dispatch_timeout = setTimeout(() => {
                            dispatch(append_list_tasks(data));
                            clearTimeout(dispatch_timeout);
                        }, 500);
                    } else {
                        const dispatch_timeout = setTimeout(() => {
                            dispatch(todos(data));
                            clearTimeout(dispatch_timeout);
                        }, 500);
                    }
                }
            });

            if (props.listView) {
                setChecked(true);
            } else {
                if (setTime(props.dueDate) === "Today") {
                    setChecked(true);
                } else {
                    setChecked(false);
                }
            }

            add_session(data);

            session_add({
                tasks: 0,
                goals: 0,
                total: 0,
                todos_count: 1,
                goals_count: 0,
            });

            set_list_complete();
            if (timer_feed.length !== 0) {
                const exists = timer_feed.filter(
                    (time) => time.month === month && time.year === year
                );
                if (exists.length !== 0) {
                    dispatch(edit_timer_feed(data));
                } else {
                    dispatch(reset_timer_feed);
                }
            }

            const data_ = {
                tasks: 1,
                goals: 0,
                totalFocus: 0,
                tasksFocus: 0,
                goalsFocus: 0,
            };

            dispatch(edit_timer_feed_today(data_));
            dispatch(edit_timer_feed_week(data_));

            await db.todos
                .filter((todo) => {
                    return todo.todo_url === props.URL;
                })
                .modify({ complete: 1, date_completed: new Date() });

            if (props.listView) {
                dispatch(list_task_complete(todo));
            } else {
                dispatch(todo_complete(todo));
            }

            remove_notification(props.index);

            sound.play();
            celebration.wohoo();

            await Toast.show({
                text:
                    encouragements[
                        Math.floor(Math.random() * encouragements.length)
                    ],
                duration: "short",
                position: "bottom",
            });
        }

        const complete_timeout = setTimeout(() => {
            dispatch(task_complete_timeout_reset);
            clearTimeout(complete_timeout);
        }, 800);
    };

    const handleImportantTaskClick = async () => {
        dispatch(important_complete_timeout);
        dispatch(refresh_list_state);
        dispatch(list_timeout_clear);
        dispatch(navStateHome);

        if (starred) {
            const todo = {
                todo_url: props.URL,
                important: 0,
            };

            if (props.listView) {
                dispatch(list_task_important(todo));
            } else {
                dispatch(important_todo_set(todo));
            }

            set_list_important();

            await db.todos
                .filter((todo) => {
                    return todo.todo_url === props.URL;
                })
                .modify({ important: 0 });

            setStarred(false);
        } else {
            const todo = {
                todo_url: props.URL,
                important: 1,
            };

            if (props.listView) {
                dispatch(list_task_important(todo));
            } else {
                dispatch(important_todo_set(todo));
            }

            set_list_important();

            await db.todos
                .filter((todo) => {
                    return todo.todo_url === props.URL;
                })
                .modify({ important: 1 });

            setStarred(true);
        }

        const important_timeout = setTimeout(() => {
            dispatch(important_complete_timeout_reset);
            clearTimeout(important_timeout);
        }, 800);
    };

    const dispatchTaskDetails = () => {
        dispatch(add_switch_add_update);
        dispatch(todo_desc(props.cardDesc));
        dispatch(todo_due_date(props.dueDate));
        dispatch(todo_list_selected(props.category));
        dispatch(todo_tag_selected({ tag: props.tag, id: props.tag_id }));
        dispatch(dispatch_todo_steps(props.steps));
        dispatch(todo_remind_timestamp(props.remindMe));
        dispatch(dispatch_todo_notes(props.notes));
        dispatch(todo_repeat_option(props.repeat));
        dispatch(todo_complete_set(checked));
        dispatch(todo_important_set(starred));
        dispatch(textarea_state(true));
        dispatch(handle_focustime(props.focustime));
        dispatch(handle_url(props.URL));
        dispatch(todo_index(props.index));
        dispatch(back_index(props.listView ? "_list" : "home"));
    };

    const dispatchFocusDetails = () => {
        dispatch(
            focus_info({
                text: props.cardDesc,
                focustime: props.focustime ? props.focustime : 0,
                url: props.URL,
                type: "task",
                steps: props.steps,
                tag: props.tag,
                tag_id: props.tag_id,
            })
        );
    };

    return (
        <div
            className="card"
            style={{ margin: props.listView ? "15px 0" : "35px 0" }}
        >
            <div className="card-completed">
                <img
                    onClick={task_complete ? null : handleCompletedClick}
                    src={
                        checked
                            ? todo_complete_icon
                            : darkMode
                            ? todo_incomplete_light
                            : todo_incomplete
                    }
                    alt="complete"
                    style={{ width: "22.5px", height: "22.5px" }}
                />
            </div>
            <div className="card-content">
                <Link to={props.URL} onClick={dispatchTaskDetails}>
                    <div
                        className="card-desc"
                        style={{
                            textDecoration: checked ? "line-through" : "none",
                            color: darkMode ? "white" : "black",
                        }}
                    >
                        {props.cardDesc}
                    </div>

                    <div className="card-due-date">
                        {(setTime(props.dueDate) === "Yesterday" &&
                            !props.listView) ||
                        (setTime(props.dueDate) === "Today" &&
                            !props.listView) ||
                        (setTime(props.dueDate) === "Tomorrow" &&
                            !props.listView) ||
                        props.remindMe ? null : (
                            <span className="card-due-section">
                                <img
                                    className="card-info-img"
                                    src={darkMode ? due_light : due_icon}
                                    alt={`Due ${setTime(props.dueDate)}`}
                                />
                                {setTime(props.dueDate)}
                            </span>
                        )}

                        {props.remindMe ? (
                            <span className="card-due-section">
                                <img
                                    className="card-info-img"
                                    src={darkMode ? remind_light : remind}
                                    alt={`Due By ${setTimeRemind(
                                        props.remindMe.timestamp
                                    )}`}
                                />
                                {setTimeRemind(props.remindMe.timestamp)}
                            </span>
                        ) : null}

                        {props.category ? (
                            <span className="card-due-section">
                                <span>
                                    <img
                                        className="card-info-img"
                                        src={darkMode ? list_light : list_icon}
                                        alt={`In the list ${props.category}`}
                                    />
                                    {props.category}
                                </span>
                            </span>
                        ) : null}

                        {props.tag ? (
                            <span className="card-due-section">
                                <span>
                                    <img
                                        className="card-info-img"
                                        src={darkMode ? tag_light : tag_icon}
                                        alt={`Has the tag "${props.tag}"`}
                                    />
                                    {props.tag}
                                </span>
                            </span>
                        ) : null}

                        {props.repeat !== "Never" ? (
                            <span className="card-due-section">
                                <img
                                    className="card-info-img"
                                    src={darkMode ? repeat_light : repeat_icon}
                                    alt={`Task repeats ${props.repeat}`}
                                />
                                {props.repeat}
                            </span>
                        ) : null}
                    </div>
                </Link>
                <div
                    className="card-desc"
                    style={{
                        color: "grey",
                        marginTop: "15px",
                        lineHeight: "1.8em",
                    }}
                >
                    {checked ? null : (
                        <span>
                            <Link
                                to={`/focus_${props.URL}`}
                                onClick={dispatchFocusDetails}
                            >
                                <span className="start_focus">
                                    Start focus
                                    <img
                                        src={
                                            darkMode
                                                ? checked_light
                                                : checked_icon
                                        }
                                        alt="Start focus"
                                    />
                                </span>
                            </Link>

                            {props.steps.length !== 0 ||
                            props.notes.length !== 0 ||
                            props.focustime ? (
                                <span
                                    style={{ margin: `0 5px` }}
                                    dangerouslySetInnerHTML={{
                                        __html: `&#8226;`,
                                    }}
                                ></span>
                            ) : null}
                        </span>
                    )}

                    {props.focustime ? (
                        <>Focused : {readableTime(props.focustime)}</>
                    ) : null}

                    {props.steps.length !== 0 ? (
                        <>
                            {props.focustime ? (
                                <span
                                    style={{ margin: `0 5px` }}
                                    dangerouslySetInnerHTML={{
                                        __html: `&#8226;`,
                                    }}
                                ></span>
                            ) : null}
                            {stepsDone} of {props.steps.length} steps
                        </>
                    ) : null}

                    {props.notes.length !== 0 ? (
                        <>
                            {props.steps.length !== 0 || props.focustime ? (
                                <span
                                    style={{ margin: `0 5px` }}
                                    dangerouslySetInnerHTML={{
                                        __html: `&#8226;`,
                                    }}
                                ></span>
                            ) : null}
                            {props.notes.length}{" "}
                            {props.notes.length > 1 ? "Notes" : "Note"}
                        </>
                    ) : null}
                </div>
            </div>
            <div className="card-star">
                <img
                    src={starred ? star_active : darkMode ? star_light : star}
                    onClick={
                        important_complete ? null : handleImportantTaskClick
                    }
                    alt="Important task"
                ></img>
            </div>
        </div>
    );
};

export default Card;
