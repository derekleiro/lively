import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

import "./bottom-nav.css";

import { mode } from "../../constants/color";

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
import Dexie from "dexie";

import {
	most_focused,
	timer_feed,
	timer_feed_today,
	timer_feed_week,
	chart_data as chart_data_dispatch,
} from "../../actions/timer_feed";
import {
	dispatch_lists,
	dispatch_list_completed,
	dispatch_list_default,
	dispatch_list_important,
} from "../../actions/list_feed";
import { home_timeout_clear } from "../../actions/timeouts";

const BottomNav = (props) => {
	const dispatch = useDispatch();

	const state = useSelector((state) => state.bottom_nav);
	const tasks = useSelector((state) => state.todos.todos);
	const lists_feed = useSelector((state) => state.lists_feed.lists);
	const list_toggle = useSelector((state) => state.list_toggle);
	const my_goals_state = useSelector((state) => state.goals.goals);
	const chart_data_state = useSelector((state) => state.chart_data);
	const my__completed_goals_state = useSelector(
		(state) => state.completed_goals.completed
	);
	const timer_feed_state = useSelector((state) => state.timer_feed);
	const bottom_nav_limit_state = useSelector(
		(state) => state.bottom_nav_limit_state
	);
	const tip_state = useSelector((state) => state.tip_state);

	const today_timestamp = Date.parse(localStorage.getItem("today_timestamp"));
	const week_timestamp = Date.parse(localStorage.getItem("week_timestamp"));

	const new_focus = JSON.parse(localStorage.getItem("new_focus"));
	const new_focus_week = JSON.parse(localStorage.getItem("new_focus_week"));

	const todoDB = new Dexie("LivelyTodos");
	todoDB.version(1).stores({
		todos: `todo_url,desc,dueDate,category,tag,tag_id,steps,focustime,index,date_completed,remindMe,notes,todo_url,complete`,
	});

	const goalDB = new Dexie("LivelyGoals");
	goalDB.version(1).stores({
		goals: `goal_url,title,desc,steps,notes,focustime,date_completed,goal_url,complete`,
	});

	const timerDB = new Dexie("LivelyTime");
	timerDB.version(1).stores({
		times: "id, months, today, week",
	});

	const listDB = new Dexie("LivelyLists");
	listDB.version(1).stores({
		lists: `list_id,name,todo,completed,list_id,index`,
	});

	const tagDB = new Dexie("LivelyTags");
	tagDB.version(1).stores({
		tags: `id,total_focus,today,week,month`,
	});

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

	const setTimeWeek = (timestamp) => {
		const now = moment();
		const days_passed = now.diff(timestamp, "days");

		if (days_passed >= 0 && days_passed <= 7) {
			return true;
		} else {
			return false;
		}
	};

	const cleanup = () => {
		if (tasks.length > 25) {
			dispatch(todos_clear);
			dispatch(home_timeout_clear);
		}
	};

	const GET = {
		home: () => {
			const todos = async () => {
				const todosToday = await todoDB.todos
					.filter((todo) => {
						return setTime(todo.dueDate) === "Today";
					})
					.toArray();

				const todos = await todoDB.todos
					.filter((todo) => {
						return setTime(todo.dueDate) !== "Today" && todo.complete === 0;
					})
					.toArray();

				dispatch(
					dispatch_todos(
						[].concat(todosToday, todos).sort((todoA, todoB) => {
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
			const get_months = async () => {
				const my_feed_data = await timerDB.times.toArray();

				if (my_feed_data.length !== 0) {
					dispatch(timer_feed(my_feed_data[0].months));
				}
			};

			const get_today = async () => {
				const data = await timerDB.times
					.where("id")
					.equals("Today_DB")
					.toArray();

				if (data.length !== 0) {
					if (setTime(data[0].today.timestamp) === "Today") {
						dispatch(
							timer_feed_today({
								tasks: data[0].today.todos_count,
								goals: data[0].today.goals_count,
								totalFocus: data[0].today.total,
								tasksFocus: data[0].today.tasks,
								goalsFocus: data[0].today.goals,
								timestamp: data[0].today.timestamp,
							})
						);
					}
				}
			};

			const get_week = async () => {
				const data = await timerDB.times
					.where("id")
					.equals("Week_DB")
					.toArray();

				if (data.length !== 0) {
					if (setTimeWeek(data[0].week.timestamp)) {
						dispatch(
							timer_feed_week({
								tasks: data[0].week.todos_count,
								goals: data[0].week.goals_count,
								totalFocus: data[0].week.total,
								tasksFocus: data[0].week.tasks,
								goalsFocus: data[0].week.goals,
								timestamp: data[0].week.timestamp,
							})
						);
					}
				}
			};

			const chart_data = async () => {
				const tags = await tagDB.tags.toArray();
				const tags_today = tags.sort((tagA, tagB) => {
					return tagB.today.focused - tagA.today.focused;
				});
				const tags_week = tags.sort((tagA, tagB) => {
					return tagB.week.focused - tagA.week.focused;
				});

				let chart_data_today = {
					labels: [],
					values: [],
					ids: [],
				};

				let chart_data_week = {
					labels: [],
					values: [],
					ids: [],
				};

				let for_largest_today = {
					labels: [],
					values: [],
					ids: [],
				};

				let for_largest_week = {
					labels: [],
					values: [],
					ids: [],
				};

				const dispatch_item = (tag) => {
					chart_data_today.labels.push(
						tag.name.length > 9 ? `${tag.name.slice(0, 8)}...` : tag.name
					);
					chart_data_today.values.push(tag.today.focused / 60);
					chart_data_today.ids.push(tag.id);
				};

				const dispatch_item_week = (tag) => {
					chart_data_week.labels.push(
						tag.name.length > 9 ? `${tag.name.slice(0, 8)}...` : tag.name
					);
					chart_data_week.values.push(tag.week.focused / 60);
					chart_data_week.ids.push(tag.id);
				};

				for (let i = 0; i < tags_today.length; i++) {
					if (tags_today.length < 6) {
						dispatch_item(tags_today[i]);
					} else {
						if (i < 5) {
							dispatch_item(tags_today[i]);
						} else {
							chart_data_today.labels.push("Others");

							const new_list = tags_today.slice(5, tags_today.length + 1);
							chart_data_today.values.push(
								new_list.reduce((a, b) => a + b.today.focused / 60, 0)
							);
							chart_data_today.ids.push("others");
							break;
						}
					}
				}

				for (let i = 0; i < tags_week.length; i++) {
					if (tags_week.length < 6) {
						dispatch_item_week(tags_week[i]);
					} else {
						if (i < 5) {
							dispatch_item_week(tags_week[i]);
						} else {
							chart_data_week.labels.push("Others");

							const new_list = tags_week.slice(5, tags_week.length + 1);
							chart_data_week.values.push(
								new_list.reduce((a, b) => a + b.week.focused / 60, 0)
							);
							chart_data_week.ids.push("others");
							break;
						}
					}
				}

				tags.forEach((tag) => {
					for_largest_today.labels.push(tag.name);
					for_largest_today.values.push(tag.today.focused / 60);
					for_largest_today.ids.push(tag.id);

					for_largest_week.labels.push(tag.name);
					for_largest_week.values.push(tag.week.focused / 60);
					for_largest_week.ids.push(tag.id);
				});

				const get_today = () => {
					const largest = Math.max(...for_largest_today.values);
					const index = for_largest_today.values.findIndex(
						(val) => val === largest
					);

					return {
						name: for_largest_today.labels[index],
						id: for_largest_today.ids[index],
					};
				};

				const get_week = () => {
					const largest = Math.max(...for_largest_week.values);
					const index = for_largest_week.values.findIndex(
						(val) => val === largest
					);

					return {
						name: for_largest_week.labels[index],
						id: for_largest_week.ids[index],
					};
				};

				const most_focused_today = get_today();
				const most_focused_week = get_week();

				dispatch(
					most_focused({
						today: {
							name: most_focused_today.name,
							id: most_focused_today.id,
						},
						week: {
							name: most_focused_week.name,
							id: most_focused_week.id,
						},
					})
				);

				if (setTime(today_timestamp) === "Today" && new_focus) {
					dispatch(
						chart_data_dispatch({
							today: chart_data_today,
						})
					);
				} else {
					dispatch(
						chart_data_dispatch({
							today: null,
						})
					);
				}

				if (setTimeWeek(week_timestamp) && new_focus_week) {
					dispatch(
						chart_data_dispatch({
							week: chart_data_week,
						})
					);
				} else {
					dispatch(
						chart_data_dispatch({
							week: null,
						})
					);
				}
			};

			if (
				chart_data_state.today === null ||
				chart_data_state.week === null ||
				timer_feed_state.length === 0
			) {
				get_months();
				get_today();
				get_week();
				chart_data();
			}
		},
	};

	const link_jsx = (
		<div
			id="bottom-nav"
			style={{
				backgroundColor: props.darkMode ? `${mode.dark}` : `${mode.light}`,
				color: props.darkMode ? "white" : "black",
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
		} else if (state === "timer") {
			GET.timer();
		}
	}, [state]);

	return <>{bottom_nav_limit_state ? static_jsx : link_jsx}</>;
};

export default BottomNav;
