import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import moment from "moment";

import "./focus-feed.css";

import back_icon from "../../assets/icons/back.png";
import back_icon_light from "../../assets/icons/back_light.png";
import Target from "./target/Target";
import { mode } from "../../constants/color";
import Time from "./time/Time";
import {
    focus_timeSET,
    clear_focus,
    focus_done,
    focus_info,
} from "../../actions/focus_feed";
import CountDown from "./countdown/CountDown";
import Done from "../done/Done";

const FocusFeed = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const darkMode = useSelector((state) => state.dark_mode);
    const timeSetRaw = useSelector((state) => state.focus_time_set);
    const focus_info_state = useSelector((state) => state.focus_info);
    const focus_ongoing = localStorage.getItem("focus");
    const data = JSON.parse(focus_ongoing);

    const [timerOn, setTimerOn] = useState(false);
    const [timeSet, setTimeSet] = useState(timeSetRaw);
    const [localData, setLocalData] = useState(null);

    const style = {
        light: {
            color: "white",
            margin: "0 5px",
            fontSize: "18px",
        },
        dark: {
            color: "black",
            margin: "0 5px",
            fontSize: "18px",
        },
    };

    const startFocus = () => {
        setTimerOn(true);
        localStorage.setItem("focus", JSON.stringify(localData));
    };

    const handleSelect = (selected, data) => {
        dispatch(focus_info(data));
        setLocalData(data);
        setTimeSet(true);
    };

    const handleTimeSet = () => {
        setTimeSet(false);
    };

    useEffect(() => {
        let unmounted = false;

        if (data) {
            if (!unmounted) {
                setTimerOn(true);
                setTimeSet(true);
            }
        }

        return () => {
            dispatch(focus_timeSET(null));
            dispatch(clear_focus);
            dispatch(focus_done(false));
            localStorage.removeItem("focus");
        };
    }, [dispatch]);

    const focus_centered = (
        <Done>
            <div className="done_options" style={{ padding: "0 20px" }}>
                <span style={{ margin: "0 auto" }}>
                    <Target
                        text={focus_info_state ? focus_info_state.text : null}
                        extra={focus_info_state ? focus_info_state.extra : null}
                        steps={focus_info_state ? focus_info_state.steps : null}
                        left={false}
                    />
                    <CountDown
                        handleTimeSet={handleTimeSet}
                    />
                </span>
            </div>
        </Done>
    );

    const focus = (
        <div className="done_options">
            <Target
                text={focus_info_state ? focus_info_state.text : null}
                extra={focus_info_state ? focus_info_state.extra : null}
                steps={focus_info_state ? focus_info_state.steps : null}
                left={true}
            />
            <CountDown
                handleTimeSet={handleTimeSet}
            />
        </div>
    );

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
                            if (focus_info_state) {
                                if (focus_info_state.type === "task") {
                                    history.replace("/");
                                } else if (focus_info_state.type === "goal") {
                                    history.replace("/goals");
                                } else {
                                    history.replace("/timer");
                                }
                            } else {
                                history.replace("/timer");
                            }
                        }}
                    />
                </span>
                <span
                    className="title"
                    style={darkMode ? style.light : style.dark}
                >
                    Focus
                </span>
                <div id="create_todo">
                    {timeSet ? (
                        <span
                            style={{ color: "#1395ff" }}
                            onClick={timerOn ? null : startFocus}
                        >
                            {timerOn ? "..." : "Start"}
                        </span>
                    ) : (
                        <span style={{ color: "grey" }}>You rock!</span>
                    )}
                </div>
            </div>

            <div className="space" style={{ marginTop: "75px" }}></div>

            {timerOn ? (
                <>
                    {focus_info_state
                        ? focus_info_state.steps.length > 5
                            ? focus
                            : focus_centered
                        : focus_centered}
                </>
            ) : (
                <>
                    {focus_info_state ? (
                        <Target
                            text={focus_info_state.text}
                            extra={focus_info_state.extra}
                            steps={focus_info_state.steps}
                            left={true}
                        />
                    ) : null}

                    <Time handleSelect={handleSelect} />
                </>
            )}
        </div>
    );
};

export default FocusFeed;
