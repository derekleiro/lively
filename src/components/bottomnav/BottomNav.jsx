import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Plugins } from "@capacitor/core";
import Dexie from "dexie";

import "./bottom-nav.css";

import { mode } from "../../constants/color";
import {
	get_today,
	get_yesterday,
	get_week,
	get_month,
} from "../../util/stats";

import home from "../../assets/icons/home.png";
import lists from "../../assets/icons/lists.png";
import tags_icon from "../../assets/icons/tag.png";
import add from "../../assets/icons/todo.png";
import inspiration from "../../assets/icons/inspiration.png";
import timer from "../../assets/icons/timer.png";

import home_active from "../../assets/icons/home_active.png";
import lists_active from "../../assets/icons/lists_active.png";
import tags_active from "../../assets/icons/tag_active.png";
import inspiration_active from "../../assets/icons/inspiration_active.png";
import timer_active from "../../assets/icons/timer_active.png";

import home_light from "../../assets/icons/home_light.png";
import lists_light from "../../assets/icons/lists_light.png";
import tags_light from "../../assets/icons/tag_light.png";
import add_light from "../../assets/icons/todo_light.png";
import inspiration_light from "../../assets/icons/inspiration_light.png";
import timer_light from "../../assets/icons/timer_light.png";
import {
	dispatch_todos,
	dispatch_goals,
	handle_users_lists,
	todos_clear,
	todo_repeat_option,
	dispatch_completed_goals,
	textarea_state,
} from "../../actions/add_feed";

import { timer_feed } from "../../actions/timer_feed";
import {
	dispatch_lists,
	dispatch_list_completed,
	dispatch_list_default,
	dispatch_list_important,
} from "../../actions/list_feed";
import { home_timeout_clear } from "../../actions/timeouts";

const BottomNav = (props) => {
	const { Keyboard } = Plugins;

	const dispatch = useDispatch();

	const state = useSelector((state) => state.bottom_nav);
	const tasks = useSelector((state) => state.todos.todos);
	const lists_feed = useSelector((state) => state.lists_feed.lists);
	const list_toggle = useSelector((state) => state.list_toggle);
	const my_goals_state = useSelector((state) => state.goals.goals);
	const my__completed_goals_state = useSelector(
		(state) => state.completed_goals.completed
	);
	const timer_feed_state = useSelector((state) => state.timer_feed);
	const bottom_nav_limit_state = useSelector(
		(state) => state.bottom_nav_limit_state
	);
	const tip_state = useSelector((state) => state.tip_state);
	const timer_feed_title = useSelector((state) => state.timer_feed_title);

	const [keyboardUp, setKeyboardUp] = useState(false)

	const logDB = new Dexie("LivelyLogs");
	logDB.version(1).stores({
		logs: "date, tasks, goals, total, todos_count, graph, goals_count",
	});

	const todoDB = new Dexie("LivelyTodos");
	todoDB.version(1).stores({
		todos: `todo_url,desc,dueDate,category,tag,tag_id,steps,focustime,urgent,index,date_completed,remindMe,notes,todo_url,complete`,
	});

	const goalDB = new Dexie("LivelyGoals");
	goalDB.version(1).stores({
		goals: `goal_url,title,desc,steps,notes,focustime,tag,tag_id,deadline,date_completed,goal_url,complete`,
	});

	const monthDB = new Dexie("LivelyMonths");
	monthDB.version(1).stores({
		month: "date",
	});

	const listDB = new Dexie("LivelyLists");
	listDB.version(1).stores({
		lists: `list_id,name,todo,completed,list_id,index`,
	});

	const tagDB = new Dexie("LivelyTags");
	tagDB.version(1).stores({
		tags: `id,total_focus,today,week,month`,
	});

	const cleanup = () => {
		if (tasks.length > 25) {
			dispatch(todos_clear);
			dispatch(home_timeout_clear);
		}
	};

	const GET = {
		home: () => {
			const todos = async () => {
				const todos_ = await todoDB.todos
					.filter((todo) => {
						return todo.complete === 0;
					})
					.toArray();

				dispatch(
					dispatch_todos(
						[].concat(todos_).sort((todoA, todoB) => {
							return todoA.dueDate - todoB.dueDate;
						})
					)
				);
			};

			if (tasks.length === 0) {
				todos();
			}
		},
		lists: () => {
			cleanup();
			const fetch_all_list = async () => {
				const all = await todoDB.todos.count();
				const completed = await todoDB.todos
					.filter((todo) => todo.complete === 1)
					.count();

				dispatch(dispatch_list_default({ todo: all, completed }));
			};

			const fetch_important_list = async () => {
				const important = await todoDB.todos
					.filter((todo) => todo.important === 1)
					.count();

				const completed = await todoDB.todos
					.filter((todo) => todo.complete === 1 && todo.important === 1)
					.count();

				dispatch(dispatch_list_important({ todo: important, completed }));
			};

			const fetch_completed_list = async () => {
				const completed = await todoDB.todos
					.filter((todo) => todo.complete === 1)
					.count();

				dispatch(dispatch_list_completed({ todo: completed, completed }));
			};

			const fetch_users_list = async () => {
				const lists = await todoDB.todos
					.filter((todo) => todo.category !== null)
					.toArray();

				dispatch(handle_users_lists(lists));
			};

			const fetch_lists = async () => {
				fetch_completed_list();
				fetch_users_list();
				fetch_all_list();
				fetch_important_list().then(async () => {
					const lists = await listDB.lists.toArray();
					dispatch(dispatch_lists(lists));
				});
			};

			if (lists_feed.length === 0) {
				fetch_lists();
			}
		},
		goals: () => {
			cleanup();
			const get_goals = async () => {
				const my_goals = await goalDB.goals
					.filter((goal) => {
						return goal.complete === 0;
					})
					.toArray();

				dispatch(dispatch_goals(my_goals));
			};

			const get_completed_goals = async () => {
				const my_completed_goals = await goalDB.goals
					.filter((goal) => {
						return goal.complete === 1;
					})
					.toArray();

				dispatch(dispatch_completed_goals(my_completed_goals));
			};

			if (
				my_goals_state.length === 0 ||
				my__completed_goals_state.length === 0
			) {
				get_goals();
				get_completed_goals();
			}
		},
		timer: () => {
			cleanup();
			if (timer_feed_state.dispatch === false) {
				if (timer_feed_title === "Today") {
					get_today().then((today_state) => {
						if (today_state) {
							dispatch(timer_feed(today_state));
						}
					});
				} else if (timer_feed_title === "Yesterday") {
					get_yesterday().then((yesterday_state) => {
						if (yesterday_state) {
							dispatch(timer_feed(yesterday_state));
						}
					});
				} else if (timer_feed_title === "Past 7 days") {
					get_week().then((past_7_days) => {
						if (past_7_days) {
							dispatch(timer_feed(past_7_days));
						}
					});
				} else {
					get_month(timer_feed_title).then((month_state) => {
						if (month_state) {
							dispatch(timer_feed(month_state));
						}
					});
				}
			}
		},
	};

	const link_jsx = (
		<div
			id="bottom-nav"
			style={{
				backgroundColor: props.darkMode ? `${mode.dark}` : `${mode.light}`,
				color: props.darkMode ? "white" : "black",
				zIndex: keyboardUp ? "-1" : "5",
			}}
		>
			<span className="bottom-nav-image-holder">
				<Link to="/" onClick={GET.home}>
					<img
						src={
							state === "home"
								? home_active
								: props.darkMode
								? home_light
								: home
						}
						alt="Home"
						title="Home"
					/>
				</Link>
			</span>
			<span className="bottom-nav-image-holder">
				<Link to="/lists" onClick={GET.lists}>
					{list_toggle ? (
						<img
							src={
								state === "lists"
									? tags_active
									: props.darkMode
									? tags_light
									: tags_icon
							}
							alt="Tags"
							title="Tags"
						/>
					) : (
						<img
							src={
								state === "lists"
									? lists_active
									: props.darkMode
									? lists_light
									: lists
							}
							alt="Lists"
							title="Lists"
						/>
					)}
				</Link>
			</span>
			<span className="bottom-nav-image-holder">
				<Link
					to="/add"
					onClick={() => {
						dispatch(todo_repeat_option("Never"));
						if (tip_state === 0) {
							dispatch(textarea_state(true));
						}
						cleanup();
					}}
				>
					<img
						src={props.darkMode ? add_light : add}
						alt="Add task or goal"
						title="Add task or goal"
					/>
				</Link>
			</span>
			<span className="bottom-nav-image-holder">
				<Link to="/goals" onClick={GET.goals}>
					<img
						src={
							state === "goals"
								? inspiration_active
								: props.darkMode
								? inspiration_light
								: inspiration
						}
						alt="Your goals"
						title="Your goals"
					/>
				</Link>
			</span>
			<span className="bottom-nav-image-holder">
				<Link to="/timer" onClick={GET.timer}>
					<img
						src={
							state === "timer"
								? timer_active
								: props.darkMode
								? timer_light
								: timer
						}
						alt="Productivity"
						title="Productivity"
					/>
				</Link>
			</span>
		</div>
	);

	const static_jsx = (
		<div
			id="bottom-nav"
			style={{
				backgroundColor: props.darkMode ? `${mode.dark}` : `${mode.light}`,
				color: props.darkMode ? "white" : "black",
				zIndex: keyboardUp ? "-1" : "5",
			}}
		>
			<span className="bottom-nav-image-holder">
				<img
					src={
						state === "home" ? home_active : props.darkMode ? home_light : home
					}
					alt="Home"
					title="Home"
				/>
			</span>
			<span className="bottom-nav-image-holder">
				{list_toggle ? (
					<img
						src={
							state === "lists"
								? tags_active
								: props.darkMode
								? tags_light
								: tags_icon
						}
						alt="Tags"
						title="Tags"
					/>
				) : (
					<img
						src={
							state === "lists"
								? lists_active
								: props.darkMode
								? lists_light
								: lists
						}
						alt="Lists"
						title="Lists"
					/>
				)}
			</span>
			<span className="bottom-nav-image-holder">
				<img
					src={props.darkMode ? add_light : add}
					alt="Add task or goal"
					title="Add task or goal"
				/>
			</span>
			<span className="bottom-nav-image-holder">
				<img
					src={
						state === "goals"
							? inspiration_active
							: props.darkMode
							? inspiration_light
							: inspiration
					}
					alt="Your goals"
					title="Your goals"
				/>
			</span>
			<span className="bottom-nav-image-holder">
				<img
					src={
						state === "timer"
							? timer_active
							: props.darkMode
							? timer_light
							: timer
					}
					alt="Productivity"
					title="Productivity"
				/>
			</span>
		</div>
	);

	useEffect(() => {
		if (state === "home") {
			GET.home();
		} else if (state === "lists") {
			GET.lists();
		} else if (state === "goals") {
			GET.goals();
		}
	}, [state]);

	useEffect(() => {
		if (state === "timer") {
			GET.timer();
		}
	}, [state, timer_feed_title]);

	useEffect(() => {
		Keyboard.addListener("keyboardDidShow", () => setKeyboardUp(true));
		Keyboard.addListener("keyboardDidHide", () => setKeyboardUp(false));

		return () => {
			Keyboard.removeAllListeners();
		};
	}, []);

	return <>{bottom_nav_limit_state ? static_jsx : link_jsx}</>;
};

export default BottomNav;
