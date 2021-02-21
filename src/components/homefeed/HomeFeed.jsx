import React, { useEffect, useState } from "react";
import Dexie from "dexie";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Collapsible from "react-collapsible";
import { isPlatform } from "@ionic/react";

import "./home-feed.css";

import settings from "../../assets/icons/settings.png";
import settings_light from "../../assets/icons/settings_light.png";
import celebrate from "../../assets/icons/done.png";
import donate_icon from "../../assets/icons/donate.png";
import rate_icon from "../../assets/icons/rate.png";

import toggleDown from "../../assets/icons/expand.png";
import toggleDownLight from "../../assets/icons/expand_light.png";

import toggleUp from "../../assets/icons/collapse.png";
import toggleUpLight from "../../assets/icons/collapse_light.png";

import loading from "../../assets/icons/loading.gif";

import Card from "./card/Card";
import Done from "../done/Done";
import { add_home_timeout } from "../../actions/timeouts";
import {
	collapse_earlier,
	collapse_earlier_reset,
	collapse_later,
	collapse_later_reset,
	collapse_today,
	collapse_today_reset,
	collapse_tomorrow,
	collapse_tomorrow_reset,
	collapse_yesterday,
	collapse_yesterday_reset,
} from "../../actions/toggles";
import { clear_chart_data } from "../../actions/timer_feed";
import { show_donation_modal } from "../../actions/home_feed";

const HomeFeed = () => {
	const dispatch = useDispatch();
	const history = useHistory();

	const dark_mode = useSelector((state) => state.dark_mode);
	const tasks = useSelector((state) => state.todos.todos);
	const home_timeout = useSelector((state) => state.home_timeout);

	const [showModal, setShowModal] = useState(false);
	const [declined, setDeclined] = useState(false);

	const [showModalReview, setShowModalReview] = useState(false);
	const [declinedReview, setDeclinedReview] = useState(false);

	const collapse_earlier_state = useSelector((state) => state.collapse_earlier);
	const collapse_yesterday_state = useSelector(
		(state) => state.collapse_yesterday
	);
	const collapse_today_state = useSelector((state) => state.collapse_today);
	const collapse_tomorrow_state = useSelector(
		(state) => state.collapse_tomorrow
	);
	const collapse_later_state = useSelector((state) => state.collapse_later);

	const db = new Dexie("LivelyTodos");
	db.version(1).stores({
		todos: `todo_url,desc,dueDate,category,steps,focustime,index,date_completed,remindMe,notes,todo_url,complete`,
	});

	const style = {
		color: dark_mode ? "white" : "black",
		fontFamily: `"Poppins", sans-serif`,
	};

	const imgStyle = {
		width: "20px",
		height: "20px",
		marginLeft: "10px",
		verticalAlign: "middle",
	};

	const setTime = (timestamp) => {
		const now = moment();

		if (
			now.diff(timestamp, "days") >= 1 &&
			!moment(timestamp).calendar().includes("Yesterday")
		) {
			return "Earlier";
		} else if (moment(timestamp).calendar().includes("Yesterday")) {
			return "Yesterday";
		} else if (moment(timestamp).calendar().includes("Today")) {
			return "Today";
		} else if (moment(timestamp).calendar().includes("Tomorrow")) {
			return "Tomorrow";
		} else {
			return "Later";
		}
	};

	const todo_earlier = tasks
		.filter(
			(task) => setTime(task.dueDate) === "Earlier" && task.complete === 0
		)
		.sort((todoA, todoB) => {
			return todoA.dueDate - todoB.dueDate;
		});

	const todo_yesterday = tasks
		.filter(
			(task) => setTime(task.dueDate) === "Yesterday" && task.complete === 0
		)
		.sort((todoA, todoB) => {
			return todoA.dueDate - todoB.dueDate;
		});

	const todo_today = tasks
		.filter((task) => setTime(task.dueDate) === "Today")
		.sort((todoA, todoB) => {
			return todoA.dueDate - todoB.dueDate;
		});

	const todo_tomorrow = tasks
		.filter(
			(task) => setTime(task.dueDate) === "Tomorrow" && task.complete === 0
		)
		.sort((todoA, todoB) => {
			return todoA.dueDate - todoB.dueDate;
		});

	const todo_later = tasks
		.filter((task) => setTime(task.dueDate) === "Later" && task.complete === 0)
		.sort((todoA, todoB) => {
			return todoA.dueDate - todoB.dueDate;
		});

	const collapsible = {
		earlier: () => {
			if (collapse_earlier_state === 0) {
				dispatch(collapse_earlier);
			} else {
				dispatch(collapse_earlier_reset);
			}
		},
		yesterday: () => {
			if (collapse_yesterday_state === 0) {
				dispatch(collapse_yesterday);
			} else {
				dispatch(collapse_yesterday_reset);
			}
		},
		today: () => {
			if (collapse_today_state === 0) {
				dispatch(collapse_today);
			} else {
				dispatch(collapse_today_reset);
			}
		},
		tomorrow: () => {
			if (collapse_tomorrow_state === 0) {
				dispatch(collapse_tomorrow);
			} else {
				dispatch(collapse_tomorrow_reset);
			}
		},
		later: () => {
			if (collapse_later_state === 0) {
				dispatch(collapse_later);
			} else {
				dispatch(collapse_later_reset);
			}
		},
	};

	const setTimeWeek = (timestamp) => {
		const now = moment();
		const days_passed = now.diff(timestamp, "days");

		if (days_passed > 7) {
			return false;
		} else if (days_passed < 0) {
			return false;
		} else if (days_passed >= 0 && days_passed <= 7) {
			return true;
		}
	};

	const setTimeMonth = (timestamp) => {
		const month = moment().format("MMMM");
		const year = moment().format("YYYY");
		const localMonth = moment(timestamp).format("MMMM");
		const localYear = moment(timestamp).format("YYYY");

		if (month === localMonth && year === localYear) {
			return true;
		} else {
			return false;
		}
	};

	useEffect(() => {
		if (home_timeout === 0) {
			const timeout = setTimeout(() => {
				dispatch(add_home_timeout);
				clearTimeout(timeout);
			}, 1500);
		}

		const check_timestamps = () => {
			const today_timestamp = Date.parse(
				localStorage.getItem("today_timestamp")
			);
			const week_timestamp = Date.parse(localStorage.getItem("week_timestamp"));
			const month_timestamp = Date.parse(
				localStorage.getItem("month_timestamp")
			);

			if (setTime(today_timestamp) !== "Today") {
				localStorage.setItem("new_focus", false);
				dispatch(clear_chart_data);
			}

			if (!setTimeWeek(week_timestamp)) {
				localStorage.setItem("new_focus_week", false);
				dispatch(clear_chart_data);
			}

			if (!setTimeMonth(month_timestamp)) {
				localStorage.setItem("new_focus", false);
				localStorage.setItem("new_focus_week", false);
				dispatch(clear_chart_data);
			}
		};

		check_timestamps();
	}, []);

	useEffect(() => {
		const get_app_opens = JSON.parse(localStorage.getItem("app_starts"));
		const get_date_installed = Date.parse(
			localStorage.getItem("date_installed")
		);
		const get_donation_modal_shown = JSON.parse(
			localStorage.getItem("donation_modal_shown")
		);

		const date_installed = moment(get_date_installed);
		const now = moment();

		if (get_app_opens > 30 && now.diff(date_installed, "days") >= 5) {
			if (!get_donation_modal_shown) {
				setShowModal(true);
				localStorage.setItem("donation_modal_shown", true);
			}
		}
	}, []);

	useEffect(() => {
		const get_app_opens = JSON.parse(localStorage.getItem("app_starts"));
		const get_date_installed = Date.parse(
			localStorage.getItem("date_installed")
		);
		const get_rate_modal_shown = JSON.parse(
			localStorage.getItem("rate_modal_shown")
		);

		const date_installed = moment(get_date_installed);
		const now = moment();

		if (get_app_opens > 20 && now.diff(date_installed, "days") >= 3) {
			if (!get_rate_modal_shown) {
				setShowModalReview(true);
				localStorage.setItem("rate_modal_shown", true);
			}
		}
	}, []);

	return (
		<div className="container">
			<div id="settings-link" style={{ zIndex: 4 }}>
				<Link to="/settings">
					<img
						src={dark_mode ? settings_light : settings}
						alt="settings-icon"
					/>
				</Link>
			</div>

			{showModalReview ? (
				<Done load={true} extra={true}>
					<div className="done_options">
						<img
							style={{
								width: "100px",
								height: "100px",
							}}
							src={rate_icon}
							alt={`Help out to keep the project going`}
						/>
						{declinedReview ? (
							<div className="done_text">
								If you ever change your mind, you can always leave a review from
								the settings page or{" "}
								{isPlatform("android") ? "Google Play" : "the App Store"} 🎉.
								Now back to focusing on making your dreams a reality 🚀
							</div>
						) : (
							<>
								<div className="big_text">Thank You!</div>
								<div className="done_text">
									I made this app to help procrastinators take back control of
									their lives. I hope It helped in any way. I hope you can
									consider leaving a review, it helps make the app better 🦾,
									and helps others discover the app 🐱‍🏍
								</div>
							</>
						)}

						{declinedReview ? null : (
							<span
								className="action_button"
								style={{
									margin: "0 30px",
									color: "#1395ff",
								}}
								onClick={() => {
									// TODO add iOS link when it's available
									window.open(
										"https://play.google.com/store/apps/details?id=com.lively.life",
										"_blank"
									);
									setShowModalReview(false);
								}}
							>
								Leave a review
							</span>
						)}

						<span
							className="action_button"
							style={{
								margin: "0 30px",
								color: "#1395ff",
							}}
							onClick={() => {
								if (declinedReview) {
									setShowModalReview(false);
								} else {
									setDeclinedReview(true);
								}
							}}
						>
							{declinedReview ? "Nice" : "Maybe later"}
						</span>
					</div>
				</Done>
			) : null}

			{showModal ? (
				<Done load={true} extra={true}>
					<div className="done_options">
						<img
							style={{
								width: "100px",
								height: "100px",
							}}
							src={donate_icon}
							alt={`Help out to keep the project going`}
						/>
						{declined ? (
							<div className="done_text">
								If you ever change your mind, you can always donate from the
								settings page 🎉. Now back to focusing on making your dreams a
								reality 🚀
							</div>
						) : (
							<>
								<div className="big_text">Thank You!</div>
								<div className="done_text">
									I made this app to help procrastinators take back control of
									their lives. I hope It helped in any way. I hope you can
									consider chipping in to keep the project going
								</div>
								<div className="done_text">
									"No one has ever become poor from giving" - Anne Frank
								</div>{" "}
							</>
						)}

						{declined ? null : (
							<span
								className="action_button"
								style={{
									margin: "0 30px",
									color: "#1395ff",
								}}
								onClick={() => {
									dispatch(show_donation_modal);
									setShowModal(false);
									history.replace("/settings#donate_section");
								}}
							>
								Help out
							</span>
						)}

						<span
							className="action_button"
							style={{
								margin: "0 30px",
								color: "#1395ff",
							}}
							onClick={() => {
								if (declined) {
									setShowModal(false);
								} else {
									setDeclined(true);
								}
							}}
						>
							{declined ? "Nice" : "Maybe later"}
						</span>
					</div>
				</Done>
			) : null}

			{tasks.length === 0 ? (
				<>
					<div className="title">You're Free!</div>
					<Done>
						<div className="done_options">
							<img src={celebrate} alt="You are free" />

							<div className="done_text">
								Looks like you do not have anything to do
							</div>
						</div>
					</Done>
				</>
			) : null}

			{home_timeout === 0 ? (
				<Done load={true}>
					<div className="done_options">
						<img
							style={{ width: "35px", height: "35px" }}
							src={loading}
							alt="Loading your tasks"
						/>
					</div>
				</Done>
			) : (
				<>
					{todo_earlier.length !== 0 ? (
						<div
							className="title"
							style={{
								marginBottom: collapse_earlier_state ? "25px" : "0",
							}}
						>
							Earlier
							<span
								style={{ margin: `0 5px`, ...style }}
								dangerouslySetInnerHTML={{ __html: `&#8226;` }}
							></span>
							<span style={style}>{todo_earlier.length}</span>
							<span>
								<img
									src={
										dark_mode
											? collapse_earlier_state
												? toggleDownLight
												: toggleUpLight
											: collapse_earlier_state
											? toggleDown
											: toggleUp
									}
									style={imgStyle}
									alt={
										collapse_earlier_state
											? "Expand section"
											: "Collapse section"
									}
									onClick={collapsible.earlier}
								/>
							</span>
						</div>
					) : null}

					<Collapsible open={collapse_earlier_state === 0 ? true : false}>
						{todo_earlier.map((todo, index) => {
							return (
								<div key={index}>
									<Card
										cardDesc={todo.desc}
										dueDate={todo.dueDate}
										category={todo.category}
										date_completed={todo.date_completed}
										tag={todo.tag}
										tag_id={todo.tag_id}
										steps={todo.steps.steps ? todo.steps.steps : []}
										remindMe={todo.remindMe}
										notes={todo.notes.notes ? todo.notes.notes : []}
										focustime={todo.focustime}
										index={todo.index}
										URL={todo.todo_url}
										repeat={todo.repeat}
										complete={todo.complete}
										important={todo.important}
									/>
								</div>
							);
						})}
					</Collapsible>

					{todo_yesterday.length !== 0 ? (
						<div
							className="title"
							style={{
								marginBottom: collapse_yesterday_state ? "25px" : "0",
							}}
						>
							Yesterday
							<span
								style={{ margin: `0 5px`, ...style }}
								dangerouslySetInnerHTML={{ __html: `&#8226;` }}
							></span>
							<span style={style}>{todo_yesterday.length}</span>
							<span>
								<img
									src={
										dark_mode
											? collapse_yesterday_state
												? toggleDownLight
												: toggleUpLight
											: collapse_yesterday_state
											? toggleDown
											: toggleUp
									}
									style={imgStyle}
									alt={
										collapse_yesterday_state
											? "Expand section"
											: "Collapse section"
									}
									onClick={collapsible.yesterday}
								/>
							</span>
						</div>
					) : null}

					<Collapsible open={collapse_yesterday_state === 0 ? true : false}>
						{todo_yesterday.map((todo, index) => {
							return (
								<div key={index}>
									<Card
										cardDesc={todo.desc}
										dueDate={todo.dueDate}
										category={todo.category}
										date_completed={todo.date_completed}
										tag={todo.tag}
										tag_id={todo.tag_id}
										steps={todo.steps.steps ? todo.steps.steps : []}
										remindMe={todo.remindMe}
										notes={todo.notes.notes ? todo.notes.notes : []}
										focustime={todo.focustime}
										index={todo.index}
										URL={todo.todo_url}
										repeat={todo.repeat}
										complete={todo.complete}
										important={todo.important}
									/>
								</div>
							);
						})}
					</Collapsible>

					{todo_today.length !== 0 ? (
						<div
							className="title"
							style={{
								marginBottom: collapse_today_state ? "25px" : "0",
							}}
						>
							Today
							<span
								style={{ margin: `0 5px`, ...style }}
								dangerouslySetInnerHTML={{
									__html: `&#8226;`,
								}}
							></span>
							<span style={style}>{todo_today.length}</span>
							<span>
								<img
									src={
										dark_mode
											? collapse_today_state
												? toggleDownLight
												: toggleUpLight
											: collapse_today_state
											? toggleDown
											: toggleUp
									}
									style={imgStyle}
									alt={
										collapse_today_state ? "Expand section" : "Collapse section"
									}
									onClick={collapsible.today}
								/>
							</span>
						</div>
					) : null}

					<Collapsible open={collapse_today_state === 0 ? true : false}>
						{todo_today.map((todo, index) => {
							return (
								<div key={index}>
									<Card
										cardDesc={todo.desc}
										dueDate={todo.dueDate}
										category={todo.category}
										date_completed={todo.date_completed}
										tag={todo.tag}
										tag_id={todo.tag_id}
										steps={todo.steps.steps ? todo.steps.steps : []}
										remindMe={todo.remindMe}
										notes={todo.notes.notes ? todo.notes.notes : []}
										focustime={todo.focustime}
										index={todo.index}
										URL={todo.todo_url}
										repeat={todo.repeat}
										complete={todo.complete}
										important={todo.important}
									/>
								</div>
							);
						})}
					</Collapsible>

					{todo_tomorrow.length !== 0 ? (
						<div
							className="title"
							style={{
								marginBottom: collapse_tomorrow_state ? "25px" : "0",
							}}
						>
							Tomorrow
							<span
								style={{ margin: `0 5px`, ...style }}
								dangerouslySetInnerHTML={{ __html: `&#8226;` }}
							></span>
							<span style={style}>{todo_tomorrow.length}</span>
							<span>
								<img
									src={
										dark_mode
											? collapse_tomorrow_state
												? toggleDownLight
												: toggleUpLight
											: collapse_tomorrow_state
											? toggleDown
											: toggleUp
									}
									style={imgStyle}
									alt={
										collapse_tomorrow_state
											? "Expand section"
											: "Collapse section"
									}
									onClick={collapsible.tomorrow}
								/>
							</span>
						</div>
					) : null}

					<Collapsible open={collapse_tomorrow_state === 0 ? true : false}>
						{todo_tomorrow.map((todo, index) => {
							return (
								<div key={index}>
									<Card
										cardDesc={todo.desc}
										dueDate={todo.dueDate}
										category={todo.category}
										date_completed={todo.date_completed}
										tag={todo.tag}
										tag_id={todo.tag_id}
										steps={todo.steps.steps ? todo.steps.steps : []}
										remindMe={todo.remindMe}
										notes={todo.notes.notes ? todo.notes.notes : []}
										focustime={todo.focustime}
										index={todo.index}
										URL={todo.todo_url}
										repeat={todo.repeat}
										complete={todo.complete}
										important={todo.important}
									/>
								</div>
							);
						})}
					</Collapsible>

					{todo_later.length !== 0 ? (
						<div
							className="title"
							style={{
								marginBottom: collapse_later_state ? "25px" : "0",
							}}
						>
							Later
							<span
								style={{ margin: `0 5px`, ...style }}
								dangerouslySetInnerHTML={{ __html: `&#8226;` }}
							></span>
							<span style={style}>{todo_later.length}</span>
							<span>
								<img
									src={
										dark_mode
											? collapse_later_state
												? toggleDownLight
												: toggleUpLight
											: collapse_later_state
											? toggleDown
											: toggleUp
									}
									style={imgStyle}
									alt={
										collapse_later_state ? "Expand section" : "Collapse section"
									}
									onClick={collapsible.later}
								/>
							</span>
						</div>
					) : null}

					<Collapsible open={collapse_later_state === 0 ? true : false}>
						{todo_later.map((todo, index) => {
							return (
								<div key={index}>
									<Card
										cardDesc={todo.desc}
										dueDate={todo.dueDate}
										category={todo.category}
										date_completed={todo.date_completed}
										tag={todo.tag}
										tag_id={todo.tag_id}
										steps={todo.steps.steps ? todo.steps.steps : []}
										remindMe={todo.remindMe}
										notes={todo.notes.notes ? todo.notes.notes : []}
										focustime={todo.focustime}
										index={todo.index}
										URL={todo.todo_url}
										repeat={todo.repeat}
										complete={todo.complete}
										important={todo.important}
									/>
								</div>
							);
						})}
					</Collapsible>
				</>
			)}
		</div>
	);
};

export default HomeFeed;
