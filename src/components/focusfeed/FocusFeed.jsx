import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Plugins } from "@capacitor/core";
import moment from "moment";

import "./focus-feed.css";

import back_icon from "../../assets/icons/back.png";
import back_icon_light from "../../assets/icons/back_light.png";
import tag from "../../assets/icons/tag.png";
import tag_light from "../../assets/icons/tag_light.png";
import tip_icon from "../../assets/icons/tip.png";
import keep_going_icon from "../../assets/icons/keep_going.png";

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
	const { Storage } = Plugins;

	const dispatch = useDispatch();
	const history = useHistory();
	const darkMode = useSelector((state) => state.dark_mode);
	const timeSetRaw = useSelector((state) => state.focus_time_set);
	const focus_info_state = useSelector((state) => state.focus_info);
	const name_state = useSelector((state) => state.name);
	const todo_tag_selected_value = useSelector((state) =>
		state.todo_tag_selected ? state.todo_tag_selected.tag : null
	);

	const [data, setData] = useState(null);
	const [prepModalOn, setPrepModalOn] = useState(false);
	const [timerOn, setTimerOn] = useState(false);
	const [timeSet, setTimeSet] = useState(timeSetRaw);
	const [localData, setLocalData] = useState(null);
	const [warningOn, setWarningOn] = useState(false);
	const [aboutToQuit, setAboutToQuit] = useState(false);
	const [encouragementOpen, setEncouragementOpen] = useState(false);

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

	const startFocus = async () => {
		setTimerOn(true);
		setWarningOn(false);
		setPrepModalOn(false);

		const modified_data = {
			time: focus_info_state.time,
			event_time: moment(new Date()).add(focus_info_state.time, "s").toDate(),
			type: focus_info_state ? focus_info_state.type || null : null,
			steps: focus_info_state ? focus_info_state.steps || [] : [],
			text: focus_info_state ? focus_info_state.text || "" : "",
			extra: focus_info_state ? focus_info_state.extra || "" : "",
			focustime: focus_info_state ? focus_info_state.focustime || 0 : 0,
			url: focus_info_state ? focus_info_state.url || null : null,
			tag: focus_info_state ? focus_info_state.tag : null,
			tag_id: focus_info_state ? focus_info_state.tag_id : null,
		};

		dispatch(focus_info(modified_data));
		if (modified_data) {
			setLocalData(modified_data);
		}

		await Storage.set({ key: "focus", value: JSON.stringify(modified_data) });
		await Storage.set({
			key: "extra_data",
			value: JSON.stringify(modified_data),
		});
	};

	const handleFocus = () => {
		if (todo_tag_selected_value || focus_info_state.type) {
			setPrepModalOn(true);
		} else {
			setWarningOn(true);
		}
	};

	const handleSelect = (data_) => {
		dispatch(focus_info(data_));
		setLocalData(data_);
		setTimeSet(true);
	};

	const handleTimeSet = () => {
		setTimeSet(false);
		setAboutToQuit(false);
	};

	const handleBack = () => {
		if (!timeSet || !timerOn) {
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
		} else {
			setAboutToQuit(true);
		}
	};

	const remove_focus_local = async () => {
		await Storage.remove({ key: "focus" });
		await Storage.remove({ key: "extra_data" });
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

	useEffect(() => {
		let unmounted = false;

		const fetchData = async () => {
			const focus_ongoing = await Storage.get({ key: "focus" });
			const focus_data = JSON.parse(focus_ongoing.value);

			if (focus_data) {
				if (!unmounted) {
					setData(focus_data);
					setTimerOn(true);
					setTimeSet(true);
				}
			}
		};

		fetchData();

		return () => {
			remove_focus_local();
			dispatch(focus_timeSET(null));
			dispatch(clear_focus);
			dispatch(focus_done(false));
			dispatch(todo_tag_selected({ tag: null, id: null }));
			unmounted = true;
		};
	}, []);

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
					<CountDown
						dataLocal={data ? data : localData}
						handleTimeSet={handleTimeSet}
					/>
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
			<CountDown
				dataLocal={data ? data : localData}
				handleTimeSet={handleTimeSet}
			/>
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
						onClick={handleBack}
					/>
				</span>
				<span className="title" style={darkMode ? style.light : style.dark}>
					Focus
				</span>
				<div
					style={{
						position: "absolute",
						right: "20px",
						color: "#1395ff",
						marginTop: "-25px",
						fontSize: "14px",
					}}
				>
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

			{prepModalOn ? (
				<Done load={true}>
					<div className="done_options">
						<img src={tip_icon} alt="No tag selected" />
						<div className="done_text">
							You are about to start a focus session of{" "}
							{readableTime(localData.time)}. Please make sure you are free of
							destructions for the next {readableTime(localData.time)}. Once you
							start the session, it cannot be paused. Find a destruction free
							area and keep your phone on "Do Not Disturb" . All the best!
						</div>

						<div
							className="action_button"
							style={{
								margin: "15px 30px",
								color: "#1395ff",
							}}
							onClick={startFocus}
						>
							I am free of destructions and ready to focus
						</div>
						<div
							className="action_button"
							style={{
								margin: "15px 30px",
								color: "#1395ff",
							}}
							onClick={() => setPrepModalOn(false)}
						>
							go back
						</div>
					</div>
				</Done>
			) : null}

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
							onClick={() => {
								setWarningOn(false);
								setPrepModalOn(true);
							}}
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

			{aboutToQuit && timerOn ? (
				<Done load={true}>
					<div className="done_options">
						<img src={keep_going_icon} alt="No tag selected" />

						{encouragementOpen ? (
							<>
								<div className="done_text">
									You've done great {name_state}! Your willingness to sit down
									and focus shows you're ready to achieve your goals. Keep it
									up!
								</div>{" "}
								<div
									className="action_button"
									style={{
										margin: "15px 30px",
										color: "#1395ff",
									}}
									onClick={() => {
										setAboutToQuit(false);
									}}
								>
									No, I can do this!
								</div>
								<div
									className="action_button"
									style={{
										margin: "15px 30px",
										color: "#1395ff",
									}}
									onClick={() => {
										setAboutToQuit(false);
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
								>
									Thanks
								</div>
							</>
						) : (
							<>
								<div className="done_text">
									It can be hard sometimes to maintain focus, and that's ok. You
									can do this {name_state}, let's keep going!
								</div>
								<div
									className="action_button"
									style={{
										margin: "15px 30px",
										color: "#1395ff",
									}}
									onClick={() => setAboutToQuit(false)}
								>
									Let's keep going!
								</div>
								<div
									className="action_button"
									style={{
										margin: "15px 30px",
										color: "#1395ff",
									}}
									onClick={() => {
										setEncouragementOpen(true);
									}}
								>
									I've done my best!
								</div>{" "}
							</>
						)}
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
									}}
								>
									<img
										src={darkMode ? tag_light : tag}
										style={{
											width: "20px",
											height: "20px",
											verticalAlign: "middle",
											marginRight: "10px",
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
