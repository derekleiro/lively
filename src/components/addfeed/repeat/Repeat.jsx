import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Dexie from "dexie";

import "./repeat.css";

import repeat from "../../../assets/icons/repeat.png";
import repeat_light from "../../../assets/icons/repeat_light.png";

import Option from "./option/Option";
import { todo_edit, todo_repeat_option } from "../../../actions/add_feed";

const Repeat = () => {
    const dispatch = useDispatch();
    const darkMode = useSelector((state) => state.dark_mode);
    const todo_repeat_option_state = useSelector(
        (state) => state.todo_repeat_option
    );
    const url = useSelector((state) => state.url);
    const home_todos = useSelector((state) => state.todos.todos);
    const back_index = useSelector((state) => state.back_index);
    const switch_to_add = useSelector((state) => state.addfeed_switch);

    const todoDB = new Dexie("LivelyTodos");
    todoDB.version(1).stores({
        todos: `todo_url,desc,dueDate,category,tag,tag_id,steps,focustime,urgent,index,date_completed,remindMe,notes,todo_url,complete`,
    });

    const [selecting, setSelecting] = useState(false);
    const [selected, setSelected] = useState(todo_repeat_option_state);

    const style = {
        style1: {
            color: darkMode ? "white" : "black",
            border: darkMode ? "solid 1px  #1A1A1A" : "solid 1px #f0f0f0",
            background: "transparent",
            height: "auto",
        },
        style2: {
            color: darkMode ? "white" : "black",
            border: darkMode ? "solid 1px  #1A1A1A" : "solid 1px #f0f0f0",
            background: "transparent",
            height: "auto",
        },
    };

    const handleSelect = async (selected) => {
        if (selected) {
            setSelecting(false);
            setSelected(selected);
            dispatch(todo_repeat_option(selected));
        }

        if (switch_to_add === "add_") {
            if (back_index === "home" && home_todos.length !== 0) {
                dispatch(
                    todo_edit({
                        repeat: selected,
                        todo_url: url,
                    })
                );
            }

            await todoDB.todos
                .filter((todo) => {
                    return todo.todo_url === url;
                })
                .modify({
                    repeat: selected,
                });
        }
    };

    return (
        <div className="category" style={{ marginTop: "35px" }}>
            <div style={{ marginBottom: "15px", marginLeft: "5px" }}>
                Repeat
            </div>

            {selecting ? (
                <div className="category_select" style={style.style2}>
                    <Option
                        selected={selected}
                        value={"Never"}
                        handleSelect={handleSelect}
                    />

                    <Option
                        selected={selected}
                        value={"Daily"}
                        handleSelect={handleSelect}
                    />

                    <Option
                        selected={selected}
                        value={"Weekdays"}
                        handleSelect={handleSelect}
                    />

                    <Option
                        selected={selected}
                        value={"Weekends"}
                        handleSelect={handleSelect}
                    />

                    <Option
                        selected={selected}
                        value={"Weekly"}
                        handleSelect={handleSelect}
                    />

                    <Option
                        selected={selected}
                        value={"Monthly"}
                        handleSelect={handleSelect}
                    />
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
                            src={darkMode ? repeat_light : repeat}
                            alt="Reminder"
                        ></img>
                        <div className="option_name">{selected}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Repeat;
