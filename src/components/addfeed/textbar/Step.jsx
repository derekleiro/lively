import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import autosize from "autosize";
import Dexie from "dexie";

import edit_complete from "../../../assets/icons/edit_complete.png";
import edit_complete_light from "../../../assets/icons/edit_complete_light.png";

import delete_icon from "../../../assets/icons/delete.png";
import delete_icon_light from "../../../assets/icons/delete_light.png";
import cancel_icon from "../../../assets/icons/back.png";
import cancel_icon_light from "../../../assets/icons/back_light.png";
import todo_incomplete from "../../../assets/icons/todo_incomplete.png";
import todo_incomplete_light from "../../../assets/icons/todo_incomplete_light.png";
import todo_complete_icon from "../../../assets/icons/todo_complete.png";
import {
	todo_edit_step,
	todo_step_delete,
	todo_step_complete,
	todo_edit,
	goal_edit,
} from "../../../actions/add_feed";

const Step = (props) => {
	const dispatch = useDispatch();
	const darkMode = useSelector((state) => state.dark_mode);
	const url = useSelector((state) => state.url);
	const switch_to_add = useSelector((state) => state.addfeed_switch);
	const home_todos = useSelector((state) => state.todos.todos);
	const goals_state = useSelector((state) => state.goals.goals);
	const completed_goals_state = useSelector(
		(state) => state.completed_goals.completed
	);
	const back_index = useSelector((state) => state.back_index);
	const todo_steps_state = useSelector((state) => state.todo_steps.steps);

	const [checked, setChecked] = useState(props.complete);
	const [text, setText] = useState(props.text !== "" ? props.text : "");
	const [second_edit, setSecondEdit] = useState(false);
	const [edit, setEdit] = useState(props.text === "" ? true : false);

	const todoDB = new Dexie("LivelyTodos");
	todoDB.version(1).stores({
		todos: `todo_url,desc,dueDate,category,tag,tag_id,steps,focustime,urgent,index,date_completed,remindMe,notes,todo_url,complete`,
	});

	const goalDB = new Dexie("LivelyGoals");
	goalDB.version(1).stores({
		goals: `goal_url,title,desc,steps,notes,focustime,tag,tag_id,deadline,date_completed,goal_url,complete`,
	});

	const edit_steps = async (data, new_) => {
		if (switch_to_add === "add_") {
			if (back_index === "home" && home_todos.length !== 0) {
				dispatch(
					todo_edit({
						steps: {
							steps: todo_steps_state,
						},
						todo_url: url,
					})
				);
			}

			await todoDB.todos
				.filter((todo) => {
					return todo.todo_url === url;
				})
				.modify((todo) => {
					if (new_) {
						todo.steps.steps.push(data);
					} else {
						todo.steps.steps[data.index].text = data.text;
					}
				});
		} else if (switch_to_add === "goal_") {
			if (goals_state.length !== 0) {
				dispatch(
					goal_edit({
						steps: {
							steps: todo_steps_state,
						},
						goal_url: url,
					})
				);
			}

			await goalDB.goals
				.filter((goal) => {
					return goal.goal_url === url;
				})
				.modify((goal) => {
					if (new_) {
						goal.steps.steps.push(data);
					} else {
						goal.steps.steps[data.index].text = data.text;
					}
				});
		}
	};

	const handleSetCompletedStep = async (step) => {
		if (switch_to_add === "add_") {
			await todoDB.todos
				.filter((todo) => {
					return todo.todo_url === url;
				})
				.modify((todo) => {
					const steps = todo.steps.steps;
					steps[step.index].complete = step.complete;
				});
		} else if (switch_to_add === "goal_") {
			await goalDB.goals
				.filter((goal) => {
					return goal.goal_url === url;
				})
				.modify((goal) => {
					const steps = goal.steps.steps;
					steps[step.index].complete = step.complete;
				});
		}
	};

	const handleCompletedClick = async () => {
		if (checked) {
			setChecked(false);
			const step = {
				index: props.index,
				complete: 0,
			};
			dispatch(todo_step_complete(step));
			handleSetCompletedStep(step);
		} else {
			setChecked(true);
			const step = {
				index: props.index,
				complete: 1,
			};
			dispatch(todo_step_complete(step));
			handleSetCompletedStep(step);
		}
	};

	const handleInput = (e) => {
		e.target.value = e.target.value.replace(/[\r\n\v]+/g, "");
		setText(e.target.value);
	};

	const handleEdit = () => {
		if (props.switched && props.allowed === false) {
			props.editsHandler();
			props.checkedHandler(true);
			setEdit(true);
		}
	};

	const textarea = (c) => {
		if (c) {
			c.focus();
			autosize(c);
		}
	};

	const removeStep = async (id) => {
		if (switch_to_add === "add_") {
			await todoDB.todos
				.filter((todo) => {
					return todo.todo_url === url;
				})
				.modify((todo) => {
					todo.steps.steps = todo.steps.steps.filter((step) => step.id !== id);
				});
		} else if (switch_to_add === "goal_") {
			await goalDB.goals
				.filter((goal) => {
					return goal.goal_url === url;
				})
				.modify((goal) => {
					goal.steps.steps = goal.steps.steps.filter((step) => step.id !== id);
				});
		}
	};

	const handleFinishEdit = async () => {
		if (text.trim() !== "" && !props.text && !second_edit) {
			props.finishHandler();
			props.checkedHandler(false);
			setEdit(false);
			setSecondEdit(true);

			dispatch(
				todo_edit_step({
					text,
					index: props.index,
					complete: 0,
				})
			);

			edit_steps({ text, id: props.id, complete: 0 }, true);
		} else if (text.trim() !== "") {
			props.finishHandler();
			props.checkedHandler(false);

			setEdit(false);

			dispatch(
				todo_edit_step({
					text,
					index: props.index,
					complete: props.complete,
				})
			);

			edit_steps(
				{
					text,
					id: props.id,
					index: props.index,
					complete: props.complete,
				},
				false
			);
		} else {
			props.finishHandler();
			props.checkedHandler(false);
			setEdit(false);
			setChecked(false);

			dispatch(todo_step_delete({ id: props.id }));

			if (switch_to_add === "add_" || switch_to_add === "goal_") {
				removeStep(props.id);

				if (switch_to_add === "add_") {
					if (back_index === "home" && home_todos.length !== 0) {
						dispatch(
							todo_edit({
								step_edit: true,
								step_id: props.id,
								todo_url: url,
							})
						);
					}
				}

				if (switch_to_add === "goal_" && goals_state.length !== 0) {
					dispatch(
						goal_edit({
							step_edit: true,
							step_id: props.id,
							goal_url: url,
						})
					);
				}
			}
		}
	};

	const handleDelete = () => {
		setChecked(false);
		dispatch(todo_step_delete({ id: props.id }));

		if (switch_to_add === "add_" || switch_to_add === "goal_") {
			if (switch_to_add === "add_" && home_todos.length !== 0) {
				dispatch(
					todo_edit({
						step_edit: true,
						step_id: props.id,
						todo_url: url,
					})
				);
			} else {
				if (goals_state.length !== 0) {
					dispatch(
						goal_edit({
							step_edit: true,
							step_id: props.id,
							goal_url: url,
						})
					);
				}
			}
			removeStep(props.id);
		}
	};

	return (
		<div className="card">
			<div className="card-completed">
				<img
					onClick={handleCompletedClick}
					src={
						checked
							? todo_complete_icon
							: darkMode
							? todo_incomplete_light
							: todo_incomplete
					}
					alt="complete"
					style={{ width: "22.5px", height: "22.5px" }}
				/>
			</div>
			<div className="card-content" onClick={handleEdit}>
				{props.text && !edit ? (
					<div
						className="card-desc"
						style={{
							textDecoration: checked ? "line-through" : "none",
							fontSize: "14px",
						}}
					>
						{props.text}
					</div>
				) : text && !edit ? (
					<div
						className="card-desc"
						style={{
							textDecoration: checked ? "line-through" : "none",
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
						placeholder={
							props.goal ? "New step towards your goal..." : "New step.."
						}
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
						alt="Edit the step task"
					></img>
				) : (
					<img
						src={darkMode ? delete_icon_light : delete_icon}
						onClick={handleDelete}
						alt="Delete the step"
					></img>
				)}
			</div>
		</div>
	);
};

export default Step;
