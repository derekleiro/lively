import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import "./focus-feed.css";

import back_icon from "../../assets/icons/back.png";
import back_icon_light from "../../assets/icons/back_light.png";
import tag from "../../assets/icons/tag.png";
import tag_light from "../../assets/icons/tag_light.png";
import tip_icon from "../../assets/icons/tip.png";

import Target from "./target/Target";
import { mode } from "../../constants/color";
import Time from "./time/Time";
import {
	focus_timeSET,
	clear_focus,
	focus_done,
	focus_info,
} from "../../actions/focus_feed";
import CountDown from "./countdown/CountDown";
import Done from "../done/Done";
import Tag from "../tag/Tag";
import { todo_tag_selected } from "../../actions/add_feed";

const FocusFeed = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const darkMode = useSelector((state) => state.dark_mode);
	const timeSetRaw = useSelector((state) => state.focus_time_set);
	const focus_info_state = useSelector((state) => state.focus_info);
	const todo_tag_selected_value = useSelector((state) =>
		state.todo_tag_selected ? state.todo_tag_selected.tag : null
	);

	const focus_ongoing = localStorage.getItem("focus");
	const data = JSON.parse(focus_ongoing);

	const [timerOn, setTimerOn] = useState(false);
	const [timeSet, setTimeSet] = useState(timeSetRaw);
	const [localData, setLocalData] = useState(null);
	const [warningOn, setWarningOn] = useState(false);

	const style = {
		light: {
			color: "white",
			margin: "0 5px",
			fontSize: "18px",
		},
		dark: {
			color: "black",
			margin: "0 5px",
			fontSize: "18px",
		},
	};

	const startFocus = () => {
		setTimerOn(true);
		setWarningOn(false);
		localStorage.setItem("focus", JSON.stringify(localData));
		localStorage.setItem("extra_data", JSON.stringify(localData));
	};

	const handleFocus = () => {
		if (todo_tag_selected_value || focus_info_state.type) {
			startFocus();
		} else {
			setWarningOn(true);
		}
	};

	const handleSelect = (selected, data) => {
		dispatch(focus_info(data));
		setLocalData(data);
		setTimeSet(true);
	};

	const handleTimeSet = () => {
		setTimeSet(false);
	};

	useEffect(() => {
		let unmounted = false;

		if (data) {
			if (!unmounted) {
				setTimerOn(true);
				setTimeSet(true);
			}
		}

		return () => {
			dispatch(focus_timeSET(null));
			dispatch(clear_focus);
			dispatch(focus_done(false));
			localStorage.removeItem("focus");
			localStorage.removeItem("extra_data");
			dispatch(todo_tag_selected({ tag: null, id: null }));
		};
	}, [dispatch]);

	const focus_centered = (
		<Done>
			<div className="done_options" style={{ padding: "0 20px" }}>
				<span style={{ margin: "0 auto" }}>
					<Target
						text={focus_info_state ? focus_info_state.text : null}
						extra={focus_info_state ? focus_info_state.extra : null}
						steps={focus_info_state ? focus_info_state.steps : null}
						left={false}
					/>
					<CountDown handleTimeSet={handleTimeSet} />
				</span>
			</div>
		</Done>
	);

	const focus = (
		<div className="done_options">
			<Target
				text={focus_info_state ? focus_info_state.text : null}
				extra={focus_info_state ? focus_info_state.extra : null}
				steps={focus_info_state ? focus_info_state.steps : null}
				left={true}
			/>
			<CountDown handleTimeSet={handleTimeSet} />
		</div>
	);

	return (
		<div className="container" style={{ marginBottom: "125px" }}>
			<div
				className="container_top_nav"
				style={{ backgroundColor: darkMode ? mode.dark : mode.light }}
			>
				<span className="back_icon">
					<img
						src={darkMode ? back_icon_light : back_icon}
						alt="Go back"
						onClick={() => {
							if (focus_info_state) {
								if (focus_info_state.type === "task") {
									history.replace("/");
								} else if (focus_info_state.type === "goal") {
									history.replace("/goals");
								} else {
									history.replace("/timer");
								}
							} else {
								history.replace("/timer");
							}
						}}
					/>
				</span>
				<span className="title" style={darkMode ? style.light : style.dark}>
					Focus
				</span>
				<div id="create_todo">
					{timeSet ? (
						<span
							style={{ color: "#1395ff" }}
							onClick={timerOn ? null : handleFocus}
						>
							{timerOn ? "..." : "Start"}
						</span>
					) : (
						<span style={{ color: "grey" }}>You rock!</span>
					)}
				</div>
			</div>

			<div className="space" style={{ marginTop: "75px" }}></div>

			{warningOn ? (
				<Done load={true}>
					<div className="done_options">
						<img src={tip_icon} alt="No tag selected" />
						<div className="done_text">
							You have not selected a tag to focus on. Meaning the time for this
							session will not be added on the graph although still recorded.
						</div>

						<div className="done_text">
							This is good for just relaxing time. Are you sure you wanna
							continue?
						</div>

						<div
							className="action_button"
							style={{
								margin: "15px 30px",
								color: "#1395ff",
							}}
							onClick={() => startFocus()}
						>
							Yeah, I'm just relaxing
						</div>
						<div
							className="action_button"
							style={{
								margin: "15px 30px",
								color: "#1395ff",
							}}
							onClick={() => setWarningOn(false)}
						>
							No, I want the time added on the graph!
						</div>
					</div>
				</Done>
			) : null}

			{timerOn ? (
				<>
					{focus_info_state
						? focus_info_state.steps.length > 5
							? focus
							: focus_centered
						: focus_centered}
				</>
			) : (
				<>
					{focus_info_state ? (
						<Target
							text={focus_info_state.text}
							extra={focus_info_state.extra}
							steps={focus_info_state.steps}
							left={true}
						/>
					) : null}

					{focus_info_state ? (
						focus_info_state.type !== null && focus_info_state.tag ? (
							<div className="category" style={{ marginTop: "25px" }}>
								<span
									style={{
										marginBottom: "15px",
										marginLeft: "5px",
										color: "#1395ff",
									}}
								>
									<img
										src={darkMode ? tag_light : tag}
										style={{
											width: "20px",
											height: "20px",
											verticalAlign: "middle",
										}}
										alt="tag icon"
									/>{" "}
									{focus_info_state.tag}
								</span>
							</div>
						) : null
					) : null}

					{focus_info_state ? (
						focus_info_state.type === null ? (
							<Tag focus={true} />
						) : null
					) : null}

					<Time handleSelect={handleSelect} />
				</>
			)}
		</div>
	);
};

export default FocusFeed;
