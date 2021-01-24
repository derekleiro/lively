import React, { useState } from "react";
import { useSelector } from "react-redux";

import "./option.css";

import edit_complete from "../../../../assets/icons/edit_complete.png";
import edit_complete_light from "../../../../assets/icons/edit_complete_light.png";

import delete_icon from "../../../../assets/icons/delete.png";
import delete_light from "../../../../assets/icons/delete_light.png";

import delete_large_icon from "../../../../assets/icons/delete_item.png";

import Done from "../../../done/Done";

const Option = (props) => {
    const darkMode = useSelector((state) => state.dark_mode);
    const [prompt, setPrompt] = useState(false);

    const selected_value = useSelector((state) => state.todo_tag_selected);
    const edit_mode = useSelector((state) => state.addfeed_switch);

    return (
        <div className="option">
            <div className="option_container">
                <span
                    className="option_name"
                    onClick={props.handleSelect.bind(this, {
                        value: props.value,
                        id: props.id,
                    })}
                >
                    {props.value}
                </span>
                {props.selected === props.value ? (
                    <img
                        className="option_image"
                        src={darkMode ? edit_complete_light : edit_complete}
                        alt="selected tag"
                    ></img>
                ) : null}
            </div>
            {props.deleteOption ? (
                <div
                    className="option_container"
                    style={{ textAlign: "right" }}
                >
                    {prompt ? (
                        <Done load={true}>
                            <div className="done_options">
                                <img
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                    }}
                                    src={delete_large_icon}
                                    alt={`You are about to delete the tag "${props.value}" are you sure?`}
                                />
                                <div className="done_text">
                                    Are you sure you want to delete this tag?
                                    All the tasks with the tag{" "}
                                    {edit_mode === "add_" &&
                                    selected_value === props.value
                                        ? "(Including this one)"
                                        : null}{" "}
                                    will be deleted also.
                                </div>
                                <span
                                    className="action_button"
                                    style={{
                                        margin: "0 30px",
                                        color: "#1395ff",
                                    }}
                                    onClick={() => {
                                        props.handleDelete({
                                            id: props.id,
                                            name: props.value,
                                        });
                                        setPrompt(false);
                                    }}
                                >
                                    Yes
                                </span>
                                <span
                                    className="action_button"
                                    style={{
                                        margin: "0 30px",
                                        color: "#1395ff",
                                    }}
                                    onClick={() => setPrompt(false)}
                                >
                                    No
                                </span>
                            </div>
                        </Done>
                    ) : null}

                    <img
                        className="option_image"
                        src={darkMode ? delete_light : delete_icon}
                        alt={`Delete the tag "${props.value}"`}
                        onClick={() => setPrompt(true)}
                    ></img>
                </div>
            ) : null}
        </div>
    );
};

export default Option;
