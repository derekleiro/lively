import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import autosize from "autosize";
import { v4 as uuidv4 } from "uuid";
import Dexie from "dexie";
import confetti from "canvas-confetti";
import { Howl } from "howler";
import { Plugins } from "@capacitor/core";
import moment from "moment";

import "./text-bar.css";

import edit_complete from "../../../assets/icons/edit_complete.png";
import edit_complete_light from "../../../assets/icons/edit_complete_light.png";
import plus from "../../../assets/icons/plus.png";
import plus_light from "../../../assets/icons/plus_light.png";
import star from "../../../assets/icons/star.png";
import star_light from "../../../assets/icons/star_light.png";
import star_active from "../../../assets/icons/star_active.png";
import todo_incomplete from "../../../assets/icons/todo_incomplete.png";
import todo_incomplete_light from "../../../assets/icons/todo_incomplete_light.png";
import todo_complete_icon from "../../../assets/icons/todo_complete.png";
import goal_icon from "../../../assets/icons/goal.png";
import goal_icon_light from "../../../assets/icons/goal_light.png";

import completed_sound from "../../../assets/sounds/for-sure.ogg";

import Step from "./Step";
import {
	goal_edit,
	reset_date_completed,
	handle_date_completed,
	textarea_state,
	todos,
	todo_complete_set,
	todo_desc,
	todo_edit,
	todo_important_set,
	todo_steps,
} from "../../../actions/add_feed";
import repeat from "../../../util/repeat";
import {
	set_list_complete,
	set_list_important,
} from "../../../util/new_default_lists";
import {
	important_complete_timeout,
	important_complete_timeout_reset,
	list_timeout_clear,
	task_complete_timeout,
	task_complete_timeout_reset,
} from "../../../actions/timeouts";
import add_month from "../../../util/add_month";
import { stats_add } from "../../../util/stats_add";
import { reset_timer_feed } from "../../../actions/timer_feed";
import {
	remove_notification,
	schedule_notification,
} from "../../../util/notifications";
import { refresh_list_state } from "../../../actions/list_feed";
import { navStateHome } from "../../../actions/bottom_nav";
import { encouragements } from "../../../constants/encouragements";

const sound = new Howl({
	src: [completed_sound],
	html5: true,
	preload: true,
	format: ["ogg"],
});

const TextBar = (props) => {
	const { Toast } = Plugins;

	const dispatch = useDispatch();
	const darkMode = useSelector((state) => state.dark_mode);
	const todo_desc_text = useSelector((state) => state.todo_desc);
	const switch_state = useSelector((state) => state.textarea_state);
	const Steps = useSelector((state) => state.todo_steps.steps);
	const home_todos = useSelector((state) => state.todos.todos);
	const home_goals = useSelector((state) => state.goals.goals);
	const url = useSelector((state) => state.url);
	const back_index = useSelector((state) => state.back_index);

	const task_complete = useSelector((state) => state.task_complete);
	const important_complete = useSelector((state) => state.important_complete);

	const todo_complete_set_state = useSelector(
		(state) => state.todo_complete_set
	);
	const todo_important_set_state = useSelector(
		(state) => state.todo_important_set
	);
	const switch_to_add = useSelector((state) => state.addfeed_switch);

	const completedTask = todo_complete_set_state;
	const starred = todo_important_set_state;

	const [text, setText] = useState(todo_desc_text ? todo_desc_text : "");
	const [checked, setChecked] = useState(false);
	const [allowed, setAllowed] = useState(false);

	const todoDB = new Dexie("LivelyTodos");
	todoDB.version(1).stores({
		todos: `todo_url,desc,dueDate,category,tag,tag_id,steps,focustime,urgent,index,date_completed,remindMe,notes,todo_url,complete`,
	});

	const goalDB = new Dexie("LivelyGoals");
	goalDB.version(1).stores({
		goals: `goal_url,title,desc,steps,notes,focustime,tag,tag_id,deadline,date_completed,goal_url,complete`,
	});

	const generateURL = () => {
		const uuid = uuidv4();
		return `step_${uuid}`;
	};

	const handleClick = () => {
		setAllowed(true);
		setChecked(true);
		dispatch(todo_steps({ text: "", id: generateURL(), complete: 0 }));
	};

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

	const celebration = {
		wohoo: () => {
			const count = 200;
			const defaults = {
				origin: { y: 0.7 },
			};

			const fire = (particleRatio, opts) => {
				confetti(
					Object.assign({}, defaults, opts, {
						particleCount: Math.floor(count * particleRatio),
					})
				);
			};

			fire(0.25, {
				spread: 26,
				startVelocity: 55,
			});
			fire(0.2, {
				spread: 60,
			});
			fire(0.35, {
				spread: 100,
				decay: 0.91,
				scalar: 0.8,
			});
			fire(0.1, {
				spread: 120,
				startVelocity: 25,
				decay: 0.92,
				scalar: 1.2,
			});
			fire(0.1, {
				spread: 120,
				startVelocity: 45,
			});
		},
	};

	const handleChecked = (checked) => {
		if (checked) {
			setChecked(true);
		} else {
			setChecked(false);
		}
	};

	const textarea = (c) => {
		if (c) {
			c.focus();
			autosize(c);
		}
	};

	const handleInput = (e) => {
		e.target.value = e.target.value.replace(/[\r\n\v]+/g, "");
		setText(e.target.value);
	};

	const saveInput = async () => {
		if (text.trim() !== "") {
			dispatch(textarea_state(true));
			dispatch(todo_desc(text));

			if (switch_to_add === "add_") {
				if (back_index === "home" && home_todos.length !== 0) {
					dispatch(
						todo_edit({
							desc: text,
							todo_url: url,
						})
					);
				}

				await todoDB.todos
					.filter((todo) => {
						return todo.todo_url === url;
					})
					.modify({
						desc: text,
					});
			} else if (switch_to_add === "goal_") {
				if (home_goals.length !== 0) {
					dispatch(
						goal_edit({
							title: text,
							goal_url: url,
						})
					);
				}

				await goalDB.goals
					.filter((goal) => {
						return goal.goal_url === url;
					})
					.modify({
						title: text,
					});
			}
		}
	};

	const set_task_incomplete = async () => {
		dispatch(todo_complete_set(0));

		if (switch_to_add === "add_") {
			await todoDB.todos
				.filter((todo) => {
					return todo.todo_url === url;
				})
				.modify((todo) => {
					if (back_index === "home" && home_todos.length !== 0) {
						dispatch(
							todo_edit({
								complete: 0,
								todo_url: url,
							})
						);
					}

					add_month(new Date());
					stats_add({
						date: new Date(),
						tasks: 0,
						goals: 0,
						total: 0,
						todos_count: -1,
						goals_count: 0,
						tag: null,
					});

					dispatch(reset_timer_feed);

					if (todo.remindMe) {
						schedule_notification(
							todo.remindMe.timestamp,
							todo.desc,
							todo.index,
							{
								text: todo.desc,
								focustime: 0,
								url: todo.todo_url,
								type: "task",
								steps: todo.steps.steps,
								tag: todo.tag,
								tag_id: todo.tag_id,
							}
						);
					}

					todo.complete = 0;
					todo.date_completed = null;

					dispatch(reset_date_completed);
				});
		}
	};

	const set_task_complete = async () => {
		dispatch(todo_complete_set(1));
		set_list_complete();
		if (switch_to_add === "add_") {
			await todoDB.todos
				.filter((todo) => {
					return todo.todo_url === url;
				})
				.modify((todo) => {
					const new_date = new Date();
					todo.complete = 1;
					todo.date_completed = new_date;

					dispatch(handle_date_completed(new_date));

					if (back_index === "home" && home_todos.length !== 0) {
						dispatch(
							todo_edit({
								complete: 1,
								todo_url: url,
							})
						);
					}

					add_month(new Date());

					stats_add({
						date: new Date(),
						tasks: 0,
						goals: 0,
						total: 0,
						todos_count: 1,
						goals_count: 0,
						tag: null,
					});

					dispatch(reset_timer_feed);

					remove_notification(todo.index);

					repeat({
						repeat: todo.repeat,
						todo_url: url,
						desc: todo.desc,
						dueDate: todo.dueDate,
						date_completed: todo.date_completed,
						category: todo.category,
						tag: todo.tag,
						tag_id: todo.tag_id,
						steps: { steps: todo.steps.steps },
						focustime: todo.focustime,
						index: todo.index,
						remindMe: todo.remindMe,
						notes: { notes: todo.notes.notes },
						complete: todo.complete,
						important: todo.important,
						urgent: todo.urgent ? todo.urgent : "No",
					}).then((data) => {
						if (data) {
							dispatch(todos(data));
						}
					});
				});

			celebration.wohoo();
			sound.play();

			await Toast.show({
				text: encouragements[Math.floor(Math.random() * encouragements.length)],
				duration: "short",
				position: "bottom",
			});
		}
	};

	const handleCompletedTask = async () => {
		dispatch(task_complete_timeout);
		dispatch(refresh_list_state);
		dispatch(list_timeout_clear);
		dispatch(navStateHome);

		if (todo_complete_set_state) {
			set_task_incomplete();
		} else {
			set_task_complete();
		}

		const complete_timeout = setTimeout(() => {
			dispatch(task_complete_timeout_reset);
			clearTimeout(complete_timeout);
		}, 800);
	};

	const handleImportantCheck = async () => {
		dispatch(important_complete_timeout);
		dispatch(refresh_list_state);
		dispatch(list_timeout_clear);
		dispatch(navStateHome);

		if (todo_important_set_state) {
			dispatch(todo_important_set(0));
			if (switch_to_add === "add_") {
				if (back_index === "home" && home_todos.length !== 0) {
					dispatch(
						todo_edit({
							important: 0,
							todo_url: url,
						})
					);
				}

				await todoDB.todos
					.filter((todo) => {
						return todo.todo_url === url;
					})
					.modify({
						important: 0,
					});
			}
		} else {
			dispatch(todo_important_set(1));
			set_list_important();
			if (switch_to_add === "add_") {
				if (back_index === "home" && home_todos.length !== 0) {
					dispatch(
						todo_edit({
							important: 1,
							todo_url: url,
						})
					);
				}

				await todoDB.todos
					.filter((todo) => {
						return todo.todo_url === url;
					})
					.modify({
						important: 1,
					});
			}
		}

		const important_timeout = setTimeout(() => {
			dispatch(important_complete_timeout_reset);
			clearTimeout(important_timeout);
		}, 800);
	};

	const editInput = () => {
		dispatch(textarea_state(false));
	};

	const manageEdits = () => {
		if (!allowed) {
			setAllowed(true);
		} else {
			setAllowed(false);
		}
	};

	const finishEdit = () => {
		setAllowed(false);
	};

	return (
		<div className="text_bar">
			<div className="card" style={{ display: "flex", margin: "35px 0" }}>
				<div
					className="card-completed"
					style={{ flex: 0, marginRight: "10px" }}
				>
					<img
						onClick={
							task_complete ||
							switch_to_add === "goal" ||
							switch_to_add === "goal_"
								? null
								: handleCompletedTask
						}
						src={
							props.goal
								? darkMode
									? goal_icon_light
									: goal_icon
								: completedTask
								? todo_complete_icon
								: darkMode
								? todo_incomplete_light
								: todo_incomplete
						}
						alt="complete"
						style={{ width: "22.5px", height: "22.5px" }}
					/>
				</div>
				<div
					className="card-content"
					style={{ flex: 9, margin: "0 7.5px" }}
					onClick={checked ? null : editInput}
				>
					{switch_state ? (
						<div
							className="card-desc"
							style={{
								textDecoration: completedTask ? "line-through" : "none",
								fontSize: "16px",
							}}
						>
							{text}
						</div>
					) : (
						<textarea
							ref={(c) => textarea(c)}
							placeholder={
								props.goal ? "What do you want to achieve?" : "New task.."
							}
							className="text_bar_step_textarea"
							style={{
								color: darkMode ? "white" : "black",
								fontSize: "16px",
								height: "auto",
								outline: 0,
								boxShadow: 0,
								border: 0,
								width: "100%",
								maxWidth: "100%",
								minWidth: "100%",
								background: "transparent",
								fontFamily: `"Poppins", sans-serif`,
								marginTop: 0,
								maxHeight: "250px",
								resize: " none",
								borderRadius: 0,
							}}
							onChange={handleInput}
							defaultValue={text}
						></textarea>
					)}
				</div>
				{!props.goal ? (
					<div className="card-star">
						{!switch_state ? (
							<img
								src={darkMode ? edit_complete_light : edit_complete}
								alt="edit task"
								style={{
									width: "20px",
									marginTop: "2px",
									verticalAlign: "middle",
									height: "20px",
								}}
								onClick={saveInput}
							></img>
						) : (
							<img
								src={starred ? star_active : darkMode ? star_light : star}
								alt="Important task"
								style={{
									width: "20px",
									marginTop: "2px",
									verticalAlign: "middle",
									height: "20px",
								}}
								onClick={important_complete ? null : handleImportantCheck}
							></img>
						)}
					</div>
				) : (
					<div className="card-star">
						{!switch_state ? (
							<img
								src={darkMode ? edit_complete_light : edit_complete}
								alt="edit task"
								style={{
									width: "20px",
									marginTop: "2px",
									verticalAlign: "middle",
									height: "20px",
								}}
								onClick={saveInput}
							></img>
						) : null}
					</div>
				)}
			</div>

			{Steps.map((step, index) => {
				return (
					<div key={index}>
						<Step
							index={index}
							goal={props.goal}
							text={step.text}
							switched={switch_state}
							allowed={allowed}
							checkedHandler={handleChecked}
							editsHandler={manageEdits}
							finishHandler={finishEdit}
							id={step.id}
							complete={step.complete}
						/>
					</div>
				);
			})}

			{checked && allowed ? null : (
				<div
					className="textarea_steps"
					onClick={!switch_state ? null : handleClick}
				>
					<span className="text_bar_plus_icon">
						<img src={darkMode ? plus_light : plus} alt="Add a new task" /> Add
						step
					</span>
				</div>
			)}
		</div>
	);
};

export default TextBar;
