import React, { useEffect, useState, useReducer } from "react";
import Dexie from "dexie";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Collapsible from "react-collapsible";
import { isPlatform } from "@ionic/react";
import { Plugins } from "@capacitor/core";

import "./home-feed.css";

import settings from "../../assets/icons/settings.png";
import settings_light from "../../assets/icons/settings_light.png";
import celebrate from "../../assets/icons/done.png";
import donate_icon from "../../assets/icons/donate.png";
import rate_icon from "../../assets/icons/rate.png";
import tip_icon from "../../assets/icons/tip.png";

import toggleDown from "../../assets/icons/expand.png";
import toggleDownLight from "../../assets/icons/expand_light.png";

import toggleUp from "../../assets/icons/collapse.png";
import toggleUpLight from "../../assets/icons/collapse_light.png";

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
	collapse_urgent,
	collapse_urgent_reset,
	collapse_yesterday,
	collapse_yesterday_reset,
} from "../../actions/toggles";
import {
	reset_battery_opt,
	set_battery_opt,
	show_donation_modal,
} from "../../actions/home_feed";
import SetName from "../setname/SetName";
import Loading from "../loading/Loading";
import ThankYou from "../../pages/thank_you/ThankYou";

const modalReducer = (state, action) => {
	if (action.type === "SET_SHOW_MODAL") {
		return { show: true, declined: state.declined };
	}

	if (action.type === "SET_DECLINED_TRUE") {
		return { show: state.show, declined: true };
	}

	return { show: false, declined: state.declined };
};

const modalReviewReducer = (state, action) => {
	if (action.type === "SET_SHOW_MODAL_REVIEW") {
		return { show: true, declined: state.declined };
	}

	if (action.type === "SET_DECLINED_REVIEW_TRUE") {
		return { show: state.show, declined: true };
	}

	return { show: false, declined: state.declined };
};

const HomeFeed = () => {
	const { Storage } = Plugins;
	const dispatch = useDispatch();
	const history = useHistory();

	const dark_mode = useSelector((state) => state.dark_mode);
	const thanks_state = useSelector((state) => state.thanks);
	const tasks = useSelector((state) => state.todos.todos);
	const home_timeout = useSelector((state) => state.home_timeout);
	const name_state = useSelector((state) => state.name);

	const [modal, dispatchModal] = useReducer(modalReducer, {
		show: false,
		declined: false,
	});

	const [modalReview, dispatchModalReview] = useReducer(modalReviewReducer, {
		show: false,
		declined: false,
	});

	const [showModalGoodWith, setShowModalGoodWith] = useState(false);

	const [showSetNameModal, setShowSetNameModal] = useState(false);

	const collapse_urgent_state = useSelector((state) => state.collapse_urgent);
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
		todos: `todo_url,desc,dueDate,category,tag,tag_id,steps,focustime,urgent,index,date_completed,remindMe,notes,todo_url,complete`,
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

	const handleBatteryOptimisations = async () => {
		window.cordova.plugins.DozeOptimize.IsIgnoringBatteryOptimizations(
			(response) => {
				console.log("IsIgnoringBatteryOptimizations: " + response);
				if (response === "false") {
					dispatch(reset_battery_opt);
				} else {
					dispatch(set_battery_opt);
				}
			},
			(error) => {
				console.error("IsIgnoringBatteryOptimizations Error" + error);
			}
		);
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

	const todo_urgent = tasks
		.filter((task) => task.urgent === "Yes" && task.complete === 0)
		.sort((todoA, todoB) => {
			return todoA.dueDate - todoB.dueDate;
		});

	const todo_earlier = tasks
		.filter(
			(task) =>
				setTime(task.dueDate) === "Earlier" &&
				task.complete === 0 &&
				(task.urgent === "No" || !task.urgent)
		)
		.sort((todoA, todoB) => {
			return todoA.dueDate - todoB.dueDate;
		});

	const todo_yesterday = tasks
		.filter(
			(task) =>
				setTime(task.dueDate) === "Yesterday" &&
				task.complete === 0 &&
				(task.urgent === "No" || !task.urgent)
		)
		.sort((todoA, todoB) => {
			return todoA.dueDate - todoB.dueDate;
		});

	const todo_today = tasks
		.filter(
			(task) =>
				setTime(task.dueDate) === "Today" &&
				task.complete === 0 &&
				(task.urgent === "No" || !task.urgent)
		)
		.sort((todoA, todoB) => {
			return todoA.dueDate - todoB.dueDate;
		});

	const todo_tomorrow = tasks
		.filter(
			(task) =>
				setTime(task.dueDate) === "Tomorrow" &&
				task.complete === 0 &&
				(task.urgent === "No" || !task.urgent)
		)
		.sort((todoA, todoB) => {
			return todoA.dueDate - todoB.dueDate;
		});

	const todo_later = tasks
		.filter(
			(task) =>
				setTime(task.dueDate) === "Later" &&
				task.complete === 0 &&
				(task.urgent === "No" || !task.urgent)
		)
		.sort((todoA, todoB) => {
			return todoA.dueDate - todoB.dueDate;
		});

	const collapsible = {
		urgent: () => {
			if (collapse_urgent_state === 0) {
				dispatch(collapse_urgent);
			} else {
				dispatch(collapse_urgent_reset);
			}
		},
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

	const addDays = (date, days) => {
		let result = new Date(date);
		result.setDate(result.getDate() + days);
		return result;
	};

	const handleGoodWithSave = async () => {
		await Storage.set({
			key: "good_with_modal_show",
			value: JSON.stringify(true),
		});
	};

	const handleFinishNameSet = () => {
		setShowSetNameModal(false);
	};

	useEffect(() => {
		if (home_timeout === 0) {
			const timeout = setTimeout(() => {
				dispatch(add_home_timeout);
				clearTimeout(timeout);
			}, 1500);
		}

		if (isPlatform("android")) {
			handleBatteryOptimisations();
		}
	}, []);

	useEffect(() => {
		const check_name = async () => {
			const name = await Storage.get({
				key: "name",
			});

			if (!name.value) {
				setShowSetNameModal(true);
			}
		};

		check_name();
	}, []);

	useEffect(() => {
		const check_good_with = async () => {
			const good_with_modal_shown_raw = await Storage.get({
				key: "good_with_modal_show",
			});
			const good_with_modal_shown = JSON.parse(good_with_modal_shown_raw.value);

			if (!good_with_modal_shown) {
				setShowModalGoodWith(true);
			}
		};

		check_good_with();
	}, []);

	useEffect(() => {
		const displayRateModal = async () => {
			const get_app_opens_raw = await Storage.get({ key: "app_starts" });
			const get_app_opens = JSON.parse(get_app_opens_raw.value);

			const get_date_installed_raw = await Storage.get({
				key: "date_installed",
			});
			const get_date_installed_JSON = JSON.parse(get_date_installed_raw.value);

			const get_date_installed = Date.parse(get_date_installed_JSON);

			const get_rate_modal_shown_raw = await Storage.get({
				key: "rate_modal_shown",
			});
			const get_rate_modal_shown = JSON.parse(get_rate_modal_shown_raw.value);

			const date_installed = moment(get_date_installed).toDate();
			const now = moment();

			if (
				get_app_opens > 20 &&
				now.diff(date_installed, "days") >= 3 &&
				!get_rate_modal_shown
			) {
				dispatchModalReview({ type: "SET_SHOW_MODAL_REVIEW" });
				await Storage.set({
					key: "rate_modal_shown",
					value: JSON.stringify(true),
				});
			}
		};

		displayRateModal();
	}, []);

	useEffect(() => {
		const displayDonateModal = async () => {
			const get_next_donation_date_raw = await Storage.get({
				key: "next_donation_reminder_date",
			});
			const get_donation_modal_shown_raw = await Storage.get({
				key: "donation_modal_shown",
			});

			const get_next_donation_dateJSON = JSON.parse(
				get_next_donation_date_raw.value
			);
			const get_next_donation_date = Date.parse(get_next_donation_dateJSON);

			const get_donation_modal_shown = JSON.parse(
				get_donation_modal_shown_raw.value
			);

			const get_app_opens_raw = await Storage.get({ key: "app_starts" });
			const get_app_opens = JSON.parse(get_app_opens_raw.value);

			const next_date = moment(get_next_donation_date).toDate();
			const now = moment();

			if (get_next_donation_date_raw.value) {
				if (
					now.diff(next_date, "days") >= 0 &&
					!get_donation_modal_shown &&
					get_app_opens > 20
				) {
					dispatchModal({ type: "SET_SHOW_MODAL" });
				}
			} else {
				await Storage.set({
					key: "next_donation_reminder_date",
					value: JSON.stringify(addDays(new Date(), 3)),
				});
			}
		};

		displayDonateModal();
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

			{thanks_state && <ThankYou />}

			{showSetNameModal ? (
				<SetName handleFinishNameSet={handleFinishNameSet} />
			) : null}

			{showModalGoodWith ? (
				<Done load={true} extra={true} priority={1}>
					<div className="done_options">
						<img
							style={{
								width: "100px",
								height: "100px",
							}}
							src={tip_icon}
							alt={`Great apps to go with Lively`}
						/>
						<div className="big_text">Welcome {name_state}!</div>
						<div className="done_text">
							To aid with eliminating procrastination, I recommend Your Hour and
							Fabulous.
						</div>
						<div className="done_text">
							Lively will help you keep track of your time, get tasks and goals
							done. Fabulous to form that into a habit and Your Hour to limit
							distractions.
						</div>

						<div
							className="action_button"
							style={{
								margin: "0 30px",
								color: "#1395ff",
							}}
							onClick={async () => {
								window.open(
									"https://play.google.com/store/apps/details?id=com.mindefy.phoneaddiction.mobilepe&hl=en&gl=US",
									"_blank"
								);
								handleGoodWithSave();
							}}
						>
							Your Hour
						</div>
						<div
							className="action_button"
							style={{
								margin: "10px 30px",
								color: "#1395ff",
							}}
							onClick={() => {
								window.open(
									"https://play.google.com/store/apps/details?id=co.thefabulous.app",
									"_blank"
								);
								handleGoodWithSave();
							}}
						>
							Fabulous
						</div>
						<div
							className="action_button"
							style={{
								margin: "10px 30px",
								color: "#1395ff",
							}}
							onClick={() => {
								setShowModalGoodWith(false);
								handleGoodWithSave();
							}}
						>
							I will download them later
						</div>
					</div>
				</Done>
			) : null}

			{modalReview.show ? (
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
						{modalReview.show ? (
							<div className="done_text">
								If you ever change your mind, you can always leave a review on{" "}
								{isPlatform("android") ? "Google Play" : "the App Store"} 🎉.
							</div>
						) : (
							<>
								<div className="big_text">Hey {name_state}!</div>
								<div className="done_text">
									I hope this app has helped you in any way. Help us get this
									app to a bigger audience by leaving a review.
								</div>
							</>
						)}

						{modalReview.declined ? null : (
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
									dispatchModalReview({ type: "REMOVE_MODAL_REVIEW" });
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
								if (modalReview.declined) {
									dispatchModalReview({ type: "REMOVE_MODAL_REVIEW" });
								} else {
									dispatchModalReview({ type: "SET_DECLINED_REVIEW_TRUE" });
								}
							}}
						>
							{modalReview.declined ? "Nice" : "Maybe later"}
						</span>
					</div>
				</Done>
			) : null}

			{modal.show ? (
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
						{modal.declined ? (
							<div className="done_text">
								If you ever change your mind, you can always support at any
								time.
							</div>
						) : (
							<>
								<div className="big_text">Hey {name_state},</div>
								<div className="done_text">
									For the price of a cup of coffee, you can keep this project
									going. Lively is and will always be ad-free and give you all
									features without a subscription. Lively will always depend on
									your generosity as with our motto "generosity for generosity".
								</div>
							</>
						)}

						{modal.declined ? null : (
							<span
								className="action_button"
								style={{
									margin: "0 30px",
									color: "#1395ff",
								}}
								onClick={async () => {
									dispatch(show_donation_modal);
									dispatchModal({ type: "REMOVE_MODAL" });
									await Storage.set({
										key: "next_donation_reminder_date",
										value: JSON.stringify(addDays(new Date(), 3)),
									});
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
							onClick={async () => {
								if (modal.declined) {
									dispatchModal({ type: "REMOVE_MODAL" });
								} else {
									await Storage.set({
										key: "next_donation_reminder_date",
										value: JSON.stringify(addDays(new Date(), 3)),
									});
									dispatchModal({ type: "SET_DECLINED_TRUE" });
								}
							}}
						>
							{modal.declined ? "Nice" : "Later, I promise"}
						</span>
					</div>
				</Done>
			) : null}

			{todo_urgent.length === 0 &&
			todo_earlier.length === 0 &&
			todo_yesterday.length === 0 &&
			todo_today.length === 0 &&
			todo_tomorrow.length === 0 &&
			todo_later.length === 0 ? (
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
				<Loading />
			) : (
				<>
					{todo_urgent.length !== 0 ? (
						<div
							className="title"
							style={{
								marginBottom: collapse_urgent_state ? "25px" : "0",
							}}
						>
							Urgent
							<span
								style={{ margin: `0 5px`, ...style }}
								dangerouslySetInnerHTML={{ __html: `&#8226;` }}
							></span>
							<span style={style}>{todo_urgent.length}</span>
							<span>
								<img
									src={
										dark_mode
											? collapse_urgent_state
												? toggleDownLight
												: toggleUpLight
											: collapse_urgent_state
											? toggleDown
											: toggleUp
									}
									style={imgStyle}
									alt={
										collapse_urgent_state
											? "Expand section"
											: "Collapse section"
									}
									onClick={collapsible.urgent}
								/>
							</span>
						</div>
					) : null}

					<Collapsible open={collapse_urgent_state === 0 ? true : false}>
						{todo_urgent.map((todo, index) => {
							return (
								<div key={index}>
									<Card
										urgent_state={true}
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
										urgent={todo.urgent}
										important={todo.important}
									/>
								</div>
							);
						})}
					</Collapsible>

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
										urgent={todo.urgent}
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
										urgent={todo.urgent}
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
										urgent={todo.urgent}
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
										urgent={todo.urgent}
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
										urgent={todo.urgent}
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
