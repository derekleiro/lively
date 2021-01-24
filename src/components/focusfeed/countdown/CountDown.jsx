import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Plugins } from "@capacitor/core";
import { useHistory } from "react-router-dom";
import Dexie from "dexie";
import moment from "moment";
import { Howl } from "howler";
import confetti from "canvas-confetti";

import "./count-down.css";

import celebrate from "../../../assets/icons/done.png";

import Done from "../../done/Done";
import { focus_timeSET } from "../../../actions/focus_feed";
import {
    goal_focus_edit,
    todo_complete,
    goal_complete,
    todo_focus_edit,
    todos,
    completed_goals,
} from "../../../actions/add_feed";

import completed_sound from "../../../assets/sounds/for-sure.webm";

import add_session from "../../../util/session";
import {
    edit_chart_data,
    edit_timer_feed,
    edit_timer_feed_today,
    edit_timer_feed_week,
    most_focused_edit,
} from "../../../actions/timer_feed";
import repeat from "../../../util/repeat";
import tag_ from "../../../util/tag";
import { session_add } from "../../../util/session_add";
import { set_list_complete } from "../../../util/new_default_lists";
import Ambience from "./Ambience";

const sound = new Howl({
    src: [completed_sound],
    html5: true,
    preload: true,
    format: ["webm"],
});

const CountDown = (props) => {
    const { LocalNotifications } = Plugins;

    const dispatch = useDispatch();
    const history = useHistory();

    const phrases = [
        "I am so proud of you ❤. Just wanted to tell you incase no one has",
        "You’ve got nothing to do today but smile. Well done! 🎉🎊",
        "You're capable! remember that! 🎊",
        "It feels good to progress towards your dream! You deserve to treat yourself champ! 🎉🎊",
        "Believe you can, and you are halfway there ❤",
        "Go crazy and celebrate this 🎉. It maybe small, but big leaps are made up of small steps! Well done! 🚀",
        "Sometimes you have to experience what you don't want in life to come to a full understanding of what you do want ❤",
    ];

    const focus_info = useSelector((state) => state.focus_info);
    const timer_feed = useSelector((state) => state.timer_feed);
    const chart_data = useSelector((state) => state.chart_data);
    const home_todos = useSelector((state) => state.todos.todos);
    const goals_state = useSelector((state) => state.goals.goals);

    const [mins, setMins] = useState(0);
    const [secs, setSecs] = useState(0);
    const [hours, setHours] = useState(0);
    const [done, setDone] = useState(false);

    const month = moment(new Date()).format("MMMM");
    const year = moment(new Date()).format("yyyy");

    const today_timestamp = Date.parse(localStorage.getItem("today_timestamp"));
    const week_timestamp = Date.parse(localStorage.getItem("week_timestamp"));
    const month_timestamp = Date.parse(localStorage.getItem("month_timestamp"));
    const data_local = JSON.parse(localStorage.getItem("focus"));

    const style = {
        color: "#1395ff",
        fontFamily: "Poppins, san-serif",
    };

    const goalDB = new Dexie("LivelyGoals");
    goalDB.version(1).stores({
        goals: `goal_url,title,desc,steps,notes,focustime,date_completed,goal_url,complete`,
    });

    const todoDB = new Dexie("LivelyTodos");
    todoDB.version(1).stores({
        todos: `todo_url,desc,dueDate,category,tag,tag_id,steps,focustime,index,date_completed,remindMe,notes,todo_url,complete`,
    });

    const tagDB = new Dexie("LivelyTags");
    tagDB.version(1).stores({
        tags: `id,total_focus,today,week,month`,
    });

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
            return `${hours} hour ${minutes % 60} minutes`;
        }
    };

    const save_session = async () => {
        celebration.wohoo();
        localStorage.setItem("new_focus", true);
        localStorage.setItem("new_focus_week", true);

        if (focus_info.type !== null) {
            if (focus_info.type === "goal") {
                const data = {
                    month,
                    year,
                    createdAt: new Date(),
                    totalFocus: focus_info.time || data_local.time,
                    tasksFocus: 0,
                    goalsFocus: focus_info.time || data_local.time,
                    completedGoals: 0,
                    completedTasks: 0,
                };

                if (goals_state.length !== 0) {
                    dispatch(
                        goal_focus_edit({
                            url: focus_info.url,
                            focustime:
                                focus_info.focustime + focus_info.time ||
                                data_local.time,
                        })
                    );
                }

                add_session(data);
                if (timer_feed.length !== 0) {
                    dispatch(edit_timer_feed(data));
                }

                session_add({
                    tasks: 0,
                    goals: focus_info.time || data_local.time,
                    total: focus_info.time || data_local.time,
                    todos_count: 0,
                    goals_count: 0,
                });

                const data_ = {
                    tasks: 0,
                    goals: 0,
                    totalFocus: focus_info.time || data_local.time,
                    tasksFocus: 0,
                    goalsFocus: focus_info.time || data_local.time,
                };

                dispatch(edit_timer_feed_today(data_));
                dispatch(edit_timer_feed_week(data_));

                await goalDB.goals
                    .filter((goal) => {
                        return goal.goal_url === focus_info.url;
                    })
                    .modify({
                        focustime:
                            focus_info.focustime + focus_info.time ||
                            data_local.time,
                    });
            } else if (focus_info.type === "task") {
                const data = {
                    month,
                    year,
                    createdAt: new Date(),
                    totalFocus: focus_info.time || data_local.time,
                    tasksFocus: focus_info.time || data_local.time,
                    goalsFocus: 0,
                    completedGoals: 0,
                    completedTasks: 0,
                };

                if (home_todos.length !== 0) {
                    dispatch(
                        todo_focus_edit({
                            url: focus_info.url,
                            focustime:
                                focus_info.focustime + focus_info.time ||
                                data_local.time,
                        })
                    );
                }

                add_session(data);
                if (timer_feed.length !== 0) {
                    dispatch(edit_timer_feed(data));
                }

                session_add({
                    tasks: focus_info.time || data_local.time,
                    goals: 0,
                    total: focus_info.time || data_local.time,
                    todos_count: 0,
                    goals_count: 0,
                });

                if (focus_info.tag) {
                    if (chart_data.today !== null && chart_data.week !== null) {
                        dispatch(
                            edit_chart_data({
                                id: focus_info.tag_id,
                                focustime: focus_info.time || data_local.time,
                            })
                        );

                        dispatch(
                            most_focused_edit({
                                id: focus_info.tag_id,
                                focustime: focus_info.time || data_local.time,
                                data: chart_data,
                            })
                        );
                    }

                    const time = {
                        today: today_timestamp,
                        week: week_timestamp,
                        month: month_timestamp,
                    };

                    const data_ = {
                        id: focus_info.tag_id,
                        total_focus: focus_info.time || data_local.time,
                        name: focus_info.tag,
                        today: {
                            focused: focus_info.time || data_local.time,
                        },
                        week: {
                            focused: focus_info.time || data_local.time,
                        },
                        month: {
                            focused: focus_info.time || data_local.time,
                        },
                    };

                    tag_(data_, time);
                }

                const data_2 = {
                    tasks: 0,
                    goals: 0,
                    totalFocus: focus_info.time || data_local.time,
                    tasksFocus: focus_info.time || data_local.time,
                    goalsFocus: 0,
                };

                dispatch(edit_timer_feed_today(data_2));
                dispatch(edit_timer_feed_week(data_2));

                await todoDB.todos
                    .filter((todo) => {
                        return todo.todo_url === focus_info.url;
                    })
                    .modify((todo) => {
                        todo.focustime =
                            focus_info.focustime + focus_info.time ||
                            data_local.time;
                    });
            }
        } else {
            const data = {
                month,
                year,
                createdAt: new Date(),
                totalFocus: focus_info.time || data_local.time,
                tasksFocus: 0,
                goalsFocus: 0,
                completedGoals: 0,
                completedTasks: 0,
            };

            add_session(data);
            if (timer_feed.length !== 0) {
                dispatch(edit_timer_feed(data));
            }

            session_add({
                tasks: 0,
                goals: 0,
                total: focus_info.time || data_local.time,
                todos_count: 0,
                goals_count: 0,
            });

            const data_ = {
                tasks: 0,
                goals: 0,
                totalFocus: focus_info.time || data_local.time,
                tasksFocus: 0,
                goalsFocus: 0,
            };

            dispatch(edit_timer_feed_today(data_));
            dispatch(edit_timer_feed_week(data_));
        }
    };

    const startTimer = async () => {
        if (focus_info.event_time) {
            var eventTime = moment(focus_info.event_time).toDate();
            var interval = 1000;

            await LocalNotifications.schedule({
                notifications: [
                    {
                        title: "Keep it going! 🎉🎊",
                        body: `You have successfully focused for ${readableTime(
                            focus_info.time || data_local.time
                        )} ${
                            focus_info.type !== null
                                ? `on your ${focus_info.type}`
                                : ""
                        }`,
                        id: 111222333,
                        schedule: { at: focus_info.event_time },
                        sound: null,
                        attachments: null,
                        actionTypeId: "",
                        extra: null,
                    },
                ],
            });

            const timer_interval = setInterval(() => {
                const duration = moment.duration(
                    eventTime - moment(new Date()).toDate() - interval
                );
                setHours(duration.hours());
                setMins(duration.minutes());
                setSecs(duration.seconds());

                if (
                    duration.hours() <= 0 &&
                    duration.minutes() <= 0 &&
                    duration.seconds() <= 0
                ) {
                    sound.play();
                    props.handleTimeSet();
                    setDone(true);
                    save_session();
                    clearInterval(timer_interval);
                }
            }, interval);
        }
    };

    const terminate_countdown = async () => {
        const nots = await LocalNotifications.getPending();
        await LocalNotifications.cancel({
            notifications: nots.notifications.filter(
                (not) => not.id === "111222333"
            ),
        });
    };

    useEffect(() => {
        let unmounted = false;

        if (!unmounted) {
            startTimer();
        }

        return () => {
            terminate_countdown();
            unmounted = true;
        };
    }, []);

    const go = {
        back: () => {
            if (focus_info) {
                if (focus_info.type) {
                    if (focus_info.type === "task") {
                        history.replace("/");
                    } else if (focus_info.type === "goal") {
                        history.replace("/goals");
                    }
                } else {
                    history.replace("/timer");
                }
            } else {
                history.replace("/timer");
            }
        },
    };

    const mark_as_done = async () => {
        if (focus_info) {
            if (focus_info.type === "goal") {
                const data = {
                    month,
                    year,
                    createdAt: new Date(),
                    totalFocus: 0,
                    tasksFocus: 0,
                    goalsFocus: 0,
                    completedGoals: 1,
                    completedTasks: 0,
                };

                if (goals_state.length !== 0) {
                    dispatch(
                        goal_complete({
                            goal_url: focus_info.url,
                            complete: 1,
                        })
                    );
                }

                add_session(data);
                if (timer_feed.length !== 0) {
                    dispatch(edit_timer_feed(data));
                }

                session_add({
                    tasks: 0,
                    goals: 0,
                    total: 0,
                    todos_count: 0,
                    goals_count: 1,
                });

                const data_ = {
                    tasks: 0,
                    goals: 1,
                    totalFocus: 0,
                    tasksFocus: 0,
                    goalsFocus: 0,
                };

                dispatch(edit_timer_feed_today(data_));
                dispatch(edit_timer_feed_week(data_));

                await goalDB.goals
                    .filter((goal) => {
                        return goal.goal_url === focus_info.url;
                    })
                    .modify((goal) => {
                        goal.complete = 1;
                        goal.date_completed = new Date();

                        dispatch(
                            completed_goals({
                                title: goal.title,
                                desc: goal.desc,
                                steps: goal.steps,
                                notes: goal.notes,
                                focustime: goal.focustime,
                                goal_url: goal.goal_url,
                                complete: 1,
                                date_completed: new Date(),
                            })
                        );
                    });

                history.replace("/congrats");
            } else {
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

                set_list_complete();

                if (home_todos.length !== 0) {
                    dispatch(
                        todo_complete({
                            todo_url: focus_info.url,
                            complete: 1,
                        })
                    );
                }

                add_session(data);
                if (timer_feed.length !== 0) {
                    dispatch(edit_timer_feed(data));
                }

                session_add({
                    tasks: 0,
                    goals: 0,
                    total: 0,
                    todos_count: 1,
                    goals_count: 0,
                });

                const data_ = {
                    tasks: 1,
                    goals: 0,
                    totalFocus: 0,
                    tasksFocus: 0,
                    goalsFocus: 0,
                };

                dispatch(edit_timer_feed_today(data_));
                dispatch(edit_timer_feed_week(data_));

                await todoDB.todos
                    .filter((todo) => {
                        return todo.todo_url === focus_info.url;
                    })
                    .modify((todo) => {
                        todo.complete = 1;
                        todo.date_completed = new Date();

                        repeat({
                            repeat: todo.repeat,
                            todo_url: todo.todo_url,
                            tag: todo.tag,
                            tag_id: todo.tag_id,
                            date_completed: todo.date_completed,
                            index: todo.index,
                            desc: todo.desc,
                            dueDate: todo.dueDate,
                            category: todo.category,
                            steps: { steps: todo.steps.steps },
                            focustime: todo.focustime,
                            remindMe: todo.remindMe,
                            notes: { notes: todo.notes.notes },
                            complete: todo.complete,
                            important: todo.important,
                        }).then((data) => {
                            if (data) {
                                dispatch(todos(data));
                            }
                        });
                    });
                go.back();
            }
        }
    };

    return (
        <div className="count_down" style={{ marginTop: "25px" }}>
            {done ? (
                <Done load={true}>
                    <div className="done_options">
                        <img src={celebrate} alt="You are free" />
                        <div className="done_text">
                            {
                                phrases[
                                    Math.floor(Math.random() * phrases.length)
                                ]
                            }
                        </div>
                        {focus_info ? (
                            <>
                                {focus_info.type !== null ? (
                                    <>
                                        <div
                                            className="done_text"
                                            style={{ marginTop: "30px" }}
                                        >
                                            Mark {focus_info.type} as done?
                                        </div>
                                        <span
                                            className="action_button"
                                            style={{
                                                margin: "0 30px",
                                                color: "#1395ff",
                                            }}
                                            onClick={mark_as_done}
                                        >
                                            Yes
                                        </span>
                                        <span
                                            className="action_button"
                                            style={{
                                                margin: "0 30px",
                                                color: "#1395ff",
                                            }}
                                            onClick={go.back}
                                        >
                                            No
                                        </span>
                                    </>
                                ) : null}
                            </>
                        ) : null}
                    </div>
                </Done>
            ) : (
                <span style={{ overflow: "auto" }}>
                    {focus_info.type === null ? (
                        <div className="done_text">
                            Either you run the day, or the day runs you. -Jim
                            Rohn
                        </div>
                    ) : null}

                    {hours ? (
                        <>
                            <span className="title" style={style}>
                                {hours}
                            </span>
                            <span className="title" style={style}>
                                {" "}
                                :{" "}
                            </span>
                        </>
                    ) : null}
                    <span className="title" style={style}>
                        {mins ? (
                            <>
                                <span className="title" style={style}>
                                    {mins < 10 ? `0` + mins : mins}
                                </span>
                                <span className="title" style={style}>
                                    {" "}
                                    :{" "}
                                </span>
                            </>
                        ) : (
                            <>
                                {focus_info.time || data_local.time > 3600 ? (
                                    <>
                                        <span className="title" style={style}>
                                            00
                                        </span>
                                        <span className="title" style={style}>
                                            {" "}
                                            :{" "}
                                        </span>
                                    </>
                                ) : null}
                            </>
                        )}
                    </span>
                    <span className="title" style={style}>
                        {secs < 10 ? `0` + secs : secs}
                    </span>

                    <Ambience />
                </span>
            )}
        </div>
    );
};

export default CountDown;
