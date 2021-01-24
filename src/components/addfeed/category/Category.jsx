import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import autosize from "autosize";
import Dexie from "dexie";
import { v4 as uuidv4 } from "uuid";
import { useHistory } from "react-router-dom";

import "./category.css";

import edit_complete from "../../../assets/icons/edit_complete.png";
import edit_complete_light from "../../../assets/icons/edit_complete_light.png";
import lists from "../../../assets/icons/lists.png";
import lists_light from "../../../assets/icons/lists_light.png";

import Option from "./option/Option";
import {
    todos_category_remove,
    todos_clear,
    todo_edit,
    todo_list_option,
    todo_list_selected,
} from "../../../actions/add_feed";
import { refresh_list_state } from "../../../actions/list_feed";
import { list_timeout_clear } from "../../../actions/timeouts";
import { navStateHome } from "../../../actions/bottom_nav";

const Category = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const darkMode = useSelector((state) => state.dark_mode);
    const url = useSelector((state) => state.url);
    const home_todos = useSelector((state) => state.todos.todos);
    const back_index = useSelector((state) => state.back_index);
    const todo_list_option_value = useSelector(
        (state) => state.todo_list_option
    );
    const todo_list_selected_value = useSelector(
        (state) => state.todo_list_selected
    );
    const switch_to_add = useSelector((state) => state.addfeed_switch);
    const todos_ = useSelector((state) => state.todos.todos);
    const [selecting, setSelecting] = useState(false);
    const [text, setText] = useState("");
    const [empty, setEmpty] = useState(false);
    const [selected, setSelected] = useState(
        todo_list_selected_value ? todo_list_selected_value : "Select a list"
    );

    const [data, setData] = useState(todo_list_option_value.lists);

    const db = new Dexie("LivelyLists");
    db.version(1).stores({
        lists: `list_id,name,todo,completed,list_id,index`,
    });

    const todoDB = new Dexie("LivelyTodos");
    todoDB.version(1).stores({
        todos: `todo_url,desc,dueDate,category,steps,focustime,index,date_completed,remindMe,notes,todo_url,complete`,
    });

    const style = {
        style1: {
            color: darkMode ? "white" : "black",
            border: darkMode ? "solid 1px  #1A1A1A" : "solid 1px #f0f0f0",
            background: "transparent",
            height: "30px",
        },
        style2: {
            color: darkMode ? "white" : "black",
            border: darkMode ? "solid 1px  #1A1A1A" : "solid 1px #f0f0f0",
            background: "transparent",
            height: "auto",
            maxHeight: "250px",
        },
    };

    const textarea = (c) => {
        if (c) {
            c.focus();
            autosize(c);
        }
    };

    const handleSelect = async (selected) => {
        dispatch(refresh_list_state);
        dispatch(list_timeout_clear);

        if (selected === "Select a list") {
            setSelecting(false);
            setSelected(selected);
            setEmpty(false);
            dispatch(todo_list_selected(null));
            dispatch(navStateHome);

            if (switch_to_add === "add_") {
                if (todos_.length !== 0) {
                    if (back_index === "home" || home_todos.length !== 0) {
                        dispatch(todo_edit({ category: null, todo_url: url }));
                    }
                }

                await todoDB.todos
                    .filter((todo) => todo.todo_url === url)
                    .modify({ category: null });
            }
        } else if (selected === "Create a new list +") {
            setSelecting(false);
            setEmpty(true);
            setText("");
        } else {
            setSelecting(false);
            setSelected(selected);
            setEmpty(false);
            dispatch(todo_list_selected(selected));
            dispatch(navStateHome);

            if (switch_to_add === "add_") {
                if (back_index === "home" || home_todos.length !== 0) {
                    dispatch(todo_edit({ category: selected, todo_url: url }));
                }
                await todoDB.todos
                    .filter((todo) => todo.todo_url === url)
                    .modify({ category: selected });
            }
        }
    };

    const handleInput = (e) => {
        setText(e.target.value);
    };

    const generateID = () => {
        const uuid = uuidv4();
        return `list_${uuid}`;
    };

    const saveInput = async () => {
        if (text.trim() !== "") {
            const index_ = await db.lists
                .filter((list) => list.default === false)
                .count();

            const list = {
                name: text,
                list_id: generateID(),
                index: index_ + 1,
                default: false,
            };

            dispatch(refresh_list_state);

            setData([list, ...data]);
            dispatch(todo_list_option(list));
            dispatch(list_timeout_clear);
            dispatch(navStateHome);

            handleSelect(text);
            setText("");

            await db.lists
                .add(list)
                .then(() => console.log("list added...."))
                .catch((e) => console.log(e));
        }
    };

    const handleDelete = async (metadata) => {
        const { id, name } = metadata;

        setData(data.filter((list) => list.list_id !== id));

        if (home_todos.length !== 0) {
            const has = home_todos.filter((todo) => todo.category === name);
            if (has.length === home_todos.length) {
                dispatch(todos_clear);
            } else {
                dispatch(todos_category_remove(name));
            }
        }

        await db.lists
            .filter((list) => list.list_id === id && list.default === false)
            .delete();

        await todoDB.todos.filter((todo) => todo.category === name).delete();

        dispatch(refresh_list_state);
        dispatch(list_timeout_clear);
        dispatch(navStateHome);

        if (todo_list_selected_value === name) {
            dispatch(todo_list_selected(null));
            history.goBack();
        }
    };

    useEffect(() => {
        let unmounted = false;
        const fetch_lists = async () => {
            const lists = await db.lists
                .filter((list) => list.default === false)
                .toArray();
            dispatch(todo_list_option(lists));

            if (!unmounted) {
                setData(lists);
            }
        };

        fetch_lists();

        return () => {
            unmounted = true;
        };
    }, []);

    return (
        <div className="category">
            <div style={{ marginBottom: "15px", marginLeft: "5px" }}>
                Add to a list
            </div>
            {selecting ? (
                <div className="category_select" style={style.style2}>
                    <Option
                        selected={selected}
                        value="Create a new list +"
                        handleSelect={handleSelect}
                    />

                    <Option
                        selected={selected}
                        value="Select a list"
                        handleSelect={handleSelect}
                    />

                    <hr
                        style={{
                            border: darkMode
                                ? "1px solid rgb(30, 30, 30)"
                                : "1px solid rgb(240, 240, 240)",
                        }}
                    />
                    {data.map((option, index) => {
                        return (
                            <div key={index}>
                                <Option
                                    selected={selected}
                                    value={option.name}
                                    handleSelect={handleSelect}
                                    deleteOption={true}
                                    tag={false}
                                    id={option.list_id}
                                    handleDelete={handleDelete}
                                />
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div
                    className="category_select"
                    style={style.style1}
                    onClick={() => {
                        if (data.length === 0) {
                            setEmpty(true);
                            setSelecting(false);
                        } else {
                            if (text) {
                                setSelecting(false);
                            } else {
                                setSelecting(true);
                            }
                        }
                    }}
                >
                    {!empty ? (
                        <div className="option">
                            <img
                                className="option_image_selected"
                                src={darkMode ? lists_light : lists}
                                alt="selected list"
                            ></img>
                            <div className="option_name">
                                {todo_list_selected_value
                                    ? selected
                                    : data.length === 0
                                    ? "Create a new list +"
                                    : selected}
                            </div>
                        </div>
                    ) : (
                        <div className="option" style={{ padding: "5px 0" }}>
                            <img
                                className="option_image_selected"
                                src={darkMode ? lists_light : lists}
                                style={{ position: "absolute", left: "35px" }}
                                alt="selected list"
                            ></img>
                            <textarea
                                name="new list"
                                ref={(c) => textarea(c)}
                                placeholder="New list name..."
                                className=""
                                style={{
                                    color: darkMode ? "white" : "black",
                                    fontSize: "14px",
                                    paddingLeft: "5px",
                                    marginLeft: "25px",
                                    flex: 2,
                                    outline: 0,
                                    border: 0,
                                    height: "20px",
                                    maxHeight: "30px",
                                    marginTop: "-2px",
                                    background: "transparent",
                                    fontFamily: `"Poppins", san-serif`,
                                }}
                                onChange={handleInput}
                                defaultValue={text}
                            ></textarea>
                            <img
                                className="option_image_selected"
                                style={{ position: "absolute", right: "25px" }}
                                src={
                                    darkMode
                                        ? edit_complete_light
                                        : edit_complete
                                }
                                alt="Add list"
                                onClick={saveInput}
                            ></img>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Category;
