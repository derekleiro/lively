import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import DayPicker from "react-day-picker";
import moment from "moment";
import Dexie from "dexie";

import "./remind.css";
import "../duedate/date-picker.css";

import remind from "../../../assets/icons/remind.png";
import remind_light from "../../../assets/icons/remind_light.png";
import tip_icon from "../../../assets/icons/tip.png";

import { mode } from "../../../constants/color";
import {
    todo_edit,
    todo_remind_timestamp,
    todo_remove_reminder,
} from "../../../actions/add_feed";
import {
    remove_notification,
    schedule_notification,
} from "../../../util/notifications";
import Done from "../../done/Done";
import { reset_battery_opt } from "../../../actions/home_feed";

const Remind = () => {
    const dispatch = useDispatch();
    const darkMode = useSelector((state) => state.dark_mode);
    const todo_remind_timestamp_state = useSelector(
        (state) => state.todo_remind_timestamp
    );
    const url = useSelector((state) => state.url);
    const home_todos = useSelector((state) => state.todos.todos);
    const back_index = useSelector((state) => state.back_index);
    const todo_index = useSelector((state) => state.todo_index);
    const switch_to_add = useSelector((state) => state.addfeed_switch);
    const desc = useSelector((state) => state.todo_desc);
    const battery_opt = useSelector((state) => state.battery_opt);

    const notif_warn = JSON.parse(localStorage.getItem("notif_warning"));

    const todoDB = new Dexie("LivelyTodos");
    todoDB.version(1).stores({
        todos: `todo_url,desc,dueDate,category,tag,tag_id,steps,focustime,index,date_completed,remindMe,notes,todo_url,complete`,
    });

    const setTime = (timestamp) => {
        if (moment(timestamp).calendar().includes("Yesterday")) {
            return "Yesterday";
        } else if (moment(timestamp).calendar().includes("Today")) {
            return "Today";
        } else if (moment(timestamp).calendar().includes("Tomorrow")) {
            return "Tomorrow";
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

    const [prompt, setPrompt] = useState(false);
    const [selected, setSelected] = useState(
        todo_remind_timestamp_state
            ? setTimeRemind(todo_remind_timestamp_state.timestamp)
            : "Select a time"
    );
    const [selecting, setSelecting] = useState(false);
    const [selectHour, setSelectHour] = useState(
        todo_remind_timestamp_state ? todo_remind_timestamp_state.hour : "1"
    );
    const [selectMin, setSelectMin] = useState(
        todo_remind_timestamp_state ? todo_remind_timestamp_state.min : "00"
    );
    const [selectAMPM, setSelectAMPM] = useState(
        todo_remind_timestamp_state ? todo_remind_timestamp_state.ampm : "AM"
    );
    const [selectedDate, setSelectedDate] = useState(
        todo_remind_timestamp_state
            ? todo_remind_timestamp_state.selectedDate
            : null
    );

    const style = {
        style1: {
            color: darkMode ? "white" : "black",
            border: darkMode ? "solid 1px  #1A1A1A" : "solid 1px #f0f0f0",
            background: darkMode ? mode.dark : mode.light,
            padding: "7.5px 7.5px 7.5px 15px",
            WebkitTapHighlightColor: "transparent",
            height: "35px",
        },
        style2: {
            color: darkMode ? "white" : "black",
            border: darkMode ? "solid 1px  #1A1A1A" : "solid 1px #f0f0f0",
            background: darkMode ? mode.dark : mode.light,
            height: "515px",
            maxHeight: "515px",
            padding: "7.5px 7.5px 7.5px 15px",
            WebkitTapHighlightColor: "transparent",
        },
    };

    const handleSelectedDate = (selected) => {
        setSelectedDate(selected);
    };

    const handleClear = () => {
        if (selectedDate && selectHour && selectMin && selectAMPM) {
            setSelecting(false);
        } else {
            setSelecting(false);
            setSelectedDate(null);
            setSelectHour(null);
            setSelectMin(null);
            setSelectAMPM(null);
        }
    };

    const handleHourSet = (e) => {
        setSelectHour(e.target.value);
    };

    const handleMinSet = (e) => {
        setSelectMin(e.target.value);
    };

    const handleAMPMSet = (e) => {
        setSelectAMPM(e.target.value);
    };

    const convertTime12to24 = (time12h) => {
        const [time, modifier] = time12h.split(" ");

        let hours = time.split(":")[0];

        if (hours === "12") {
            hours = "00";
        }

        if (modifier === "PM") {
            hours = parseInt(hours, 10) + 12;
        }

        return hours;
    };

    const handleReminderSet = async () => {
        if (notif_warn === 0 || notif_warn === null) {
            setPrompt(true);
        }

        setSelected(
            `${setTime(selectedDate)}, ${selectHour}:${selectMin} ${selectAMPM}`
        );

        setSelecting(false);
        const month = moment(selectedDate).month();
        const date = moment(selectedDate).date();
        const year = moment(selectedDate).format("YYYY");

        var datum = new Date(
            year,
            month,
            date,
            convertTime12to24(`${selectHour}:${selectMin} ${selectAMPM}`),
            selectMin
        );

        const remindMe = {
            timestamp_parsed: `${setTime(
                selectedDate
            )}, ${selectHour}:${selectMin} ${selectAMPM}`,
            hour: selectHour,
            min: selectMin,
            ampm: selectAMPM,
            selectedDate,
            timestamp: datum,
        };

        dispatch(todo_remind_timestamp(remindMe));

        if (switch_to_add === "add_") {
            if (back_index === "home" || home_todos.length !== 0) {
                dispatch(
                    todo_edit({
                        remindMe,
                        todo_url: url,
                    })
                );
            }

            await todoDB.todos
                .filter((todo) => {
                    return todo.todo_url === url;
                })
                .modify((todo) => {
                    schedule_notification(datum, desc, todo_index, {
                        text: todo.desc,
                        focustime: 0,
                        url: todo.todo_url,
                        type: "task",
                        steps: todo.steps.steps,
                        tag: todo.tag,
                        tag_id: todo.tag_id,
                    });

                    todo.remindMe = remindMe;
                });
        }
    };

    const remove_reminder = async () => {
        dispatch(todo_remove_reminder);
        setSelected("Select a time");
        setSelecting(null);

        setSelectHour("1");
        setSelectMin("00");
        setSelectAMPM("AM");
        setSelectedDate(null);

        if (switch_to_add === "add_") {
            if (back_index === "home" || home_todos.length !== 0) {
                dispatch(
                    todo_edit({
                        remindMe: null,
                        todo_url: url,
                    })
                );
            }

            await todoDB.todos
                .filter((todo) => {
                    return todo.todo_url === url;
                })
                .modify((todo) => {
                    remove_notification(todo.todo_url);
                    todo.remindMe = null;
                });
        }
    };

    const handleRequest = async () => {
        window.cordova.plugins.DozeOptimize.RequestOptimizations(
            (response) => {
                dispatch(reset_battery_opt);
            },
            (error) => {
                console.error("BatteryOptimizations Request Error" + error);
                return true;
            }
        );
    };

    const warn_jsx = (
        <Done load={true}>
            <div className="done_options">
                <img
                    style={{
                        width: "100px",
                        height: "100px",
                    }}
                    src={tip_icon}
                    alt="You may not always receive your notifications"
                />
                <div className="done_text">
                    I recommend setting a reminder on your phone just in case
                    (as a backup). Due to battery optimisations, you may not
                    always receive your notifications.
                </div>
                <span
                    className="action_button"
                    style={{
                        margin: "0 30px",
                        color: "#1395ff",
                    }}
                    onClick={() => {
                        setPrompt(false);
                    }}
                >
                    I understand
                </span>

                {battery_opt ? null : (
                    <div
                        className="action_button"
                        style={{
                            margin: "15px 30px",
                            color: "#1395ff",
                        }}
                        onClick={() => {
                            setPrompt(false);
                            handleRequest();
                        }}
                    >
                        Improve the situation
                    </div>
                )}

                <span style={{ marginTop: "10px" }}>
                    <span
                        className="action_button"
                        style={{
                            margin: "15px 30px",
                            color: "#1395ff",
                        }}
                        onClick={() => {
                            setPrompt(false);
                            localStorage.setItem("notif_warning", 1);
                        }}
                    >
                        Don't show again
                    </span>
                </span>
            </div>
        </Done>
    );

    return (
        <div className="category" style={{ marginTop: "35px" }}>
            <div style={{ marginBottom: "15px", marginLeft: "5px" }}>
                Remind me
            </div>

            {prompt ? warn_jsx : null}

            {selecting ? (
                <div className="category_select" style={style.style2}>
                    <div className="option" onClick={handleClear}>
                        <img
                            className="option_image_selected"
                            src={darkMode ? remind_light : remind}
                            alt="selected category"
                        ></img>
                        <div className="option_name">{selected}</div>
                    </div>

                    <div className="clock_section">
                        <span className="clock_text">Hour</span>
                        <select
                            name="hour"
                            style={style.style1}
                            required
                            className="clock_select"
                            onChange={handleHourSet}
                            defaultValue={selectHour || "1"}
                        >
                            <option value="1">1:00</option>
                            <option value="2">2:00</option>
                            <option value="3">3:00</option>
                            <option value="4">4:00</option>
                            <option value="5">5:00</option>
                            <option value="6">6:00</option>
                            <option value="7">7:00</option>
                            <option value="8">8:00</option>
                            <option value="9">9:00</option>
                            <option value="10">10:00</option>
                            <option value="11">11:00</option>
                            <option value="12">12:00</option>
                        </select>
                    </div>
                    <div className="clock_section">
                        <div className="clock_text">Minutes</div>
                        <select
                            name="minute"
                            style={style.style1}
                            className="clock_select"
                            required
                            onChange={handleMinSet}
                            defaultValue={selectMin || "00"}
                        >
                            <option value="00">00</option>
                            <option value="05">05</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                            <option value="25">25</option>
                            <option value="30">30</option>
                            <option value="35">35</option>
                            <option value="40">40</option>
                            <option value="45">45</option>
                            <option value="50">50</option>
                            <option value="55">55</option>
                        </select>
                    </div>
                    <div className="clock_section">
                        <div className="clock_text">AM/PM</div>
                        <select
                            name="AM/PM"
                            style={style.style1}
                            required
                            className="clock_select"
                            onChange={handleAMPMSet}
                            defaultValue={selectAMPM || "AM"}
                        >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                        </select>
                    </div>
                    <div className="date_select_picker">
                        <DayPicker
                            selectedDays={selectedDate}
                            onDayClick={handleSelectedDate}
                        />
                    </div>
                    <div className="remind_setters">
                        <span
                            className="set_remind"
                            style={{
                                color:
                                    selectHour &&
                                    selectMin &&
                                    selectAMPM &&
                                    selectedDate
                                        ? "#1395ff"
                                        : "grey",
                            }}
                            onClick={
                                selectHour &&
                                selectMin &&
                                selectAMPM &&
                                selectedDate
                                    ? handleReminderSet
                                    : null
                            }
                        >
                            Set reminder
                        </span>

                        <span
                            className="set_remind"
                            style={{
                                color:
                                    selectHour &&
                                    selectMin &&
                                    selectAMPM &&
                                    selectedDate
                                        ? "red"
                                        : "grey",
                                textAlign: "right",
                                marginRight: "7.5px",
                            }}
                            onClick={
                                selectHour &&
                                selectMin &&
                                selectAMPM &&
                                selectedDate
                                    ? remove_reminder
                                    : null
                            }
                        >
                            Remove reminder
                        </span>
                    </div>
                </div>
            ) : (
                <div
                    className="category_select"
                    style={style.style1}
                    onClick={() => {
                        setSelecting(true);
                    }}
                >
                    <div className="option">
                        <img
                            className="option_image_selected"
                            src={darkMode ? remind_light : remind}
                            alt="selected category"
                        ></img>
                        <div className="option_name">{selected}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Remind;
