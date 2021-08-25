import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Dexie from "dexie";
import { DatePicker } from "@ionic-native/date-picker";

import "./deadline.css";

import due from "../../../assets/icons/due.png";
import due_light from "../../../assets/icons/due_light.png";

import Option from "./option/Option";
import { goal_deadline, goal_edit } from "../../../actions/add_feed";

const Deadline = () => {
	const dispatch = useDispatch();
	const darkMode = useSelector((state) => state.dark_mode);
	const goal_deadline_state = useSelector((state) => state.goal_deadline);
	const home_goals = useSelector((state) => state.goals.goals);
	const url = useSelector((state) => state.url);
	const switch_to_add = useSelector((state) => state.addfeed_switch);
	const back_index = useSelector((state) => state.back_index);

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

	const goalDB = new Dexie("LivelyGoals");
	goalDB.version(1).stores({
		goals: `goal_url,title,desc,steps,notes,focustime,tag,tag_id,deadline,date_completed,goal_url,complete`,
	});

	const [selecting, setSelecting] = useState(false);
	const [selected, setSelected] = useState(
		goal_deadline_state ? setTime(goal_deadline_state) : "Select a date"
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

	const handleSelectedDate = async (selected) => {
		setSelectedDate(selected);
		dispatch(goal_deadline(selected ? selected : null));

		if (switch_to_add === "goal_") {
			if (home_goals.length !== 0 && back_index !== "g_completed") {
				dispatch(
					goal_edit({
						deadline: selected,
						goal_url: url,
					})
				);
			}

			await goalDB.goals
				.filter((goal) => {
					return goal.goal_url === url;
				})
				.modify({
					deadline: selected,
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
				dispatch(goal_deadline(new Date()));
				if (switch_to_add === "goal_") {
					if (home_goals.length !== 0 && back_index !== "g_completed") {
						dispatch(
							goal_edit({
								deadline: new Date(),
								goal_url: url,
							})
						);
					}

					await goalDB.goals
						.filter((goal) => {
							return goal.goal_url === url;
						})
						.modify({
							deadline: new Date(),
						});
				}
			} else if (selected === "Tomorrow") {
				dispatch(goal_deadline(new Date().setDate(new Date().getDate() + 1)));

				if (switch_to_add === "goal_") {
					if (home_goals.length !== 0 && back_index !== "g_completed") {
						dispatch(
							goal_edit({
								deadline: new Date().setDate(new Date().getDate() + 1),
								goal_url: url,
							})
						);
					}

					await goalDB.goals
						.filter((goal) => {
							return goal.goal_url === url;
						})
						.modify({
							deadline: new Date().setDate(new Date().getDate() + 1),
						});
				}
			} else {
				dispatch(goal_deadline(selected ? selected : null));
			}
		}
	};

	return (
		<div className="category" style={{ marginTop: "35px" }}>
			<div style={{ marginBottom: "15px", marginLeft: "5px" }}>
				Set a deadline
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
							alt="selected date"
						></img>
						<div className="option_name">
							{selectedDate ? setTime(goal_deadline_state) : "Select a date"}
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
							alt="selected date"
						></img>
						<div className="option_name">{selected}</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Deadline;
