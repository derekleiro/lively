import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

import "./time.css";

import Option from "./option/Option";
import { focus_timeSET } from "../../../actions/focus_feed";

const Time = (props) => {
    const dispatch = useDispatch();
    const darkMode = useSelector((state) => state.dark_mode);
    const focus_info = useSelector((state) => state.focus_info);

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
                type: focus_info ? focus_info.type || null : null,
                steps: focus_info ? focus_info.steps || [] : [],
                text: focus_info ? focus_info.text || "" : "",
                extra: focus_info ? focus_info.extra || "" : "",
                focustime: focus_info ? focus_info.focustime || 0 : 0,
                url: focus_info ? focus_info.url || null : null,
                tag: focus_info ? focus_info.tag || null : null,
                tag_id: focus_info ? focus_info.tag_id || null : null,
            });
            setSelected(selected);
            dispatch(focus_timeSET(selected));
        }
    };

    useEffect(() => {
        handleSelect(selected);
    }, []);

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
