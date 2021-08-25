import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Plugins } from "@capacitor/core";
import { useHistory } from "react-router-dom";
import Dexie from "dexie";
import moment from "moment";
import { Howl } from "howler";
import confetti from "canvas-confetti";
import { MusicControls } from "@ionic-native/music-controls";

import "./count-down.css";

import celebrate from "../../../assets/icons/done.png";

import Done from "../../done/Done";
import {
	goal_focus_edit,
	todo_complete,
	goal_complete,
	todo_focus_edit,
	todos,
	completed_goals,
} from "../../../actions/add_feed";

import completed_sound from "../../../assets/sounds/for-sure.ogg";
import notify_icon from "../../../assets/icons/keep_going.png";

import add_month from "../../../util/add_month";
import repeat from "../../../util/repeat";
import tag_ from "../../../util/tag";
import { stats_add } from "../../../util/stats_add";
import { set_list_complete } from "../../../util/new_default_lists";
import Ambience from "./Ambience";
import { reset_timer_feed } from "../../../actions/timer_feed";
import { handleEntry } from "../../../util/add_entry";

const sound = new Howl({
	src: [completed_sound],
	html5: true,
	preload: true,
	format: ["ogg"],
});

const CountDown = (props) => {
	const { LocalNotifications, Storage } = Plugins;

	const dispatch = useDispatch();
	const history = useHistory();

	const phrases = [
		"I am so proud of you ❤. Just wanted to tell you incase no one has",
		"You’ve got nothing to do today but smile. Well done! 🎉🎊",
		"You're capable! remember that! 🎊",
		"It feels good to progress towards your dream! You deserve to treat yourself champ! 🎉🎊",
		"Believe you can, and you are halfway there ❤",
		"Go crazy and celebrate this 🎉. It maybe small, but big leaps are made up of small steps! Well done! 🚀",
		"Sometimes you have to experience what you don't want in life to come to a full understanding of what you do want ❤",
	];

	const home_todos = useSelector((state) => state.todos.todos);
	const goals_state = useSelector((state) => state.goals.goals);
	const name_state = useSelector((state) => state.name);
	const data_local = props.dataLocal;

	const [mins, setMins] = useState(0);
	const [secs, setSecs] = useState(0);
	const [hours, setHours] = useState(0);
	const [done, setDone] = useState(false);

	let timer_interval;

	const style = {
		color: "#1395ff",
		fontFamily: "Poppins, san-serif",
	};

	const goalDB = new Dexie("LivelyGoals");
	goalDB.version(1).stores({
		goals: `goal_url,title,desc,steps,notes,focustime,tag,tag_id,deadline,date_completed,goal_url,complete`,
	});

	const todoDB = new Dexie("LivelyTodos");
	todoDB.version(1).stores({
		todos: `todo_url,desc,dueDate,category,tag,tag_id,steps,focustime,urgent,index,date_completed,remindMe,notes,todo_url,complete`,
	});

	const tagDB = new Dexie("LivelyTags");
	tagDB.version(1).stores({
		tags: `id,total_focus,today,week,month`,
	});

	const celebration = {
		wohoo: () => {
			var end = Date.now() + 3 * 1000;

			var colors = ["#1395ff", "#ff1395"];

			(function frame() {
				confetti({
					particleCount: 1,
					angle: 60,
					spread: 55,
					origin: { x: 0 },
					colors: colors,
				});
				confetti({
					particleCount: 2,
					angle: 120,
					spread: 55,
					origin: { x: 1 },
					colors: colors,
				});

				if (Date.now() < end) {
					requestAnimationFrame(frame);
				}
			})();
		},
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

	const save_tag = () => {
		const data_ = {
			id: data_local.tag_id,
			total_focus: data_local.time,
			name: data_local.tag,
		};

		tag_(data_);
	};

	const save_session = async () => {
		celebration.wohoo();

		if (data_local) {
			if (data_local.type === "goal") {
				add_month(new Date());

				stats_add({
					date: data_local.event_time,
					tasks: 0,
					goals: data_local.time,
					total: data_local.time,
					todos_count: 0,
					goals_count: 0,
					tag: data_local.tag
						? {
								id: data_local.tag_id,
								time: data_local.time,
								name: data_local.tag,
						  }
						: null,
				});

				handleEntry({
					date: data_local.event_time,
					type: "focus",
					time: data_local.time,
					tag: data_local.tag
						? {
								id: data_local.tag_id,
								name: data_local.tag,
						  }
						: null,
				});

				dispatch(reset_timer_feed);

				if (data_local.tag) {
					save_tag();
				}

				await goalDB.goals
					.filter((goal) => {
						return goal.goal_url === data_local.url;
					})
					.modify((goal) => {
						goal.focustime = goal.focustime + data_local.time;

						if (goals_state.length !== 0) {
							dispatch(
								goal_focus_edit({
									url: data_local.url,
									focustime: goal.focustime + data_local.time,
								})
							);
						}
					});
			} else if (data_local.type === "task") {
				add_month(new Date());

				stats_add({
					date: data_local.event_time,
					tasks: data_local.time,
					goals: 0,
					total: data_local.time,
					todos_count: 0,
					goals_count: 0,
					tag: data_local.tag
						? {
								id: data_local.tag_id,
								time: data_local.time,
								name: data_local.tag,
						  }
						: null,
				});

				handleEntry({
					date: data_local.event_time,
					type: "focus",
					time: data_local.time,
					tag: data_local.tag
						? {
								id: data_local.tag_id,
								name: data_local.tag,
						  }
						: null,
				});

				dispatch(reset_timer_feed);

				if (data_local.tag) {
					save_tag();
				}

				dispatch(reset_timer_feed);

				await todoDB.todos
					.filter((todo) => {
						return todo.todo_url === data_local.url;
					})
					.modify((todo) => {
						todo.focustime = todo.focustime + data_local.time;

						if (home_todos.length !== 0) {
							dispatch(
								todo_focus_edit({
									url: data_local.url,
									focustime: todo.focustime + data_local.time,
								})
							);
						}
					});
			} else {
				if (data_local.tag) {
					save_tag();
				}

				add_month(new Date());

				stats_add({
					date: data_local.event_time,
					tasks: 0,
					goals: 0,
					total: data_local.time,
					todos_count: 0,
					goals_count: 0,
					tag: data_local.tag
						? {
								id: data_local.tag_id,
								time: data_local.time,
								name: data_local.tag,
						  }
						: null,
				});
				
				handleEntry({
					date: data_local.event_time,
					type: "focus",
					time: data_local.time,
					tag: data_local.tag
						? {
								id: data_local.tag_id,
								name: data_local.tag,
						  }
						: null,
				});

				dispatch(reset_timer_feed);
			}
		}
	};

	const notify = async () => {
		MusicControls.create({
			track: "Focus session",
			artist: `Your session will end at ${moment(data_local.event_time).format(
				"LT"
			)}`,
			cover: notify_icon,
			isPlaying: false,
			dismissable: false,

			hasPrev: false,
			hasNext: false,

			// ANDROID ONLY
			notificationIcon: "ic_stat_name",
			ticker: `0${hours}:${mins < 60 ? `0${mins}` : mins}:${
				secs < 60 ? `0${secs}` : secs
			}`,
		});
	};

	const remove_notif = async () => {
		MusicControls.destroy();
		const nots = await LocalNotifications.getPending();
		await LocalNotifications.cancel({
			notifications: nots.notifications.filter((not) => not.id === "111222333"),
		});
	};

	const startTimer = async () => {
		if (data_local.event_time) {
			var eventTime = moment(data_local.event_time).toDate();
			var interval = 1000;

			await LocalNotifications.schedule({
				notifications: [
					{
						title: "Keep on going! 🎉🎊",
						body: `${
							name_state ? `${name_state}, ` : ""
						}you have successfully focused for ${readableTime(
							data_local.time
						)} ${data_local.type !== null ? `on your ${data_local.type}` : ""}`,
						id: 111222333,
						schedule: { at: data_local.event_time, allowWhenIdle: true },
						sound: null,
						attachments: null,
						actionTypeId: "",
						extra: null,
					},
				],
			});

			timer_interval = setInterval(() => {
				const duration = moment.duration(
					eventTime - moment(new Date()).toDate() - interval
				);
				setHours(duration.hours());
				setMins(duration.minutes());
				setSecs(duration.seconds());

				if (
					duration.hours() <= 0 &&
					duration.minutes() <= 0 &&
					duration.seconds() <= 0
				) {
					sound.play();
					props.handleTimeSet();
					setDone(true);
					remove_notif();
					save_session().then(async () => {
						await Storage.remove({ key: "focus" });
					});
					clearInterval(timer_interval);
				}
			}, interval);
		}
	};

	const terminate_countdown = async () => {
		remove_notif();
		clearInterval(timer_interval);
	};

	useEffect(() => {
		notify();
		startTimer();

		return () => {
			terminate_countdown();
		};
	}, []);

	const go = {
		back: () => {
			if (data_local) {
				if (data_local.type) {
					if (data_local.type === "task") {
						history.replace("/");
					} else if (data_local.type === "goal") {
						history.replace("/goals");
					}
				} else {
					history.replace("/timer");
				}
			} else {
				history.replace("/timer");
			}
		},
	};

	const mark_as_done = async () => {
		if (data_local) {
			if (data_local.type === "goal") {
				if (goals_state.length !== 0) {
					dispatch(
						goal_complete({
							goal_url: data_local.url,
							complete: 1,
						})
					);
				}

				add_month(new Date());

				stats_add({
					date: data_local.event_time,
					tasks: 0,
					goals: 0,
					total: 0,
					todos_count: 0,
					goals_count: 1,
				});

				dispatch(reset_timer_feed);

				await goalDB.goals
					.filter((goal) => {
						return goal.goal_url === data_local.url;
					})
					.modify((goal) => {
						goal.complete = 1;
						goal.date_completed = new Date();

						dispatch(
							completed_goals({
								title: goal.title,
								desc: goal.desc,
								steps: goal.steps,
								notes: goal.notes,
								focustime: goal.focustime,
								goal_url: goal.goal_url,
								complete: 1,
								date_completed: new Date(),
							})
						);
					});

				history.replace("/congrats");
			} else {
				set_list_complete();

				if (home_todos.length !== 0) {
					dispatch(
						todo_complete({
							todo_url: data_local.url,
							complete: 1,
						})
					);
				}

				add_month(new Date());

				stats_add({
					date: data_local.event_time,
					tasks: 0,
					goals: 0,
					total: 0,
					todos_count: 1,
					goals_count: 0,
				});

				dispatch(reset_timer_feed);

				await todoDB.todos
					.filter((todo) => {
						return todo.todo_url === data_local.url;
					})
					.modify((todo) => {
						todo.complete = 1;
						todo.date_completed = new Date();

						repeat({
							repeat: todo.repeat,
							todo_url: todo.todo_url,
							tag: todo.tag,
							tag_id: todo.tag_id,
							date_completed: todo.date_completed,
							index: todo.index,
							desc: todo.desc,
							dueDate: todo.dueDate,
							category: todo.category,
							steps: { steps: todo.steps.steps },
							focustime: todo.focustime,
							remindMe: todo.remindMe,
							notes: { notes: todo.notes.notes },
							complete: todo.complete,
							important: todo.important,
							urgent: todo.urgent ? todo.urgent : "No",
						}).then((data) => {
							if (data) {
								dispatch(todos(data));
							}
						});
					});
				go.back();
			}
		}
	};

	return (
		<div className="count_down" style={{ marginTop: "25px" }}>
			{done ? (
				<Done load={true}>
					<div className="done_options">
						<img src={celebrate} alt="You are free" />
						<div className="done_text">
							{phrases[Math.floor(Math.random() * phrases.length)]}
						</div>
						{data_local ? (
							<>
								{data_local.type !== null ? (
									<>
										<div className="done_text" style={{ marginTop: "30px" }}>
											Mark {data_local.type} as done?
										</div>
										<span
											className="action_button"
											style={{
												margin: "0 30px",
												color: "#1395ff",
											}}
											onClick={mark_as_done}
										>
											Yes
										</span>
										<span
											className="action_button"
											style={{
												margin: "0 30px",
												color: "#1395ff",
											}}
											onClick={go.back}
										>
											No
										</span>
									</>
								) : null}
							</>
						) : null}
					</div>
				</Done>
			) : (
				<span style={{ overflow: "auto" }}>
					{data_local ? (
						<>
							{data_local.type === null ? (
								<div className="done_text">
									Either you run the day, or the day runs you. -Jim Rohn
								</div>
							) : null}{" "}
						</>
					) : null}

					{hours ? (
						<>
							<span className="title" style={style}>
								{hours}
							</span>
							<span className="title" style={style}>
								{" "}
								:{" "}
							</span>
						</>
					) : null}
					<span className="title" style={style}>
						{mins ? (
							<>
								<span className="title" style={style}>
									{mins < 10 ? `0` + mins : mins}
								</span>
								<span className="title" style={style}>
									{" "}
									:{" "}
								</span>
							</>
						) : (
							<>
								{data_local ? (
									<>
										{data_local.time > 3600 ? (
											<>
												<span className="title" style={style}>
													00
												</span>
												<span className="title" style={style}>
													{" "}
													:{" "}
												</span>
											</>
										) : null}
									</>
								) : null}
							</>
						)}
					</span>
					<span className="title" style={style}>
						{secs < 10 ? `0` + secs : secs}
					</span>

					<Ambience />
				</span>
			)}
		</div>
	);
};

export default CountDown;
