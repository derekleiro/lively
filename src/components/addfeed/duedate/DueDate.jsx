import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Dexie from "dexie";
import { DatePicker } from "@ionic-native/date-picker";

import "./due-date.css";

import due from "../../../assets/icons/due.png";
import due_light from "../../../assets/icons/due_light.png";

import Option from "./option/Option";
import { todo_due_date, todo_edit } from "../../../actions/add_feed";

const DueDate = () => {
	const dispatch = useDispatch();
	const darkMode = useSelector((state) => state.dark_mode);
	const todo_due_date_state = useSelector((state) => state.todo_due_date);
	const home_todos = useSelector((state) => state.todos.todos);
	const url = useSelector((state) => state.url);
	const back_index = useSelector((state) => state.back_index);
	const switch_to_add = useSelector((state) => state.addfeed_switch);

	const setTime = (timestamp) => {
		if (moment(timestamp).calendar().includes("Yesterday")) {
			return "Yesterday";
		} else if (moment(timestamp).calendar().includes("Today")) {
			return "Today";
		} else if (moment(timestamp).calendar().includes("Tomorrow")) {
			return "Tomorrow";
		} else {
			return moment(timestamp).format("ddd MMMM Do YYYY");
		}
	};

	const todoDB = new Dexie("LivelyTodos");
	todoDB.version(1).stores({
		todos: `todo_url,desc,dueDate,category,tag,tag_id,steps,focustime,urgent,index,date_completed,remindMe,notes,todo_url,complete`,
	});

	const [selecting, setSelecting] = useState(false);
	const [selected, setSelected] = useState(
		todo_due_date_state ? setTime(todo_due_date_state) : null
	);
	const [selectDate, setSelectDate] = useState(false);
	const [selectedDate, setSelectedDate] = useState(null);

	const style = {
		style1: {
			color: darkMode ? "white" : "black",
			border: darkMode ? "solid 1px  #1A1A1A" : "solid 1px #f0f0f0",
			background: "transparent",
			height: "auto",
			padding: "7.5px 7.5px 7.5px 15px",
		},
		style2: {
			color: darkMode ? "white" : "black",
			border: darkMode ? "solid 1px  #1A1A1A" : "solid 1px #f0f0f0",
			background: "transparent",
			height: "auto",
		},
	};

	useEffect(() => {
		if (!todo_due_date_state) {
			dispatch(todo_due_date(new Date()));
			setSelected(setTime(new Date()));
		}
	}, [dispatch, todo_due_date_state]);

	const handleSelectedDate = async (selected) => {
		setSelectedDate(selected);
		dispatch(todo_due_date(selected ? selected : null));

		if (switch_to_add === "add_") {
			if (back_index === "home" && home_todos.length !== 0) {
				dispatch(
					todo_edit({
						dueDate: selected,
						todo_url: url,
					})
				);
			}

			await todoDB.todos
				.filter((todo) => {
					return todo.todo_url === url;
				})
				.modify({
					dueDate: selected,
				});
		}
	};

	const handleDatePick = () => {
		DatePicker.show({
			date: new Date(),
			mode: "date",
			cancelButtonColor: "#1395ff",
			doneButtonColor: "#1395ff",
			androidTheme: darkMode
				? DatePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_DARK
				: DatePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
		}).then(
			(date) => handleSelectedDate(date),
			(err) => console.log("Error occurred while getting date: ", err)
		);
	};

	const handleSelect = async (selected) => {
		if (selected === "Pick a date") {
			setSelectDate(true);
			handleDatePick();
		} else {
			setSelecting(false);
			setSelected(selected);

			if (selected === "Today") {
				dispatch(todo_due_date(new Date()));

				if (switch_to_add === "add_") {
					if (back_index === "home" && home_todos.length !== 0) {
						dispatch(
							todo_edit({
								dueDate: new Date(),
								todo_url: url,
							})
						);
					}

					await todoDB.todos
						.filter((todo) => {
							return todo.todo_url === url;
						})
						.modify({
							dueDate: new Date(),
						});
				}
			} else if (selected === "Tomorrow") {
				dispatch(todo_due_date(new Date().setDate(new Date().getDate() + 1)));

				if (switch_to_add === "add_") {
					if (back_index === "home" && home_todos.length !== 0) {
						dispatch(
							todo_edit({
								dueDate: new Date().setDate(new Date().getDate() + 1),
								todo_url: url,
							})
						);
					}

					await todoDB.todos
						.filter((todo) => {
							return todo.todo_url === url;
						})
						.modify({
							dueDate: new Date().setDate(new Date().getDate() + 1),
						});
				}
			} else {
				dispatch(todo_due_date(selected ? selected : null));
			}
		}
	};

	return (
		<div className="category" style={{ marginTop: "35px" }}>
			<div style={{ marginBottom: "15px", marginLeft: "5px" }}>
				Add due date
			</div>
			{selectDate ? (
				<div
					className="category_select"
					style={style.style1}
					onClick={() => {
						if (selectedDate) {
							setSelectedDate(null);
						}
					}}
				>
					<div
						className="option"
						onClick={() => {
							if (!selectedDate) {
								setSelectDate(false);
								setSelectedDate(null);
							}
						}}
					>
						<img
							className="option_image_selected"
							src={darkMode ? due_light : due}
							alt="selected category"
						></img>
						<div className="option_name">
							{selectedDate ? setTime(todo_due_date_state) : "Select a date"}
						</div>
					</div>
				</div>
			) : selecting ? (
				<div className="category_select" style={style.style2}>
					<Option
						selected={selected}
						value={"Today"}
						handleSelect={handleSelect}
					/>

					<Option
						selected={selected}
						value={"Tomorrow"}
						handleSelect={handleSelect}
					/>

					<Option
						selected={selected}
						value={"Pick a date"}
						handleSelect={handleSelect}
						onClick={handleDatePick}
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
							src={darkMode ? due_light : due}
							alt="selected category"
						></img>
						<div className="option_name">{selected}</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default DueDate;
