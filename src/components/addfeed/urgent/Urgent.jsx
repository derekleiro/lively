import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dexie from "dexie";

import "./urgent.css";
import Option from "./option/Option";

import urgent from "../../../assets/icons/urgent.png";
import urgent_light from "../../../assets/icons/urgent_light.png";
import {
	reset_urgency,
	set_urgency,
	todo_edit,
} from "../../../actions/add_feed";

const Urgent = () => {
	const dispatch = useDispatch();

	const selected = useSelector((state) => state.task_urgency_state);
	const darkMode = useSelector((state) => state.dark_mode);
	const url = useSelector((state) => state.url);
	const home_todos = useSelector((state) => state.todos.todos);
	const back_index = useSelector((state) => state.back_index);
	const switch_to_add = useSelector((state) => state.addfeed_switch);

	const [selecting, setSelecting] = useState(false);

	const todoDB = new Dexie("LivelyTodos");
	todoDB.version(1).stores({
		todos: `todo_url,desc,dueDate,category,tag,tag_id,steps,focustime,urgent,index,date_completed,remindMe,notes,todo_url,complete`,
	});

	const style = {
		style1: {
			color: darkMode ? "white" : "black",
			border: darkMode ? "solid 1px  #1A1A1A" : "solid 1px #f0f0f0",
			background: "transparent",
			height: "auto",
		},
		style2: {
			color: darkMode ? "white" : "black",
			border: darkMode ? "solid 1px  #1A1A1A" : "solid 1px #f0f0f0",
			background: "transparent",
			height: "auto",
		},
	};

	const handleSelect = async (selected) => {
		if (selected) {
			setSelecting(false);
			if (selected === "Yes") {
				dispatch(set_urgency("Yes"));
			} else {
				dispatch(reset_urgency("No"));
			}
		}

		if (switch_to_add === "add_") {
			if (back_index === "home" && home_todos.length !== 0) {
				dispatch(
					todo_edit({
						urgent: selected,
						todo_url: url,
					})
				);
			}

			await todoDB.todos
				.filter((todo) => {
					return todo.todo_url === url;
				})
				.modify({
					urgent: selected,
				});
		}
	};
	return (
		<div className="category">
			<div style={{ marginBottom: "15px", marginLeft: "5px" }}>
				Is this task urgent?
			</div>

			{selecting ? (
				<div className="category_select" style={style.style2}>
					<Option
						selected={selected}
						value={"Yes"}
						handleSelect={handleSelect}
					/>

					<Option
						selected={selected}
						value={"No"}
						handleSelect={handleSelect}
					/>
				</div>
			) : (
				<div
					className="category_select"
					style={style.style1}
					onClick={() => {
						setSelecting(true);
					}}
				>
					<div className="option">
						<img
							className="option_image_selected"
							src={darkMode ? urgent_light : urgent}
							alt={`his task has been set to ${selected}`}
						></img>
						<div className="option_name">{selected}</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Urgent;
