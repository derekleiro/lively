import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import autosize from "autosize";
import Dexie from "dexie";

import edit_complete from "../../../assets/icons/edit_complete.png";
import edit_complete_light from "../../../assets/icons/edit_complete_light.png";

import "./summary.css";
import { goal_edit, goal_summary } from "../../../actions/add_feed";

const Summary = () => {
    const dispatch = useDispatch();
    const darkMode = useSelector((state) => state.dark_mode);
    const todo_desc = useSelector((state) => state.todo_desc);
    const goal_summary_text = useSelector((state) => state.goal_summary);
	const home_goals = useSelector((state) => state.goals.goals);
    const url = useSelector((state) => state.url);
    const switch_to_add = useSelector((state) => state.addfeed_switch);

    const [text, setText] = useState(
        goal_summary_text ? goal_summary_text : ""
    );
    const checked = false;
    const [switch_state, setSwitch] = useState(
        goal_summary_text ? true : false
    );

    const goalDB = new Dexie("LivelyGoals");
    goalDB.version(1).stores({
        goals: `goal_url,title,desc,steps,notes,focustime,tag,tag_id,deadline,date_completed,goal_url,complete`,
    });

    const textarea = (c) => {
        if (c) {
            c.focus();
            autosize(c);
        }
    };

    const handleInput = (e) => {
        e.target.value = e.target.value.replace(/[\r\n\v]+/g, "");
        setText(e.target.value);
    };

    const editInput = () => {
        setSwitch(false);
    };

    const saveInput = async () => {
        if (text.trim() !== "") {
            setSwitch(true);
            dispatch(goal_summary(text));

            if (switch_to_add === "goal_") {
                if(home_goals.length !== 0){
                    const goal = {
                        desc: text,
                        goal_url: url,
                    };
    
                    dispatch(goal_edit(goal));
                }

                await goalDB.goals
                    .filter((goal) => {
                        return goal.goal_url === url;
                    })
                    .modify({
                        desc: text,
                    });
            }
        }
    };

    return (
        <div className="summary">
            <div
                style={{
                    marginBottom: "15px",
                    marginLeft: "5px",
                    marginTop: "100px",
                }}
            >
                Description
            </div>
            <div className="card">
                <div
                    className="card-content"
                    onClick={checked ? null : editInput}
                >
                    {switch_state ? (
                        <div className="card-desc" style={{ fontSize: "15px" }}>
                            {text}
                        </div>
                    ) : (
                        <textarea
                            ref={(c) => textarea(c)}
                            placeholder="Describe your goal..."
                            className="text_bar_step_textarea"
                            style={{
                                color: darkMode ? "white" : "black",
                                fontSize: "15px",
                                minHeight: "35px",
                                height: "35px",
                            }}
                            disabled={todo_desc ? false : true}
                            onChange={handleInput}
                            defaultValue={text}
                        ></textarea>
                    )}
                </div>

                {!switch_state ? (
                    <div className="card-star">
                        <img
                            src={darkMode ? edit_complete_light : edit_complete}
                            alt="edit task"
                            onClick={saveInput}
                        ></img>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default Summary;
