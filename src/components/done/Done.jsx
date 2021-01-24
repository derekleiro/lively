import React from "react";
import { useSelector } from "react-redux";

import "./done.css";
import { mode } from "../../constants/color";

const Done = (props) => {
    const dark_mode = useSelector((state) => state.dark_mode);

    const style = {
        background: dark_mode ? mode.dark : mode.light,
        zIndex: props.extra ? 15 : 2,
        overflow: "auto",
    };

    return (
        <div className="done" style={props.load ? style : null}>
            {props.children}
        </div>
    );
};

export default Done;
