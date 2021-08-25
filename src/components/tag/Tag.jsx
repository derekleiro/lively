import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import autosize from "autosize";
import Dexie from "dexie";
import { v4 as uuidv4 } from "uuid";
import { useHistory } from "react-router-dom";

import "./tag.css";

import edit_complete from "../../assets/icons/edit_complete.png";
import edit_complete_light from "../../assets/icons/edit_complete_light.png";
import tag from "../../assets/icons/tag.png";
import tag_light from "../../assets/icons/tag_light.png";

import Option from "./option/Option";
import {
	goals_tag_clear,
	goal_edit,
	todos_clear,
	todos_tag_remove,
	todo_edit,
	todo_tag_option,
	todo_tag_selected,
} from "../../actions/add_feed";
import { refresh_list_state } from "../../actions/list_feed";
import { list_timeout_clear } from "../../actions/timeouts";
import tag_ from "../../util/tag";
import { navStateHome } from "../../actions/bottom_nav";
import { reset_timer_feed } from "../../actions/timer_feed";
import { focus_info } from "../../actions/focus_feed";

const Tag = (props) => {
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
	const focus_info_state = useSelector((state) => state.focus_info);
	const switch_to_add = useSelector((state) => state.addfeed_switch);
	const todos_ = useSelector((state) => state.todos.todos);
	const goals_ = useSelector((state) => state.goals.goals);
	const [selecting, setSelecting] = useState(false);
	const [text, setText] = useState("");
	const [empty, setEmpty] = useState(false);
	const [selected, setSelected] = useState(
		todo_tag_selected_value ? todo_tag_selected_value : "Select a tag"
	);

	const [data, setData] = useState(todo_tag_option_value);

	const db = new Dexie("LivelyTags");
	db.version(1).stores({
		tags: `id,total_focus,today,week,month`,
	});

	const todoDB = new Dexie("LivelyTodos");
	todoDB.version(1).stores({
		todos: `todo_url,desc,dueDate,category,tag,tag_id,steps,focustime,urgent,index,date_completed,remindMe,notes,todo_url,complete`,
	});

	const goalDB = new Dexie("LivelyGoals");
	goalDB.version(1).stores({
		goals: `goal_url,title,desc,steps,notes,focustime,tag,tag_id,deadline,date_completed,goal_url,complete`,
	});

	const logDB = new Dexie("LivelyLogs");
	logDB.version(1).stores({
		logs: "date, tasks, goals, total, todos_count, graph, goals_count",
	});

	const style = {
		style1: {
			color: darkMode ? "white" : "black",
			border: darkMode ? "solid 1px  #1A1A1A" : "solid 1px #f0f0f0",
			background: "transparent",
			height: "30px",
			maxHeight: "300px",
			width: "auto",
			outline: "0",
			fontFamily: `"Poppins", sans-serif`,
			padding: "7.5px 40px 7.5px 15px",
			overflow: "auto",
			borderRadius: "35px",
		},
		style2: {
			color: darkMode ? "white" : "black",
			border: darkMode ? "solid 1px  #1A1A1A" : "solid 1px #f0f0f0",
			background: "transparent",
			height: "auto",
			maxHeight: "250px",
			width: "auto",
			outline: "0",
			fontFamily: `"Poppins", sans-serif`,
			padding: "7.5px 40px 7.5px 15px",
			overflow: "auto",
			borderRadius: "35px",
		},
	};

	const textarea = (c) => {
		if (c) {
			c.focus();
			autosize(c);
		}
	};

	// TODO Finish the goal implementation
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
				if (todos_.length !== 0 || back_index === "home") {
					dispatch(
						todo_edit({
							tag: null,
							tag_id: null,
							todo_url: url,
						})
					);
				}
				await todoDB.todos
					.filter((todo) => todo.todo_url === url)
					.modify({ tag: null, tag_id: null });
			} else if (switch_to_add === "goal_") {
				if (goals_.length !== 0) {
					dispatch(
						goal_edit({
							tag: null,
							tag_id: null,
							goal_url: url,
						})
					);
				}
				await goalDB.goals
					.filter((goal) => goal.goal_url === url)
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

			if (props.focus) {
				dispatch(
					focus_info({
						...focus_info_state,
						tag: value,
						tag_id: id,
					})
				);
			}

			if (switch_to_add === "add_") {
				if (back_index === "home" && home_todos.length !== 0) {
					dispatch(todo_edit({ tag: value, tag_id: id, todo_url: url }));
				}
				await todoDB.todos
					.filter((todo) => todo.todo_url === url)
					.modify({ tag: value, tag_id: id });
			} else if (switch_to_add === "goal_") {
				if (goals_.length !== 0) {
					dispatch(
						goal_edit({
							tag: value,
							tag_id: id,
							goal_url: url,
						})
					);
				}
				await goalDB.goals
					.filter((goal) => goal.goal_url === url)
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
			};

			setData([data_, ...data]);

			tag_(data_);
			dispatch(todo_tag_option(data_));

			handleSelect({ value: text, id });
			dispatch(reset_timer_feed);

			setText("");
		} else {
			setSelecting(false);
			setEmpty(false);
		}
	};

	const handleDelete = async (metadata) => {
		const { id, name } = metadata;
		setData((current) => current.filter((tag) => tag.id !== id));
		await logDB.logs.toCollection().modify((log) => {
			log.graph = log.graph.filter((tag) => tag.id !== id);
		});
		await db.tags.filter((tag) => tag.id === id).delete();
		await todoDB.todos.filter((todo) => todo.tag === name).delete();
		await goalDB.goals
			.filter((goal) => goal.tag === name)
			.modify({ tag: null, tag_id: null });

		dispatch(reset_timer_feed);

		if (todos_.length !== 0) {
			const has = todos_.filter((todo) => todo.tag === name);
			if (has.length === home_todos.length) {
				dispatch(todos_clear);
			} else {
				dispatch(todos_tag_remove(name));
			}
		}

		if (goals_.length !== 0) {
			dispatch(goals_tag_clear(name));
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
				{!props.focus && !props.log && "Add a tag"}
				{props.focus && !props.log && "What are you focusing on?"}
				{props.log && "I was focusing on: "}
			</div>
			{selecting ? (
				<div style={style.style2}>
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
								src={darkMode ? edit_complete_light : edit_complete}
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
