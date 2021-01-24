import React, { useState, useEffect } from "react";
import moment from "moment";

import "./week.css";

const Week = (props) => {
    const style = {
        smallTitle: {
            color: "#1395ff",
        },
        title: {
            fontFamily: "Poppins, san-serif",
        },
    };

    const [week_state, setWeekState] = useState(false);

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

    useEffect(() => {
        let unmounted = false;

        const now = moment();
        const days_passed = now.diff(props.timestamp, "days");

        if (days_passed >= 0 && days_passed <= 7) {
            if (!unmounted) {
                setWeekState(true);
            }
        }

        return () => {
            unmounted = true;
        };
    }, []);

    return (
        <div className="top_highlight_contain" style={style.month}>
            <div className="top_highlights">
                <div className="_highlight">
                    <div className="_value">
                        {props.tasks && week_state
                            ? `${props.tasks} Tasks`
                            : "N/A"}
                    </div>
                    <div className="_title">Completed</div>
                </div>
                <div className="_highlight">
                    <div className="_value">
                        {props.goals && week_state
                            ? `${props.goals} Goals`
                            : "N/A"}
                    </div>
                    <div className="_title">Completed</div>
                </div>
            </div>

            <div className="top_highlights">
                <div className="_highlight">
                    <div className="_value">
                        {props.totalFocus && week_state
                            ? `${readableTime(props.totalFocus)}`
                            : "N/A"}
                    </div>
                    <div className="_title">Total Focused</div>
                </div>
                <div className="_highlight">
                    <div className="_value">
                        {props.tag && week_state ? `"${props.tag}"` : "N/A"}
                    </div>
                    <div className="_title">Most Focused Tag</div>
                </div>
            </div>

            <div className="top_highlights">
                <div className="_highlight">
                    <div className="_value">
                        {props.tasksFocus && week_state
                            ? `${readableTime(props.tasksFocus)}`
                            : "N/A"}
                    </div>
                    <div className="_title">Focused (Tasks)</div>
                </div>

                <div className="_highlight">
                    <div className="_value">
                        {props.goalsFocus && week_state
                            ? `${readableTime(props.goalsFocus)}`
                            : "N/A"}
                    </div>
                    <div className="_title">Focused (Goals)</div>
                </div>
            </div>
        </div>
    );
};

export default Week;
