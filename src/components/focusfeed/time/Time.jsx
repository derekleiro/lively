import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

import "./time.css";

import Option from "./option/Option";
import { focus_timeSET } from "../../../actions/focus_feed";

const Time = (props) => {
    const dispatch = useDispatch();
    const darkMode = useSelector((state) => state.dark_mode);
    const focus_info_state = useSelector((state) => state.focus_info);
    const data_local = JSON.parse(localStorage.getItem("focus"));
    const todo_tag_selected_value = useSelector((state) =>
        state.todo_tag_selected ? state.todo_tag_selected.tag : null
    );
    const todo_tag_selected_id = useSelector((state) =>
        state.todo_tag_selected ? state.todo_tag_selected.id : null
    );

    const [selected, setSelected] = useState(3600);

    const style = {
        style1: {
            color: darkMode ? "white" : "black",
            border: darkMode ? "solid 1px  #1A1A1A" : "solid 1px #f0f0f0",
            background: "transparent",
        },
        style2: {
            color: darkMode ? "white" : "black",
            border: darkMode ? "solid 1px  #1A1A1A" : "solid 1px #f0f0f0",
            background: "transparent",
            height: "250px",
        },
    };

    const handleSelect = (selected) => {
        if (selected) {
            props.handleSelect(selected, {
                event_time: moment(new Date()).add(selected, "s").toDate(),
                time: selected,
                type: focus_info_state ? focus_info_state.type || null : null,
                steps: focus_info_state ? focus_info_state.steps || [] : [],
                text: focus_info_state ? focus_info_state.text || "" : "",
                extra: focus_info_state ? focus_info_state.extra || "" : "",
                focustime: focus_info_state
                    ? focus_info_state.focustime || 0
                    : 0,
                url: focus_info_state ? focus_info_state.url || null : null,
                tag: todo_tag_selected_value
                    ? todo_tag_selected_value
                    : focus_info_state
                    ? focus_info_state.tag
                    : null,
                tag_id: todo_tag_selected_id
                    ? todo_tag_selected_id
                    : focus_info_state
                    ? focus_info_state.tag_id
                    : null,
            });
            setSelected(selected);
            dispatch(focus_timeSET(selected));
        }
    };

    useEffect(() => {
        if (!data_local) {
            handleSelect(selected);
        }
    }, [todo_tag_selected_value]);

    return (
        <div className="category" style={{ marginTop: "35px" }}>
            <div style={{ marginBottom: "15px", marginLeft: "5px" }}>
                Focus for:
            </div>
            <div className="category_select" style={style.style2}>
                <Option
                    selected={selected}
                    value={900}
                    handleSelect={handleSelect}
                />
                <Option
                    selected={selected}
                    value={1800}
                    handleSelect={handleSelect}
                />
                <Option
                    selected={selected}
                    value={2700}
                    handleSelect={handleSelect}
                />
                <Option
                    selected={selected}
                    value={3600}
                    handleSelect={handleSelect}
                />
                <Option
                    selected={selected}
                    value={4500}
                    handleSelect={handleSelect}
                />
                <Option
                    selected={selected}
                    value={5400}
                    handleSelect={handleSelect}
                />
                <Option
                    selected={selected}
                    value={6300}
                    handleSelect={handleSelect}
                />
                <Option
                    selected={selected}
                    value={7200}
                    handleSelect={handleSelect}
                />
            </div>
        </div>
    );
};

export default Time;
