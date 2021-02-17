import React from "react";
import { useSelector } from "react-redux";

import "./month.css";

const Month = (props) => {
    const darkMode = useSelector((state) => state.dark_mode);

    const style = {
        smallTitle: {
            color: "#1395ff",
        },
        month: {
            borderBottom: darkMode ? "solid 1px  #1A1A1A" : "solid 1px #f0f0f0",
        },
        title: {
            fontFamily: "Poppins, san-serif",
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
            return `${hours} hours ${minutes % 60} minutes`;
        } else{
            return `${hours} hours ${minutes % 60 !== 0 ? ` ${minutes % 60} minutes` : ``}`;
        }
    };

    return (
        <div className="month" style={style.month}>
            <div className="month_container" style={{ textAlign: "center" }}>
                <div className="title" style={style.title}>
                    {props.month}
                </div>
                <div className="title" style={style.title}>
                    {props.year}
                </div>
            </div>
            <div
                className="month_container"
                style={{ flex: 2, textAlign: "right" }}
            >
                {props.focusTime ? (
                    <div className="highlight_container">
                        <div className="highlight">Total time focused</div>
                        <div className="highlight" style={style.smallTitle}>
                            {readableTime(props.focusTime)}
                        </div>
                    </div>
                ) : null}

                {props.tasksFocus ? (
                    <div className="highlight_container">
                        <div className="highlight">Time focused on tasks</div>
                        <div className="highlight" style={style.smallTitle}>
                            {readableTime(props.tasksFocus)}
                        </div>
                    </div>
                ) : null}

                {props.completedTasks ? (
                    <div className="highlight_container">
                        <div className="highlight">Completed tasks</div>
                        <div className="highlight" style={style.smallTitle}>
                            {props.completedTasks}
                        </div>
                    </div>
                ) : null}

                {props.goalsFocus ? (
                    <div className="highlight_container">
                        <div className="highlight">Time focused on goals</div>
                        <div className="highlight" style={style.smallTitle}>
                            {readableTime(props.goalsFocus)}
                        </div>
                    </div>
                ) : null}

                {props.completedGoals ? (
                    <div className="highlight_container">
                        <div className="highlight">Completed goals</div>
                        <div className="highlight" style={style.smallTitle}>
                            {props.completedGoals}
                        </div>
                    </div>
                ) : null}

                {!props.completedGoals &&
                !props.completedTasks &&
                !props.focusTime ? (
                    <>
                        Nothing to show for this month. Preparing to start big I
                        see. Good luck! You can do this!
                    </>
                ) : null}
            </div>
        </div>
    );
};

export default Month;
