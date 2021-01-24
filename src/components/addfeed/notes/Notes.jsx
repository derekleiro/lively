import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import Dexie from "dexie";

import plus from "../../../assets/icons/plus.png";
import plus_light from "../../../assets/icons/plus_light.png";

import "./notes.css";

import Note from "./Note";
import { todo_notes_option } from "../../../actions/add_feed";

const Notes = () => {
    const dispatch = useDispatch();

    const darkMode = useSelector((state) => state.dark_mode);
    const Notes = useSelector((state) => state.todo_notes_option.notes);

    const [allowed, setAllowed] = useState(false);
    const [checked, setChecked] = useState(false);

    const todoDB = new Dexie("LivelyTodos");
    todoDB.version(1).stores({
        todos: `todo_url,desc,dueDate,category,tag,tag_id,steps,focustime,index,date_completed,remindMe,notes,todo_url,complete`,
    });

    const goalDB = new Dexie("LivelyGoals");
    goalDB.version(1).stores({
        goals: `goal_url,title,desc,steps,notes,focustime,date_completed,goal_url,complete`,
    });

    const generateURL = () => {
        const uuid = uuidv4();
        return `note_${uuid}`;
    };

    const handleClick = () => {
        setAllowed(true);
        setChecked(true);
        dispatch(
            todo_notes_option({ text: "", id: generateURL(), complete: 0 })
        );
    };

    const handleEdit = () => {
        if (!allowed) {
            setAllowed(true);
        } else {
            setAllowed(false);
        }
    };

    const handleChecked = (checked) => {
        if (checked) {
            setChecked(true);
        } else {
            setChecked(false);
        }
    };

    return (
        <div className="notes" style={{ marginTop: "35px" }}>
            <div style={{ marginBottom: "15px", marginLeft: "5px" }}>Notes</div>
            {Notes.map((note, index) => {
                return (
                    <div key={index}>
                        <Note
                            index={index}
                            text={note.text ? note.text : ""}
                            handleEdit={handleEdit}
                            handleChecked={handleChecked}
                            allowed={allowed}
                            id={note.id}
                        />
                    </div>
                );
            })}
            {checked && allowed ? null : (
                <div className="textarea_steps" onClick={handleClick}>
                    <span className="text_bar_plus_icon">
                        <img
                            src={darkMode ? plus_light : plus}
                            alt="Add a new note"
                        />{" "}
                        Add note
                    </span>
                </div>
            )}
        </div>
    );
};

export default Notes;
