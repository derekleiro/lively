import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Dexie from "dexie";
import { useHistory } from "react-router-dom";
import {
    List,
    AutoSizer,
    CellMeasurer,
    CellMeasurerCache,
} from "react-virtualized";

import {
    clear_list,
    dispatch_list_tasks,
    refresh_list_state,
} from "../../actions/list_feed";
import { mode } from "../../constants/color";

import "./list-view.css";
import Card from "../homefeed/card/Card";

import back_icon from "../../assets/icons/back.png";
import back_icon_light from "../../assets/icons/back_light.png";

import Done from "../done/Done";
import missing_404 from "../../assets/icons/404.png";
import delete_list from "../../assets/icons/delete_item.png";
import { navStateHome } from "../../actions/bottom_nav";
import { todos_category_remove, todos_clear } from "../../actions/add_feed";

import loading from "../../assets/icons/loading.gif";
import {
    add_listview_timeout,
    listview_timeout_clear,
    list_timeout_clear,
} from "../../actions/timeouts";

const ListViewFeed = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const darkMode = useSelector((state) => state.dark_mode);
    const list_info = useSelector((state) => state.list_info);
    const todos_home = useSelector((state) => state.todos.todos);
    const listview_timeout = useSelector((state) => state.listview_timeout);

    const todos_raw = useSelector((state) => state.list_tasks.todos).sort(
        (todoA, todoB) => {
            return todoB.dueDate - todoA.dueDate;
        }
    );
    const todos = todos_raw.sort((todoB, todoA) => {
        return todoB.complete - todoA.complete;
    });

    const [prompt, setPrompt] = useState(false);

    const cache = useRef(
        new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: 100,
        })
    );

    const style = {
        topNav: {
            top: 0,
            height: "45px",
            backgroundColor: darkMode ? mode.dark : mode.light,
            display: "flex",
            alignItems: "center",
            padding: "15px 0 10px 0",
        },
        title: {
            flex: 1,
            paddingLeft: "20px",
        },
        new: {
            flex: 1,
            textAlign: "right",
            paddingRight: "20px",
            fontSize: "14px",
            color: "#1395ff",
        },
    };

    const db = new Dexie("LivelyTodos");
    db.version(1).stores({
        todos: `todo_url,desc,dueDate,category,tag,tag_id,steps,focustime,index,date_completed,remindMe,notes,todo_url,complete`,
    });

    const listDB = new Dexie("LivelyLists");
    listDB.version(1).stores({
        lists: `list_id,name,todo,completed,list_id,index`,
    });

    const handleDelete = async () => {
        if (todos_home.length !== 0) {
            const has = todos_home.filter(
                (todo) => todo.category === list_info.name
            );
            if (has.length === todos_home.length) {
                dispatch(todos_clear);
            } else {
                dispatch(todos_category_remove(list_info.name));
            }
        }

        await listDB.lists
            .filter(
                (list) =>
                    list.list_id === list_info.list_id && list.default === false
            )
            .delete();
        await db.todos
            .filter((todo) => todo.category === list_info.name)
            .delete()
            .then(() => {
                dispatch(refresh_list_state);
                dispatch(list_timeout_clear);
                dispatch(navStateHome);
                history.replace("/lists");
            });
    };

    useEffect(() => {
        const fetchTasks = async () => {
            if (list_info.list_id === "All_default") {
                const todos = await db.todos.toArray();
                dispatch(dispatch_list_tasks(todos));
            } else if (list_info.list_id === "Completed_default") {
                const todos = await db.todos
                    .filter((todo) => todo.complete === 1)
                    .toArray();
                dispatch(dispatch_list_tasks(todos));
            } else if (list_info.list_id === "Important_default") {
                const todos = await db.todos
                    .filter((todo) => todo.important === 1)
                    .toArray();
                dispatch(dispatch_list_tasks(todos));
            } else {
                const todos = await db.todos
                    .filter((todo) => todo.category === list_info.name)
                    .toArray();
                dispatch(dispatch_list_tasks(todos));
            }
        };

        fetchTasks();

        return () => {
            dispatch(clear_list);
            dispatch(navStateHome);
        };
    }, [dispatch]);

    useEffect(() => {
        if (listview_timeout === 0) {
            const timeout = setTimeout(() => {
                dispatch(add_listview_timeout);
                clearTimeout(timeout);
            }, 1500);
        }

        return () => {
            dispatch(listview_timeout_clear);
        };
    }, []);

    return (
        <div className="container">
            <div className="container_top_nav" style={style.topNav}>
                <span className="back_icon">
                    <img
                        src={darkMode ? back_icon_light : back_icon}
                        alt="Go back"
                        onClick={() => history.goBack()}
                    />
                </span>
                <span className="title" style={style.title}>
                    {list_info.name || "Go back & Select a list"}
                </span>
                {list_info.default ? null : (
                    <div style={style.new} onClick={() => setPrompt(true)}>
                        - Delete List
                    </div>
                )}
            </div>

            <div style={{ marginTop: "50px" }}></div>

            {listview_timeout === 0 ? (
                <Done load={true}>
                    <div className="done_options">
                        <img
                            style={{ width: "35px", height: "35px" }}
                            src={loading}
                            alt="Loading your tasks"
                        />
                    </div>
                </Done>
            ) : (
                <>
                    {todos.length === 0 && !prompt ? (
                        <Done>
                            <div className="done_options">
                                <img
                                    style={{ width: "100px", height: "100px" }}
                                    src={missing_404}
                                    alt={`We could not find tasks from the list ${list_info.name}`}
                                />
                                <div className="done_text">
                                    We could not find tasks from the list "
                                    {list_info.name}"
                                </div>
                            </div>
                        </Done>
                    ) : (
                        <>
                            {prompt ? (
                                <Done>
                                    <div className="done_options">
                                        <img
                                            style={{
                                                width: "100px",
                                                height: "100px",
                                            }}
                                            src={delete_list}
                                            alt={`You are about to delete the list "${list_info.name}" are you sure?`}
                                        />
                                        <div className="done_text">
                                            Are you sure you want to delete this
                                            list?
                                            {todos.length !== 0
                                                ? " All the tasks in it will be deleted also"
                                                : null}
                                        </div>
                                        <span
                                            className="action_button"
                                            style={{
                                                margin: "0 30px",
                                                color: "#1395ff",
                                            }}
                                            onClick={handleDelete}
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
                            ) : (
                                <div style={{ width: "auto", height: "100%" }}>
                                    <AutoSizer>
                                        {({ width, height }) => {
                                            return (
                                                <List
                                                    width={width}
                                                    height={height}
                                                    rowHeight={
                                                        cache.current.rowHeight
                                                    }
                                                    deferredMeasurementCache={
                                                        cache.current
                                                    }
                                                    rowCount={todos.length}
                                                    rowRenderer={({
                                                        key,
                                                        index,
                                                        style,
                                                        parent,
                                                    }) => {
                                                        const todo =
                                                            todos[index];
                                                        return (
                                                            <CellMeasurer
                                                                key={
                                                                    todo.todo_url
                                                                }
                                                                cache={
                                                                    cache.current
                                                                }
                                                                parent={parent}
                                                                columnIndex={0}
                                                                rowIndex={index}
                                                            >
                                                                <div
                                                                    style={
                                                                        style
                                                                    }
                                                                >
                                                                    <Card
                                                                        listView={
                                                                            true
                                                                        }
                                                                        cardDesc={
                                                                            todo.desc
                                                                        }
                                                                        dueDate={
                                                                            todo.dueDate
                                                                        }
                                                                        category={
                                                                            todo.category
                                                                        }
                                                                        date_completed={
                                                                            todo.date_completed
                                                                        }
                                                                        tag={
                                                                            todo.tag
                                                                        }
                                                                        tag_id={
                                                                            todo.tag_id
                                                                        }
                                                                        steps={
                                                                            todo
                                                                                .steps
                                                                                .steps
                                                                                ? todo
                                                                                      .steps
                                                                                      .steps
                                                                                : []
                                                                        }
                                                                        remindMe={
                                                                            todo.remindMe
                                                                        }
                                                                        notes={
                                                                            todo
                                                                                .notes
                                                                                .notes
                                                                                ? todo
                                                                                      .notes
                                                                                      .notes
                                                                                : []
                                                                        }
                                                                        focustime={
                                                                            todo.focustime
                                                                        }
                                                                        index={
                                                                            todo.index
                                                                        }
                                                                        URL={
                                                                            todo.todo_url
                                                                        }
                                                                        repeat={
                                                                            todo.repeat
                                                                        }
                                                                        complete={
                                                                            todo.complete
                                                                        }
                                                                        important={
                                                                            todo.important
                                                                        }
                                                                    />
                                                                </div>
                                                            </CellMeasurer>
                                                        );
                                                    }}
                                                />
                                            );
                                        }}
                                    </AutoSizer>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
            <div style={{ marginTop: "15px" }}></div>
        </div>
    );
};

export default ListViewFeed;
