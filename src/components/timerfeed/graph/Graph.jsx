import React, { useState, useEffect } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { Bar, defaults } from "react-chartjs-2";
import { merge } from "lodash";

import "./graph.css";

const Graph = (props) => {
    const darkMode = useSelector((state) => state.dark_mode);

    const today_timestamp = Date.parse(localStorage.getItem("today_timestamp"));
    const week_timestamp = Date.parse(localStorage.getItem("week_timestamp"));
    const toggle_state = useSelector((state) => state.toggle);

    const new_focus = JSON.parse(localStorage.getItem("new_focus"));
    const new_focus_week = JSON.parse(localStorage.getItem("new_focus_week"));

    const [show_state, setShowState] = useState(false);

    merge(defaults, {
        global: {
            defaultFontFamily: "Poppins",
            defaultFontSize: 14,
            defaultFontColor: darkMode ? "white" : "black",
        },
    });
    const data = {
        labels: props.data !== null ? [...props.data.labels] : [],
        datasets: [
            {
                label: "Focused time: tags (minutes)",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "#1395ff",
                borderColor: "#1395ff",
                borderCapStyle: "butt",
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: "miter",
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: props.data !== null ? [...props.data.values] : [],
            },
        ],
    };

    const empty_data = {
        labels: props.data !== null ? [...props.data.labels] : [],
        datasets: [
            {
                label: "Focused time: tags (minutes)",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "#1395ff",
                borderColor: "#1395ff",
                borderCapStyle: "butt",
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: "miter",
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [],
            },
        ],
    };

    useEffect(() => {
        let unmounted = false;

        if (toggle_state) {
            const now = moment();
            const days_passed = now.diff(week_timestamp, "days");

            if (days_passed >= 0 && days_passed <= 7 && new_focus_week) {
                if (!unmounted) {
                    setShowState(true);
                }
            } else {
                setShowState(false);
            }
        } else {
            if (
                moment(today_timestamp).calendar().includes("Today") &&
                new_focus
            ) {
                if (!unmounted) {
                    setShowState(true);
                }
            } else {
                setShowState(false);
            }
        }

        return () => {
            unmounted = true;
        };
    }, [toggle_state, new_focus, new_focus_week]);

    return (
        <div className="pie">
            <Bar
                data={show_state ? data : empty_data}
                height={300}
                options={{
                    maintainAspectRatio: true,
                    scales: {
                        yAxes: [
                            {
                                ticks: {
                                    beginAtZero: true,
                                    min: 0,
                                    userCallback: function (
                                        label,
                                        index,
                                        labels
                                    ) {
                                        if (Math.floor(label) === label) {
                                            return label;
                                        }
                                    },
                                },
                            },
                        ],
                    },
                }}
                legend={{ align: "center" }}
            />
            {props.data ? (
                props.data.values.length === 0 ? (
                    <div className="tip">
                        Tip: To get graph data, focus on a task with a tag
                    </div>
                ) : null
            ) : (
                <div className="tip">
                    Tip: To get graph data, focus on a task with a tag
                </div>
            )}
        </div>
    );
};

export default Graph;
