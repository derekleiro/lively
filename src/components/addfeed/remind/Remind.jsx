import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Dexie from "dexie";
import { DatePicker } from "@ionic-native/date-picker";
import { Plugins } from "@capacitor/core";

import "./remind.css";

import remind from "../../../assets/icons/remind.png";
import remind_light from "../../../assets/icons/remind_light.png";
import tip_icon from "../../../assets/icons/tip.png";

import { mode } from "../../../constants/color";
import {
	todo_edit,
	todo_remind_timestamp,
	todo_remove_reminder,
} from "../../../actions/add_feed";
import {
	remove_notification,
	schedule_notification,
} from "../../../util/notifications";
import Done from "../../done/Done";
import { reset_battery_opt } from "../../../actions/home_feed";

const Remind = () => {
	const { Storage } = Plugins;
	const dispatch = useDispatch();
	const darkMode = useSelector((state) => state.dark_mode);
	const todo_remind_timestamp_state = useSelector(
		(state) => state.todo_remind_timestamp
	);
	const url = useSelector((state) => state.url);
	const home_todos = useSelector((state) => state.todos.todos);
	const back_index = useSelector((state) => state.back_index);
	const todo_index = useSelector((state) => state.todo_index);
	const switch_to_add = useSelector((state) => state.addfeed_switch);
	const desc = useSelector((state) => state.todo_desc);
	const battery_opt = useSelector((state) => state.battery_opt);
	const todo_complete_set_state = useSelector(
		(state) => state.todo_complete_set
	);

	const [notif_warn, setNotifWarn] = useState(null);

	useEffect(() => {
		const getNotifWarn = async () => {
			const getData = await Storage.get({ key: "notif_warning" });
			setNotifWarn(JSON.parse(getData.value));
		};

		getNotifWarn();
	}, []);

	const todoDB = new Dexie("LivelyTodos");
	todoDB.version(1).stores({
		todos: `todo_url,desc,dueDate,category,tag,tag_id,steps,focustime,urgent,index,date_completed,remindMe,notes,todo_url,complete`,
	});

	const setTimeRemind = (timestamp) => {
		if (moment(timestamp).calendar().includes("Yesterday")) {
			return `Yesterday, ${moment(timestamp).format("LT")}`;
		} else if (moment(timestamp).calendar().includes("Today")) {
			return `Today, ${moment(timestamp).format("LT")}`;
		} else if (moment(timestamp).calendar().includes("Tomorrow")) {
			return `Tomorrow, ${moment(timestamp).format("LT")}`;
		} else {
			return `${moment(timestamp).format("ddd MMM Do YYYY")}, ${moment(
				timestamp
			).format("LT")}`;
		}
	};

	const [prompt, setPrompt] = useState(false);
	const [selected, setSelected] = useState(
		todo_remind_timestamp_state
			? setTimeRemind(todo_remind_timestamp_state.timestamp)
			: "Select a time"
	);

	const [promptRemind, setPromptRemind] = useState(false);

	const style = {
		style1: {
			color: darkMode ? "white" : "black",
			border: darkMode ? "solid 1px  #1A1A1A" : "solid 1px #f0f0f0",
			background: darkMode ? mode.dark : mode.light,
			padding: "7.5px 7.5px 7.5px 15px",
			WebkitTapHighlightColor: "transparent",
			height: "auto",
		},
		style2: {
			color: darkMode ? "white" : "black",
			border: darkMode ? "solid 1px  #1A1A1A" : "solid 1px #f0f0f0",
			background: darkMode ? mode.dark : mode.light,
			height: "auto",
			maxHeight: "515px",
			padding: "7.5px 7.5px 7.5px 15px",
			WebkitTapHighlightColor: "transparent",
		},
	};

	const handleReminderSet = async (timestamp) => {
		setSelected(setTimeRemind(timestamp));

		if (!notif_warn) {
			setPrompt(true);
		}

		const remindMe = {
			timestamp: timestamp,
		};

		dispatch(todo_remind_timestamp(remindMe));

		if (switch_to_add === "add_") {
			if (back_index === "home" && home_todos.length !== 0) {
				dispatch(
					todo_edit({
						remindMe,
						todo_url: url,
					})
				);
			}

			await todoDB.todos
				.filter((todo) => {
					return todo.todo_url === url;
				})
				.modify((todo) => {
					if (!todo_complete_set_state) {
						schedule_notification(timestamp, desc, todo_index, {
							text: todo.desc,
							focustime: 0,
							url: todo.todo_url,
							type: "task",
							steps: todo.steps.steps,
							tag: todo.tag,
							tag_id: todo.tag_id,
						});
					}

					todo.remindMe = remindMe;
				});
		}
	};

	const remove_reminder = async () => {
		dispatch(todo_remove_reminder);
		setSelected("Select a time");

		if (switch_to_add === "add_") {
			if (back_index === "home" && home_todos.length !== 0) {
				dispatch(
					todo_edit({
						remindMe: null,
						todo_url: url,
					})
				);
			}

			await todoDB.todos
				.filter((todo) => {
					return todo.todo_url === url;
				})
				.modify((todo) => {
					remove_notification(todo.index);
					todo.remindMe = null;
				});
		}
	};

	const handleRemindPick = () => {
		if (selected !== "Select a time") {
			setPromptRemind(true);
		} else {
			DatePicker.show({
				date: new Date(),
				mode: "datetime",
				cancelButtonColor: "#1395ff",
				doneButtonColor: "#1395ff",
				androidTheme: darkMode
					? DatePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_DARK
					: DatePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
			}).then(
				(date) => handleReminderSet(date),
				(err) => console.log("Error occurred while getting date: ", err)
			);
		}
	};

	const handleRequest = async () => {
		window.cordova.plugins.DozeOptimize.RequestOptimizations(
			(response) => {
				dispatch(reset_battery_opt);
			},
			(error) => {
				console.error("BatteryOptimizations Request Error" + error);
				return true;
			}
		);
	};

	const handleIntialSet = async () => {
		setSelected("Select a time");
	};

	const warn_jsx = (
		<Done load={true}>
			<div className="done_options">
				<img
					style={{
						width: "100px",
						height: "100px",
					}}
					src={tip_icon}
					alt="You may not always receive your notifications"
				/>
				<div className="done_text">
					I recommend setting a reminder on your phone just in case (as a
					backup). Due to battery optimisations, you may not always receive your
					notifications.
				</div>
				<span
					className="action_button"
					style={{
						margin: "0 30px",
						color: "#1395ff",
					}}
					onClick={() => {
						setPrompt(false);
					}}
				>
					I understand
				</span>

				{battery_opt ? null : (
					<div
						className="action_button"
						style={{
							margin: "15px 30px",
							color: "#1395ff",
						}}
						onClick={() => {
							setPrompt(false);
							handleRequest();
						}}
					>
						Improve the situation
					</div>
				)}

				<span style={{ marginTop: "10px" }}>
					<span
						className="action_button"
						style={{
							margin: "15px 30px",
							color: "#1395ff",
						}}
						onClick={async () => {
							setPrompt(false);
							setNotifWarn(1);
							await Storage.set({
								key: "notif_warning",
								value: JSON.stringify(1),
							});
						}}
					>
						Don't show again
					</span>
				</span>
			</div>
		</Done>
	);

	const prompt_jsx = (
		<Done load={true}>
			<div className="done_options">
				<img
					style={{
						width: "100px",
						height: "100px",
					}}
					src={tip_icon}
					alt="You already have a reminder. Want to set it again or remove it?"
				/>
				<div className="done_text">
					Looks like you already have a reminder. Do you want to remove it or
					re-set to a different time?
				</div>
				<span
					className="action_button"
					style={{
						margin: "0 30px",
						color: "#1395ff",
					}}
					onClick={() => {
						setPromptRemind(false);
						handleIntialSet().then(handleRemindPick);
					}}
				>
					Re-set it
				</span>

				<div
					className="action_button"
					style={{
						margin: "15px 30px",
						color: "#1395ff",
					}}
					onClick={() => {
						setPromptRemind(false);
						remove_reminder();
					}}
				>
					Remove it
				</div>
			</div>
		</Done>
	);

	return (
		<div className="category" style={{ marginTop: "35px" }}>
			<div style={{ marginBottom: "15px", marginLeft: "5px" }}>Remind me</div>

			{prompt ? warn_jsx : null}

			{promptRemind ? (
				prompt_jsx
			) : (
				<div
					className="category_select"
					style={style.style1}
					onClick={() => {
						handleRemindPick();
					}}
				>
					<div className="option">
						<img
							className="option_image_selected"
							src={darkMode ? remind_light : remind}
							alt="selected category"
						></img>
						<div className="option_name">{selected}</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Remind;
