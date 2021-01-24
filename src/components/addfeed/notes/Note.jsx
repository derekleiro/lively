import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import autosize from "autosize";
import Dexie from "dexie";

import edit_complete from "../../../assets/icons/edit_complete.png";
import edit_complete_light from "../../../assets/icons/edit_complete_light.png";
import cancel_icon from "../../../assets/icons/back.png";
import cancel_icon_light from "../../../assets/icons/back_light.png";

import delete_icon from "../../../assets/icons/delete.png";
import delete_icon_light from "../../../assets/icons/delete_light.png";
import {
    todo_edit_note_option,
    todo_note_delete,
    todo_edit,
    goal_edit,
} from "../../../actions/add_feed";

const Note = (props) => {
    const dispatch = useDispatch();
    const darkMode = useSelector((state) => state.dark_mode);
    const url = useSelector((state) => state.url);
    const home_todos = useSelector((state) => state.todos.todos);
    const goals_state = useSelector((state) => state.goals.goals);
    const back_index = useSelector((state) => state.back_index);
    const switch_to_add = useSelector((state) => state.addfeed_switch);
    const notes_state = useSelector((state) => state.todo_notes_option.notes);

    const [text, setText] = useState("");
    const [edit, setEdit] = useState(props.text === "" ? true : false);
    const [second_edit, setSecondEdit] = useState(false);

    const todoDB = new Dexie("LivelyTodos");
    todoDB.version(1).stores({
        todos: `todo_url,desc,dueDate,category,tag,tag_id,steps,focustime,index,date_completed,remindMe,notes,todo_url,complete`,
    });

    const goalDB = new Dexie("LivelyGoals");
    goalDB.version(1).stores({
        goals: `goal_url,title,desc,steps,notes,focustime,date_completed,goal_url,complete`,
    });

    const handleInput = (e) => {
        e.target.value = e.target.value.replace(/[\r\n\v]+/g, "");
        setText(e.target.value);
    };

    const edit_notes = async () => {
        if (switch_to_add === "add_") {
            if (back_index === "home" || home_todos.length !== 0) {
                dispatch(
                    todo_edit({
                        notes: {
                            notes: notes_state,
                        },
                        todo_url: url,
                    })
                );
            }

            await todoDB.todos
                .filter((todo) => {
                    return todo.todo_url === url;
                })
                .modify({
                    notes: {
                        notes: notes_state,
                    },
                });
        } else if (switch_to_add === "goal_") {
            if(goals_state.length !== 0){
                dispatch(
                    goal_edit({
                        notes: {
                            notes: notes_state,
                        },
                        goal_url: url,
                    })
                );
            }

            await goalDB.goals
                .filter((goal) => {
                    return goal.goal_url === url;
                })
                .modify({
                    notes: {
                        notes: notes_state,
                    },
                });
        }
    };

    const removeNote = async (id) => {
        if (switch_to_add === "add_") {
            await todoDB.todos
                .filter((todo) => {
                    return todo.todo_url === url;
                })
                .modify((todo) => {
                    todo.notes.notes = todo.notes.notes.filter(
                        (note) => note.id !== id
                    );
                });
        } else if (switch_to_add === "goal_") {
            await goalDB.goals
                .filter((goal) => {
                    return goal.goal_url === url;
                })
                .modify((goal) => {
                    goal.notes.notes = goal.notes.notes.filter(
                        (note) => note.id !== id
                    );
                });
        }
    };

    const handleEdit = () => {
        if (props.allowed === false) {
            props.handleEdit();
            setEdit(true);
            props.handleChecked(true);
        }
    };

    const textarea = (c) => {
        if (c) {
            c.focus();
            autosize(c);
        }
    };

    const handleFinishEdit = () => {
        if (text.trim() !== "" && !props.text && !second_edit) {
            setEdit(false);
            props.handleEdit();
            props.handleChecked(false);
            setSecondEdit(true);

            dispatch(todo_edit_note_option({ text, index: props.index }));

            edit_notes();
        } else if (text.trim() !== "") {
            setEdit(false);
            props.handleEdit();
            props.handleChecked(false);
            dispatch(
                todo_edit_note_option({
                    text,
                    index: props.index,
                })
            );

            edit_notes();
        } else {
            setEdit(false);
            props.handleEdit();
            props.handleChecked(false);

            dispatch(todo_note_delete({ id: props.id }));

            if (switch_to_add === "add_" || switch_to_add === "goal_") {
                removeNote(props.id);
                if (switch_to_add === "add_") {
                    if (back_index === "home" || home_todos.length !== 0) {
                        dispatch(
                            todo_edit({
                                note_edit: true,
                                note_id: props.id,
                                todo_url: url,
                            })
                        );
                    }
                }

                if (switch_to_add === "goal_" && goals_state.length !== 0) {
                    dispatch(
                        goal_edit({
                            note_edit: true,
                            note_id: props.id,
                            goal_url: url,
                        })
                    );
                }
            }
        }
    };

    const handleDelete = () => {
        dispatch(todo_note_delete({ id: props.id }));

        if (switch_to_add === "add_" || switch_to_add === "goal_") {
            if (switch_to_add === "add_" && home_todos.length !== 0) {
                dispatch(
                    todo_edit({
                        note_edit: true,
                        note_id: props.id,
                        todo_url: url,
                    })
                );
            } else {
                if (goals_state.length !== 0) {
                    dispatch(
                        goal_edit({
                            note_edit: true,
                            note_id: props.id,
                            goal_url: url,
                        })
                    );
                }    
            }
            removeNote(props.id);
        }
    };

    return (
        <div className="card">
            <div
                className="card-completed"
                style={{
                    fontSize: "18px",
                    color: "grey",
                }}
            >
                #
            </div>
            <div className="card-content" onClick={handleEdit}>
                {props.text && !edit ? (
                    <div
                        className="card-desc"
                        style={{
                            fontSize: "14px",
                        }}
                    >
                        {props.text}
                    </div>
                ) : text && !edit ? (
                    <div
                        className="card-desc"
                        style={{
                            fontSize: "14px",
                        }}
                    >
                        {text}
                    </div>
                ) : (
                    <textarea
                        ref={(c) => textarea(c)}
                        style={{
                            color: darkMode ? "white" : "black",
                            fontSize: "14px",
                        }}
                        placeholder="New note.."
                        className="text_bar_step_textarea"
                        onChange={handleInput}
                        defaultValue={props.text ? props.text : text}
                    ></textarea>
                )}
            </div>
            <div className="card-star">
                {edit ? (
                    <img
                        src={
                            !text
                                ? darkMode
                                    ? cancel_icon_light
                                    : cancel_icon
                                : darkMode
                                ? edit_complete_light
                                : edit_complete
                        }
                        onClick={handleFinishEdit}
                        alt="Delete task"
                    ></img>
                ) : (
                    <img
                        src={darkMode ? delete_icon_light : delete_icon}
                        onClick={handleDelete}
                        alt="Delete task"
                    ></img>
                )}
            </div>
        </div>
    );
};

export default Note;
