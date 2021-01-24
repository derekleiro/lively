import React from "react";
import { useSelector } from "react-redux";

import "./option.css";

import edit_complete from "../../../../assets/icons/edit_complete.png";
import edit_complete_light from "../../../../assets/icons/edit_complete_light.png";

const Option = (props) => {
    const darkMode = useSelector((state) => state.dark_mode);

    return (
        <div
            className="option"
            onClick={props.handleSelect.bind(this, props.value)}
        >
            <div className="option_name">{props.value}</div>
            {props.selected === props.value ? (
                <img
                    className="option_image"
                    src={darkMode ? edit_complete_light : edit_complete}
                    alt="selected category"
                ></img>
            ) : null}
        </div>
    );
};

export default Option;
