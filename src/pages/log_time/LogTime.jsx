import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker } from "@ionic-native/date-picker";
import { Link, useHistory } from "react-router-dom";
import moment from "moment";

import { mode } from "../../constants/color";

import back_icon from "../../assets/icons/back.png";
import back_icon_light from "../../assets/icons/back_light.png";
import due from "../../assets/icons/due.png";
import due_light from "../../assets/icons/due_light.png";
import tag_icon from "../../assets/icons/tag.png";
import tag_icon_light from "../../assets/icons/tag_light.png";
import duration_icon from "../../assets/icons/timer.png";
import duration_icon_light from "../../assets/icons/timer_light.png";

import { stats_add } from "../../util/stats_add";
import Tag from "../../components/tag/Tag";
import add_month from "../../util/add_month";
import { reset_timer_feed } from "../../actions/timer_feed";
import { todo_tag_selected } from "../../actions/add_feed";
import {
	clear_focus,
	focus_done,
	focus_timeSET,
} from "../../actions/focus_feed";
import { navStateHome } from "../../actions/bottom_nav";
import Done from "../../components/done/Done";
import { handleEntry } from "../../util/add_entry";

const LogTime = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const darkMode = useSelector((state) => state.dark_mode);
	const tag = useSelector((state) => state.focus_info);

	const [fade, setFade] = useState(false);
	const [date, setDate] = useState(new Date());
	const [time, setTimeState] = useState(new Date());
	const [secondTime, setSecondDate] = useState(null);
	const [selected, setSelected] = useState(null);
	const [confirmationModal, setConfirmationModal] = useState(null);

	const style = {
		position: "fixed",
		height: "100%",
		width: "100%",
		top: "0",
		zIndex: "10",
		backgroundColor: darkMode ? mode.dark : mode.light,
		overflow: "auto",
		opacity: fade ? 1 : 0,
	};

	const style2 = {
		color: darkMode ? "white" : "black",
		border: darkMode ? "solid 1px  #1A1A1A" : "solid 1px #f0f0f0",
		background: "transparent",
		height: secondTime ? "30px" : "40px",
		maxHeight: "300px",
		width: "auto",
		outline: "0",
		flex: 1,
		fontFamily: `"Poppins", sans-serif`,
		padding: "7.5px 40px 7.5px 15px",
		overflow: "auto",
		borderRadius: "35px",
	};

	const elemStyle = {
		background: darkMode ? "rgb(15, 15, 15)" : "rgb(240, 240, 240)",
		display: "flex",
		margin: "15px",
		borderRadius: "35px",
		padding: "10px 20px",
		alignItems: "center",
		postion: "relative",
	};

	const elemImg = {
		width: "20px",
		height: "20px",
		position: "absolute",
		left: "30px",
	};

	const setTime = (timestamp) => {
		return moment(timestamp).format("LT");
	};

	const setDay = (timestamp) => {
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

	const readableTime = (time) => {
		const hours = Math.floor(time / 3600);
		const minutes = Math.floor(time / 60);

		if (minutes === 1) {
			return `${minutes} mins`;
		} else if (minutes < 1) {
			return `Less than a minute`;
		} else if (minutes < 60 && minutes > 1) {
			return `${minutes} mins`;
		} else if (time % 3600 === 0) {
			return `${hours} h`;
		} else if (minutes > 60 && minutes < 120) {
			return `${hours} h ${minutes % 60} mins`;
		} else {
			return `${hours} h ${minutes % 60 !== 0 ? ` ${minutes % 60} mins` : ``}`;
		}
	};

	const handleTimePick = () => {
		DatePicker.show({
			date: new Date(),
			mode: "time",
			cancelButtonColor: "#1395ff",
			doneButtonColor: "#1395ff",
			androidTheme: darkMode
				? DatePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_DARK
				: DatePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
		}).then(
			(time_value) => {
				if (secondTime) {
					const time_fir = new Date(time_value).getTime();
					const time_sec = new Date(secondTime).getTime();
					const diff = (time_sec - time_fir) / 1000;
					setSelected(diff);
				}

				setTimeState(time_value);
			},
			(err) => console.log("Error occurred while getting date: ", err)
		);
	};

	const handleSecondTimePick = () => {
		DatePicker.show({
			date: new Date(),
			mode: "time",
			cancelButtonColor: "#1395ff",
			doneButtonColor: "#1395ff",
			androidTheme: darkMode
				? DatePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_DARK
				: DatePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
		}).then(
			(time_value) => {
				const time_sec = new Date(time_value).getTime();
				const time_fir = new Date(time).getTime();
				const diff = (time_sec - time_fir) / 1000;
				setSecondDate(time_value);
				setSelected(diff);
			},
			(err) => console.log("Error occurred while getting date: ", err)
		);
	};

	const handleDatePick = () => {
		DatePicker.show({
			date: new Date(),
			maxDate: Date.now(),
			mode: "date",
			cancelButtonColor: "#1395ff",
			doneButtonColor: "#1395ff",
			androidTheme: darkMode
				? DatePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_DARK
				: DatePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
		}).then(
			(date_value) => setDate(date_value),
			(err) => console.log("Error occurred while getting date: ", err)
		);
	};

	const handleSubmit = () => {
		if (secondTime) {
			dispatch(reset_timer_feed);
			add_month(date);
			handleEntry({
				date,
				type: "focus",
				time: selected,
				tag: tag
					? {
							id: tag.tag_id,
							name: tag.tag,
					  }
					: null,
			});
			stats_add({
				date,
				tasks: 0,
				goals: 0,
				total: selected,
				todos_count: 0,
				goals_count: 0,
				tag: tag
					? {
							id: tag.tag_id,
							time: selected,
							name: tag.tag,
					  }
					: null,
			}).then(() => history.goBack());
		}
	};

	useEffect(() => {
		let unmounted = false;

		setTimeout(() => {
			if (!unmounted) {
				setFade(true);
			}
		}, 50);

		return () => {
			unmounted = true;
			dispatch(navStateHome);
			dispatch(focus_timeSET(null));
			dispatch(clear_focus);
			dispatch(focus_done(false));
			dispatch(todo_tag_selected({ tag: null, id: null }));
		};
	}, []);

	return (
		<div className="page" style={style}>
			<div className="container">
				<div
					className="container_top_nav"
					style={{
						backgroundColor: darkMode ? mode.dark : mode.light,
					}}
				>
					<span className="back_icon">
						<Link to="/timer">
							<img src={darkMode ? back_icon_light : back_icon} alt="Go back" />
						</Link>
					</span>
					<span className="title">Log Time</span>
					<div
						style={{
							position: "absolute",
							right: "20px",
							color: "#1395ff",
							marginTop: "-25px",
							fontSize: "14px",
						}}
					>
						<span
							style={{ color: secondTime ? "#1395ff" : "grey" }}
							onClick={secondTime ? () => setConfirmationModal(true) : null}
						>
							Save
						</span>
					</div>
				</div>

				<div className="space" style={{ marginTop: "110px" }}></div>

				{confirmationModal && (
					<Done load={true} extra={true}>
						<div className="done_options">
							<div className="done_text">
								Are you sure this is correct? You will not be able to edit this
								later.
							</div>
							<div className="element" style={elemStyle}>
								<img
									src={darkMode ? tag_icon_light : tag_icon}
									style={elemImg}
									alt="The duration you want to log"
								/>
								<span className="text" style={{ flex: "1" }}>
									{tag ? `#${tag.tag}` : "# Tag not selected"}
								</span>
							</div>
							<div className="element" style={elemStyle}>
								<img
									src={darkMode ? duration_icon_light : duration_icon}
									style={elemImg}
									alt="The duration you want to log"
								/>
								<span className="text" style={{ flex: "1" }}>
									{setTime(time)} - {setTime(secondTime)}
								</span>
							</div>
							<div className="element" style={elemStyle}>
								<img
									src={darkMode ? due_light : due}
									style={elemImg}
									alt="The duration you want to log"
								/>
								<span className="text" style={{ flex: "1" }}>
									{setDay(date)}
								</span>
							</div>
							<div
								className="action_button"
								style={{
									margin: "15px 0",
									color: "#1395ff",
								}}
								onClick={handleSubmit}
							>
								Yes, it's correct
							</div>
							<div
								className="action_button"
								style={{
									margin: "15px 0",
									color: "#1395ff",
								}}
								onClick={() => setConfirmationModal(false)}
							>
								Go back
							</div>
						</div>
					</Done>
				)}

				<Tag log={true} focus={true} />

				<div
					className="category"
					style={{ marginTop: "35px", textAlign: "center" }}
				>
					<div
						style={{
							marginBottom: "15px",
							marginLeft: "5px",
							textAlign: "left",
						}}
					>
						I focused from:
					</div>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<div
							className="category_select"
							style={style2}
							onClick={handleTimePick}
						>
							<div className="option">
								<img
									className="option_image_selected"
									src={darkMode ? due_light : due}
									alt="selected category"
								></img>
								<div className="option_name">
									{time ? setTime(time) : "Select a time"}
								</div>
							</div>
						</div>
						<div style={{ margin: "0 5px" }}>To</div>
						<div
							className="category_select"
							style={style2}
							onClick={handleSecondTimePick}
						>
							<div className="option">
								<img
									className="option_image_selected"
									src={darkMode ? due_light : due}
									alt="selected category"
								></img>
								<div className="option_name">
									{secondTime ? setTime(secondTime) : "Select a time"}
								</div>
							</div>
						</div>
					</div>
				</div>
				{secondTime && (
					<div style={{ color: "#1395ff", marginTop: "15px" }}>
						{readableTime(selected)}
					</div>
				)}

				<div
					className="category"
					style={{ marginTop: "35px", textAlign: "center" }}
				>
					<div
						style={{
							marginBottom: "15px",
							marginLeft: "5px",
							textAlign: "left",
						}}
					>
						I focused:
					</div>
					<div
						className="category_select"
						style={{ ...style2, height: "30px" }}
						onClick={handleDatePick}
					>
						<div className="option">
							<img
								className="option_image_selected"
								src={darkMode ? due_light : due}
								alt="selected category"
							></img>
							<div className="option_name">
								{date ? setDay(date) : "Select a date"}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LogTime;
