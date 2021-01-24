import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Dexie from "dexie";
import { Howl } from "howler";
import moment from "moment";

import "./goal.css";

import checked_icon from "../../../assets/icons/edit_complete.png";
import checked_light from "../../../assets/icons/edit_complete_light.png";
import todo_incomplete from "../../../assets/icons/todo_incomplete.png";
import todo_incomplete_light from "../../../assets/icons/todo_incomplete_light.png";
import todo_complete_icon from "../../../assets/icons/todo_complete.png";
import {
    todo_desc,
    goal_summary,
    goal_complete,
    textarea_state,
    completed_goals,
    handle_focustime,
    dispatch_todo_steps,
    dispatch_todo_notes,
    add_switch_goal_update,
    handle_url,
    goals,
    remove_goal_complete,
    goal_index_completed,
    goal_index_home,
} from "../../../actions/add_feed";
import { focus_info } from "../../../actions/focus_feed";

import completed_sound from "../../../assets/sounds/for-sure.webm";
import add_session from "../../../util/session";
import {
    edit_timer_feed,
    edit_timer_feed_today,
    edit_timer_feed_week,
} from "../../../actions/timer_feed";
import {
    goal_complete_timeout,
    goal_complete_timeout_reset,
} from "../../../actions/timeouts";
import { session_add } from "../../../util/session_add";

const sound = new Howl({
    src: [completed_sound],
    html5: true,
    preload: true,
    format: ["webm"],
});

const Goal = (props) => {
    const dispatch = useDispatch();
    const darkMode = useSelector((state) => state.dark_mode);
    const timer_feed = useSelector((state) => state.timer_feed);
    const goal_complete_state = useSelector((state) => state.goal_complete);

    const checked = props.complete;
    const stepsDone = props.steps.filter((step) => step.complete === 1).length;

    const month = moment(new Date()).format("MMMM");
    const year = moment(new Date()).format("yyyy");

    const style = {
        color: "grey",
        marginTop: "10px",
        lineHeight: "normal",
    };

    const db = new Dexie("LivelyGoals");
    db.version(1).stores({
        goals: `goal_url,title,desc,steps,notes,focustime,date_completed,goal_url,complete`,
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
            return `${hours} hour ${minutes % 60} minutes`;
        }
    };

    const handleCompletedClick = async () => {
        dispatch(goal_complete_timeout);
        if (checked) {
            const goal = {
                goal_url: props.URL,
                complete: 0,
            };

            if (props.completedView) {
                dispatch(
                    goals({ ...props.goal, complete: 0, date_completed: null })
                );
                dispatch(remove_goal_complete(goal));
            } else {
                dispatch(goal_complete(goal));
            }

            await db.goals
                .filter((goal) => {
                    return goal.goal_url === props.URL;
                })
                .modify({ complete: 0, date_completed: null });

            const data = {
                month,
                year,
                createdAt: new Date(),
                totalFocus: 0,
                tasksFocus: 0,
                goalsFocus: 0,
                completedGoals: -1,
                completedTasks: 0,
            };

            add_session(data);
            if (timer_feed.length !== 0) {
                dispatch(edit_timer_feed(data));
            }

            session_add({
                tasks: 0,
                goals: 0,
                total: 0,
                todos_count: 0,
                goals_count: -1,
            });

            const data_ = {
                tasks: 0,
                goals: -1,
                totalFocus: 0,
                tasksFocus: 0,
                goalsFocus: 0,
            };

            dispatch(edit_timer_feed_today(data_));
            dispatch(edit_timer_feed_week(data_));
        } else {
            const goal = {
                goal_url: props.URL,
                complete: 1,
            };

            dispatch(goal_complete(goal));

            dispatch(
                completed_goals({
                    title: props.goal_title,
                    desc: props.goal_desc,
                    steps: { steps: props.steps },
                    notes: { notes: props.notes },
                    focustime: props.focustime,
                    goal_url: props.URL,
                    complete: 1,
                    date_completed: new Date(),
                })
            );

            sound.play();

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

            await db.goals
                .filter((goal) => {
                    return goal.goal_url === props.URL;
                })
                .modify({ complete: 1, date_completed: new Date() });
        }

        const goal_timeout = setTimeout(() => {
            dispatch(goal_complete_timeout_reset);
            clearTimeout(goal_timeout);
        }, 800);
    };

    const dispatchGoalDetails = () => {
        dispatch(add_switch_goal_update);
        dispatch(todo_desc(props.goal_title));
        dispatch(goal_summary(props.goal_desc));
        dispatch(dispatch_todo_steps(props.steps));
        dispatch(dispatch_todo_notes(props.notes));
        dispatch(textarea_state(true));
        dispatch(handle_focustime(props.focustime ? props.focustime : 0));
        dispatch(handle_url(props.URL));
        if (props.completedView) {
            dispatch(goal_index_completed);
        } else {
            dispatch(goal_index_home);
        }
    };

    const dispatchFocusDetails = () => {
        dispatch(
            focus_info({
                text: props.goal_title,
                focustime: props.focustime,
                url: props.URL,
                type: "goal",
                extra: props.goal_desc,
                steps: props.steps,
            })
        );
    };

    return (
        <div
            className="card"
            style={{ margin: props.completedView ? "12.5px 0" : "35px 0" }}
        >
            <div className="card-completed">
                <span
                    onClick={goal_complete_state ? null : handleCompletedClick}
                >
                    {checked ? (
                        <img
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
                    ) : (
                        <Link to="/congrats">
                            <img
                                src={
                                    checked
                                        ? todo_complete_icon
                                        : darkMode
                                        ? todo_incomplete_light
                                        : todo_incomplete
                                }
                                alt="completed"
                                style={{ width: "22.5px", height: "22.5px" }}
                            />
                        </Link>
                    )}
                </span>
            </div>
            <div className="card-content">
                <Link to={props.URL} onClick={dispatchGoalDetails}>
                    <div
                        className="card-desc"
                        style={{
                            textDecoration: checked ? "line-through" : "none",
                            color: darkMode ? "white" : "black",
                        }}
                    >
                        {props.goal_title}
                    </div>
                    <div className="card-due-date" style={style}>
                        {props.goal_desc}
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

                            {props.notes.length !== 0 || props.focustime ? (
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
                        <>{readableTime(props.focustime)}</>
                    ) : null}

                    {props.steps.length !== 0 ? (
                        <>
                            {props.focustime !== 0 ? (
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
                            {props.notes.length > 1
                                ? `${props.notes.length} Notes`
                                : `${props.notes.length} Note`}
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default Goal;
