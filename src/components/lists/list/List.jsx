import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import autosize from "autosize";
import Dexie from "dexie";
import { Link } from "react-router-dom";

import "./list.css";

import edit from "../../../assets/icons/edit.png";
import edit_light from "../../../assets/icons/edit_light.png";
import edit_complete from "../../../assets/icons/edit_complete.png";
import edit_complete_light from "../../../assets/icons/edit_complete_light.png";
import cancel_icon from "../../../assets/icons/back.png";
import cancel_icon_light from "../../../assets/icons/back_light.png";

import {
    lists_dispatch,
    list_edit,
    list_info,
} from "../../../actions/list_feed";
import {
    handle_users_lists_changes,
    todos_category_change,
} from "../../../actions/add_feed";

const List = (props) => {
    const dispatch = useDispatch();
    const darkMode = useSelector((state) => state.dark_mode);

    const [text, setText] = useState(props.name ? props.name : "");
    const [edit_text, setEdit] = useState(props.name ? false : true);
    const [edit_list, setEditList] = useState(false);
    const [completed_count, setCompletedCount] = useState(
        props.default_values ? props.default_values.completed : null
    );
    const [todo_count, setTodoCount] = useState(
        props.default_values ? props.default_values.todo : null
    );

    const db = new Dexie("LivelyLists");
    db.version(1).stores({
        lists: `list_id,name,todo,completed,list_id,index`,
    });

    const todoDB = new Dexie("LivelyTodos");
    todoDB.version(1).stores({
        todos: `todo_url,desc,dueDate,category,tag,tag_id,steps,focustime,index,date_completed,remindMe,notes,todo_url,complete`,
    });

    const handleInput = (e) => {
        e.target.value = e.target.value.replace(/[\r\n\v]+/g, "");
        setText(e.target.value);
    };

    const handleEdit = () => {
        props.handleEdit();
        setEdit(true);
        setEditList(true);
    };

    const handleEditFinish = async () => {
        if (text.trim() !== "") {
            props.handleEdit();
            setEdit(false);

            if (!edit_list) {
                const index = await db.lists
                    .filter((list) => list.default === false)
                    .count();

                const new_list = {
                    name: text,
                    todo: 0,
                    completed: 0,
                    list_id: props.id,
                    index: index,
                    default: false,
                };

                dispatch(lists_dispatch(new_list));

                await db.lists
                    .add(new_list)
                    .then(() => console.log("list added..."))
                    .catch((e) => console.log(e));
            } else {
                const data = {
                    new_name: text,
                    list_id: props.id,
                    values: props.default_values,
                };

                dispatch(list_edit(data));

                await db.lists
                    .filter((list) => list.list_id === props.id)
                    .modify({ name: text });

                await todoDB.todos
                    .filter((todo) => todo.category === props.name)
                    .modify((todos) => {
                        todos.category = text;
                    });

                dispatch(
                    handle_users_lists_changes({
                        category: props.name,
                        new_name: text,
                    })
                );
                dispatch(
                    todos_category_change({
                        category: props.name,
                        new_name: text,
                    })
                );
            }
        } else {
            props.handleEditBlank();
            setEdit(false);
            setText(props.name)
        }
    };

    const textarea = (c) => {
        if (c) {
            c.focus();
            autosize(c);
        }
    };

    const handleDispatch = () => {
        dispatch(
            list_info({
                name: text,
                todo: props.todo,
                completed: props.completed,
                list_id: props.id,
                index: props.index,
                default: props.default,
            })
        );
    };

    useEffect(() => {
        if (text) {
            if (!props.default) {
                const todo_count = props.users_lists.filter(
                    (todo) => todo.category === props.name
                ).length;

                setTodoCount(todo_count);

                const completed_count = props.users_lists.filter(
                    (todo) =>
                        todo.category === props.name && todo.complete === 1
                ).length;

                setCompletedCount(completed_count);

                dispatch(
                    list_edit({
                        values: {
                            todo: todo_count,
                            completed: completed_count,
                        },
                        list_id: props.id,
                    })
                );
            } else {
                dispatch(
                    list_edit({
                        values: props.default_values,
                        list_id: props.id,
                    })
                );
            }
        }
    }, []);

    return (
        <>
            <div className="list-container">
                <span className="list-color">
                    <img
                        src={darkMode ? props.icon_light : props.icon}
                        alt={text}
                    />
                </span>
                <span className="list-content">
                    <div className="list">
                        <div className="list-content">
                            {edit_text ? (
                                <textarea
                                    ref={(c) => textarea(c)}
                                    style={{
                                        color: darkMode ? "white" : "black",
                                        fontSize: "14px",
                                        marginTop: "10px",
                                    }}
                                    placeholder="List name..."
                                    className="text_bar_step_textarea"
                                    onChange={handleInput}
                                    defaultValue={text}
                                ></textarea>
                            ) : (
                                <>
                                    {props.name ? (
                                        <Link
                                            to={`/list_${props.id}`}
                                            onClick={handleDispatch}
                                        >
                                            <span
                                                className="list-name"
                                                style={{
                                                    color: darkMode
                                                        ? "white"
                                                        : "black",
                                                }}
                                            >
                                                {text}
                                            </span>
                                            <span
                                                style={{
                                                    margin: `0 5px`,
                                                    color: "grey",
                                                }}
                                                dangerouslySetInnerHTML={{
                                                    __html: `&#8226;`,
                                                }}
                                            ></span>
                                            <span
                                                className="list-name"
                                                style={{ color: "grey" }}
                                            >
                                                {todo_count} To do's
                                            </span>
                                            {todo_count - completed_count ===
                                            0 ? null : (
                                                <div className="list-todos">
                                                    {todo_count -
                                                        completed_count}{" "}
                                                    Not done
                                                </div>
                                            )}{" "}
                                        </Link>
                                    ) : (
                                        <>
                                            <span className="list-name">
                                                {text}
                                            </span>
                                            <span
                                                style={{
                                                    margin: `0 5px`,
                                                    color: "grey",
                                                }}
                                                dangerouslySetInnerHTML={{
                                                    __html: `&#8226;`,
                                                }}
                                            ></span>
                                            <span
                                                className="list-name"
                                                style={{ color: "grey" }}
                                            >
                                                No To do's
                                            </span>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </span>
                {props.default ? null : (
                    <>
                        {edit_text ? (
                            <span
                                className="list-end"
                                onClick={handleEditFinish}
                            >
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
                                    alt={text}
                                />
                            </span>
                        ) : (
                            <span
                                className="list-end"
                                onClick={props.adding ? null : handleEdit}
                            >
                                <img
                                    src={
                                        !text
                                            ? darkMode
                                                ? cancel_icon_light
                                                : cancel_icon
                                            : darkMode
                                            ? edit_light
                                            : edit
                                    }
                                    alt={text}
                                />
                            </span>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default List;
