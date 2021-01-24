import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
    List,
    AutoSizer,
    CellMeasurer,
    CellMeasurerCache,
} from "react-virtualized";
import Dexie from "dexie";

import "./goals-completed-feed.css";

import { mode } from "../../constants/color";
import Goal from "../goalsfeed/goal/Goal";
import Done from "../done/Done";

import loading from "../../assets/icons/loading.gif";
import missing_404 from "../../assets/icons/404.png";

import back_icon from "../../assets/icons/back.png";
import back_icon_light from "../../assets/icons/back_light.png";
import {
    dispatch_completed_goals,
    goal_index_home,
} from "../../actions/add_feed";
import {
    completed_goals_timeout,
    completed_goals_timeout_reset,
} from "../../actions/timeouts";

const GoalsCompletedFeed = () => {
    const darkMode = useSelector((state) => state.dark_mode);
    const history = useHistory();

    const dispatch = useDispatch();

    const completed_goals = useSelector(
        (state) => state.completed_goals.completed
    ).sort((goalA, goalB) => {
        return goalB.createdAt - goalA.createdAt;
    });

    const completed_goals_timeout_state = useSelector(
        (state) => state.completed_goals_timeout
    );

    const goalDB = new Dexie("LivelyGoals");
    goalDB.version(1).stores({
        goals: `goal_url,title,desc,steps,notes,focustime,date_completed,goal_url,complete`,
    });

    const style = {
        topNav: {
            top: 0,
            height: "45px",
            backgroundColor: darkMode ? mode.dark : mode.light,
            display: "flex",
            alignItems: "center",
            padding: "15px 0 10px 0",
        },
        title: {
            flex: 1,
            paddingLeft: "20px",
        },
        new: {
            flex: 1,
            textAlign: "right",
            paddingRight: "20px",
            fontSize: "14px",
            color: "#1395ff",
        },
    };

    const cache = useRef(
        new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: 100,
        })
    );

    useEffect(() => {
        const get_completed_goals = async () => {
            const my_completed_goals = await goalDB.goals
                .filter((goal) => {
                    return goal.complete === 1;
                })
                .toArray();

            dispatch(dispatch_completed_goals(my_completed_goals));
        };

        dispatch(goal_index_home);
        get_completed_goals();
    }, []);

    useEffect(() => {
        if (completed_goals_timeout_state === 0) {
            const timeout = setTimeout(() => {
                dispatch(completed_goals_timeout);
                clearTimeout(timeout);
            }, 1500);
        }

        return () => {
            dispatch(completed_goals_timeout_reset);
        };
    }, []);

    return (
        <div className="container">
            <div className="container_top_nav" style={style.topNav}>
                <span className="back_icon">
                    <img
                        src={darkMode ? back_icon_light : back_icon}
                        alt="Go back"
                        onClick={() => history.replace("/goals")}
                    />
                </span>
                <span className="title" style={style.title}>
                    Completed Goals
                </span>
            </div>

            <div style={{ marginTop: "50px" }}></div>

            {completed_goals_timeout_state === 0 ? (
                <Done load={true}>
                    <div className="done_options">
                        <img
                            style={{ width: "35px", height: "35px" }}
                            src={loading}
                            alt="Loading your tasks"
                        />
                    </div>
                </Done>
            ) : (
                <>
                    {completed_goals.length === 0 ? (
                        <>
                            <Done>
                                <div className="done_options">
                                    <img
                                        src={missing_404}
                                        alt="There are no completed goals yet"
                                    />

                                    <div className="done_text">
                                        Looks like you haven't completed a goal
                                        yet. You got this, I believe in you!
                                    </div>
                                </div>
                            </Done>
                        </>
                    ) : null}

                    <div style={{ width: "auto", height: "100%" }}>
                        <AutoSizer>
                            {({ width, height }) => {
                                return (
                                    <List
                                        width={width}
                                        height={height}
                                        rowHeight={cache.current.rowHeight}
                                        deferredMeasurementCache={cache.current}
                                        rowCount={completed_goals.length}
                                        rowRenderer={({
                                            index,
                                            parent,
                                            style,
                                            key,
                                        }) => {
                                            const goal = completed_goals[index];
                                            return (
                                                <CellMeasurer
                                                    key={goal.goal_url}
                                                    cache={cache.current}
                                                    parent={parent}
                                                    columnIndex={0}
                                                    rowIndex={index}
                                                >
                                                    <div style={style}>
                                                        <Goal
                                                            goal_title={
                                                                goal.title
                                                            }
                                                            goal_desc={
                                                                goal.desc
                                                            }
                                                            notes={
                                                                goal.notes.notes
                                                                    ? goal.notes
                                                                          .notes
                                                                    : []
                                                            }
                                                            focustime={
                                                                goal.focustime
                                                            }
                                                            steps={
                                                                goal.steps.steps
                                                                    ? goal.steps
                                                                          .steps
                                                                    : []
                                                            }
                                                            URL={goal.goal_url}
                                                            complete={
                                                                goal.complete
                                                            }
                                                            completedView={true}
                                                            goal={goal}
                                                        />
                                                    </div>
                                                </CellMeasurer>
                                            );
                                        }}
                                    />
                                );
                            }}
                        </AutoSizer>
                    </div>
                    <div style={{ marginTop: "15px" }}></div>
                </>
            )}
        </div>
    );
};

export default GoalsCompletedFeed;
