import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import autosize from "autosize";
import Dexie from "dexie";
import { v4 as uuidv4 } from "uuid";
import { useHistory } from "react-router-dom";

import "./tag.css";

import edit_complete from "../../../assets/icons/edit_complete.png";
import edit_complete_light from "../../../assets/icons/edit_complete_light.png";
import tag from "../../../assets/icons/tag.png";
import tag_light from "../../../assets/icons/tag_light.png";

import Option from "./option/Option";
import {
    todos_clear,
    todos_tag_remove,
    todo_edit,
    todo_tag_option,
    todo_tag_selected,
} from "../../../actions/add_feed";
import { refresh_list_state } from "../../../actions/list_feed";
import { list_timeout_clear } from "../../../actions/timeouts";
import tag_ from "../../../util/tag";
import { navStateHome } from "../../../actions/bottom_nav";
import {
    add_chart_data_tag,
    delete_chart_data_tag,
} from "../../../actions/timer_feed";

const Tag = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const darkMode = useSelector((state) => state.dark_mode);
    const url = useSelector((state) => state.url);
    const home_todos = useSelector((state) => state.todos.todos);
    const back_index = useSelector((state) => state.back_index);
    const edit_mode = useSelector((state) => state.addfeed_switch);
    const todo_tag_option_value = useSelector(
        (state) => state.todo_tag_option.tags
    );
    const todo_tag_selected_value = useSelector((state) =>
        state.todo_tag_selected ? state.todo_tag_selected.tag : null
    );
    const switch_to_add = useSelector((state) => state.addfeed_switch);
    const todos_ = useSelector((state) => state.todos.todos);
    const chartData = useSelector((state) => state.chart_data);
    const [selecting, setSelecting] = useState(false);
    const [text, setText] = useState("");
    const [empty, setEmpty] = useState(false);
    const [selected, setSelected] = useState(
        todo_tag_selected_value ? todo_tag_selected_value : "Select a tag"
    );

    const [data, setData] = useState(todo_tag_option_value);

    const today_timestamp = Date.parse(localStorage.getItem("today_timestamp"));
    const week_timestamp = Date.parse(localStorage.getItem("week_timestamp"));
    const month_timestamp = Date.parse(localStorage.getItem("month_timestamp"));

    const db = new Dexie("LivelyTags");
    db.version(1).stores({
        tags: `id,total_focus,today,week,month`,
    });

    const todoDB = new Dexie("LivelyTodos");
    todoDB.version(1).stores({
        todos: `todo_url,desc,dueDate,category,tag,tag_id,steps,focustime,index,date_completed,remindMe,notes,todo_url,complete`,
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

        const { id, value } = selected;

        if (value === "Select a tag") {
            setSelecting(false);
            setSelected(value);
            setEmpty(false);
            dispatch(todo_tag_selected({ tag: null, id: null }));

            if (switch_to_add === "add_") {
                if (todos_.length !== 0) {
                    if (back_index === "home" || home_todos.length !== 0) {
                        dispatch(
                            todo_edit({
                                tag: null,
                                tag_id: null,
                                todo_url: url,
                            })
                        );
                    }
                }

                await todoDB.todos
                    .filter((todo) => todo.todo_url === url)
                    .modify({ tag: null, tag_id: null });
            }
        } else if (value === "Create a new tag +") {
            setSelecting(false);
            setEmpty(true);
            setText("");
        } else {
            setSelecting(false);
            setSelected(value);
            setEmpty(false);
            dispatch(todo_tag_selected({ tag: value, id }));

            if (switch_to_add === "add_") {
                if (back_index === "home" || home_todos.length !== 0) {
                    dispatch(
                        todo_edit({ tag: value, tag_id: id, todo_url: url })
                    );
                }
                await todoDB.todos
                    .filter((todo) => todo.todo_url === url)
                    .modify({ tag: value, tag_id: id });
            }
        }
    };

    const handleInput = (e) => {
        setText(e.target.value);
    };

    const generateID = () => {
        const uuid = uuidv4();
        return `tag_${uuid}`;
    };

    const saveInput = async () => {
        if (text.trim() !== "") {
            const id = generateID();
            const data_ = {
                id,
                name: text,
                total_focus: 0,
                today: {
                    focused: 0,
                },
                week: {
                    focused: 0,
                },
                month: {
                    focused: 0,
                },
            };

            setData([data_, ...data]);

            const time = {
                today: today_timestamp,
                week: week_timestamp,
                month: month_timestamp,
            };

            tag_(data_, time);
            dispatch(todo_tag_option(data_));

            handleSelect({ value: text, id });

            if (chartData.today !== null || chartData.week !== null) {
                dispatch(
                    add_chart_data_tag({
                        label: text,
                        value: 0,
                        id,
                    })
                );
            }

            setText("");
        } else {
            setSelecting(false);
            setEmpty(false);
        }
    };

    const handleDelete = async (metadata) => {
        const { id, name } = metadata;
        setData(data.filter((tag) => tag.id !== id));
        await db.tags.filter((tag) => tag.id === id).delete();
        await todoDB.todos.filter((todo) => todo.tag === name).delete();

        if (chartData.today !== null || chartData.week !== null) {
            dispatch(delete_chart_data_tag(id));
        }

        if (home_todos.length !== 0) {
            const has = home_todos.filter((todo) => todo.tag === name);
            if (has.length === home_todos.length) {
                dispatch(todos_clear);
            } else {
                dispatch(todos_tag_remove(name));
            }
        }

        if (edit_mode === "add_") {
            if (todo_tag_selected_value === name) {
                history.goBack();
            }
        }

        dispatch(refresh_list_state);
        dispatch(list_timeout_clear);
        dispatch(navStateHome);
    };

    useEffect(() => {
        let unmounted = false;
        const fetch_tags = async () => {
            const tags = await db.tags.toArray();
            dispatch(todo_tag_option(tags));

            if (!unmounted) {
                setData(tags);
            }
        };

        fetch_tags();

        return () => {
            unmounted = true;
        };
    }, []);

    return (
        <div className="category" style={{ marginTop: "25px" }}>
            <div style={{ marginBottom: "15px", marginLeft: "5px" }}>
                Add a tag
            </div>
            {selecting ? (
                <div className="category_select" style={style.style2}>
                    <Option
                        selected={selected}
                        value="Create a new tag +"
                        handleSelect={handleSelect}
                    />

                    <Option
                        selected={selected}
                        value="Select a tag"
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
                                    tag={true}
                                    id={option.id}
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
                                src={darkMode ? tag_light : tag}
                                alt="selected tag"
                            ></img>
                            <div className="option_name">
                                {todo_tag_selected_value
                                    ? selected
                                    : data.length === 0
                                    ? "Create a new tag +"
                                    : selected}
                            </div>
                        </div>
                    ) : (
                        <div className="option" style={{ padding: "5px 0" }}>
                            <img
                                className="option_image_selected"
                                src={darkMode ? tag_light : tag}
                                style={{ position: "absolute", left: "35px" }}
                                alt="selected tag"
                            ></img>
                            <textarea
                                name="new tag"
                                ref={(c) => textarea(c)}
                                placeholder="New tag name..."
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
                                alt="Add tag"
                                onClick={saveInput}
                            ></img>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Tag;
