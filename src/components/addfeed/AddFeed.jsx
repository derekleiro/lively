import React, { useEffect, useState } from "react";
import Dexie from "dexie";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

import "./add-feed.css";

import {
	add_switch_goal,
	add_switch_goal_update,
	add_switch_add,
	add_switch_add_update,
	todo_desc,
	todo_list_selected,
	todo_due_date,
	todo_remind_timestamp,
	todo_repeat_option,
	goal_summary,
	todo_steps_clear,
	todo_list_clear,
	todo_notes_clear,
	todos,
	todo_delete,
	goals,
	goal_delete,
	todo_complete_set,
	todo_important_set,
	textarea_state,
	handle_focustime,
	handle_url,
	todo_tag_selected,
	remove_notif,
	todos_clear,
	clear_completed_goals,
	handle_tip_state,
} from "../../actions/add_feed";

import { home_timeout_clear } from "../../actions/timeouts";

import back_icon from "../../assets/icons/back.png";
import back_icon_light from "../../assets/icons/back_light.png";
import tip_icon from "../../assets/icons/tip.png";

import TextBar from "./textbar/Textbar";
import Category from "./category/Category";
import DueDate from "./duedate/DueDate";
import Repeat from "./repeat/Repeat";
import Remind from "./remind/Remind";
import Notes from "./notes/Notes";
import { mode } from "../../constants/color";
import Summary from "./summary/Summary";
import {
	remove_notification,
	schedule_notification,
} from "../../util/notifications";
import { refresh_list_state } from "../../actions/list_feed";
import { list_timeout_clear } from "../../actions/timeouts";
import Tag from "../tag/Tag";
import { navStateLists } from "../../actions/bottom_nav";
import { clear_chart_data } from "../../actions/timer_feed";
import { session_add } from "../../util/session_add";
import add_session from "../../util/session";
import repeat from "../../util/repeat";
import Done from "../done/Done";

const AddFeed = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const darkMode = useSelector((state) => state.dark_mode);
	const switch_to_add = useSelector((state) => state.addfeed_switch);

	const TIPS_SECTION_1 = [
		"Have a challenging goal",
		"Distraction is the enemy of flow",
		"Small chunks are easier to digest than large ones",
		"It takes time to build momemntum",
		"Stress does not improve the situation, it adds on to it",
		"Failure is the best evidence that you're trying",
		"Don't give stress much attention",
		"The 80/20 Rule",
		"Feel like you want to stop a task after starting?",
		"If the task is too big, you're more likely to put it off.",
		"21 Days",
		"Reward yourself for every task done!",
		"Always distracted?",
		"Start with the easiest tasks",
		"You're more likely to procrastinate when you're tired",
	];

	const TIPS_SECTION_2 = [
		"Make sure you know what you are aiming for in this session and why you are aiming for it",
		"Once you gain momentum, maintain it.",
		"A great way to overcome procrastination is to have small easy to do tasks.",
		"You will feel a huge amount of resistance",
		"We are not so good at performing under pressure or stress.",
		"Being productive is not easy. Our bodies naturally build resistance.",
		"It does not deserve it",
		"20 percent of your activities will account for 80 percent of your results.",
		"That means you are about to break the 20 minute barrier",
		"Break done your tasks into very small chunks",
		"The average number of days to somewhat develop a habit. 66 days for the habit to become automatic",
		"This is called postive reinforcement. The main purpose of this app",
		"Download the YourHour app. It does a great job limiting your phone distractions",
		"This will help you build momentum to continue to tackle the harder tasks",
		"Simply not having enough sleep can actually hold you back",
	];

	const TIPS_SECTION_3 = [
		"The goal needs to be challenging enough for your skillset, not too difficult and not too easy",
		"Do not let distractions break your momentum as it will be hard to get back into it",
		"Think of what you want to achieve and make it even smaller",
		"But if you keep doing it, you will have enough momentum to keep going!",
		"It increases our chances of failure even if we were prepared. Accept the situation and take it a step at a time",
		"And so it is ok to fail, because you're trying",
		"",
		"And 80% of your activities will account for 20 percent of your results.",
		"Once you break past the 20 minute mark, your momentum will be suffient to keep doing the task. Don't give up!",
		"",
		"Keep going! The reward is sweet!",
		"While I congratulate you after every task and goal, I also encourage you to reward yourself for every task/goal done!",
		"I don't own the app, but I think it will really help you out",
		"",
		"Get enough sleep and reward yourself with a break after you have completed a task/goal",
	];

	const todo_complete_set_state = useSelector(
		(state) => state.todo_complete_set
	);
	const todo_desc_state = useSelector((state) => state.todo_desc);
	const todo_important_set_state = useSelector(
		(state) => state.todo_important_set
	);
	const todo_steps_state = useSelector((state) => state.todo_steps.steps);
	const todo_list_selected_state = useSelector(
		(state) => state.todo_list_selected
	);
	const todo_tag_selected_state = useSelector(
		(state) => state.todo_tag_selected
	);

	const todo_due_date_state = useSelector((state) => state.todo_due_date);
	const todo_remind_timestamp_state = useSelector(
		(state) => state.todo_remind_timestamp
	);
	const todo_notes_option_state = useSelector(
		(state) => state.todo_notes_option.notes
	);
	const todo_repeat_option_state = useSelector(
		(state) => state.todo_repeat_option
	);
	const todos_state = useSelector((state) => state.todos.todos);
	const goal_summary_state = useSelector((state) => state.goal_summary);
	const todo_index = useSelector((state) => state.todo_index);
	const back_index = useSelector((state) => state.back_index);
	const goal_index = useSelector((state) => state.goal_index);
	const notif_state = useSelector((state) => state.notif_state);
	const tip_state = useSelector((state) => state.tip_state);

	const [tipNumber, setTipNumber] = useState(2);

	const month = moment(new Date()).format("MMMM");
	const year = moment(new Date()).format("yyyy");

	const uid = window.location.href.substring(
		window.location.href.lastIndexOf("/") + 1
	);

	const style = {
		add: {
			color:
				switch_to_add === "add" || switch_to_add === "add_" ? "white" : "grey",
			margin: "0 5px",
			fontSize: "22px",
		},
		goal: {
			color:
				switch_to_add === "goal" || switch_to_add === "goal_"
					? "white"
					: "grey",
			margin: "0 5px",
			fontSize: "22px",
		},
		addDark: {
			color:
				switch_to_add === "add" || switch_to_add === "add_"
					? "black"
					: "lightgrey",
			margin: "0 5px",
			fontSize: "22px",
		},
		goalDark: {
			color:
				switch_to_add === "goal" || switch_to_add === "goal_"
					? "black"
					: "lightgrey",
			margin: "0 5px",
			fontSize: "22px",
		},
	};

	const todoDB = new Dexie("LivelyTodos");
	todoDB.version(1).stores({
		todos: `todo_url,desc,dueDate,category,tag,tag_id,steps,focustime,index,date_completed,remindMe,notes,todo_url,complete`,
	});

	const goalDB = new Dexie("LivelyGoals");
	goalDB.version(1).stores({
		goals: `goal_url,title,desc,steps,notes,focustime,date_completed,goal_url,complete`,
	});

	const listDB = new Dexie("LivelyLists");
	listDB.version(1).stores({
		lists: `list_id,name,todo,completed,list_id,index`,
	});

	const generateURL = (switch_to_add) => {
		const uuid = uuidv4();
		let url;
		if (switch_to_add === "add") {
			url = `add_${uuid}`;
		} else {
			url = `goal_${uuid}`;
		}

		return url;
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

	const clearState = () => {
		dispatch(todo_desc(""));
		dispatch(todo_steps_clear);
		dispatch(todo_list_selected(null));
		dispatch(todo_tag_selected({ tag: null, id: null }));
		dispatch(todo_list_clear);
		dispatch(todo_due_date(null));
		dispatch(todo_remind_timestamp(null));
		dispatch(todo_repeat_option(""));
		dispatch(goal_summary(""));
		dispatch(todo_notes_clear);
		dispatch(todo_complete_set(0));
		dispatch(todo_important_set(0));
		dispatch(textarea_state(false));
		dispatch(handle_focustime(0));
		dispatch(add_switch_add);
		dispatch(handle_url(""));
		dispatch(remove_notif);
	};

	const set_all_list = async () => {
		const list = await listDB.lists
			.filter((list) => {
				return list.list_id === "All_default" && list.default === true;
			})
			.toArray();

		if (list.length === 0) {
			await listDB.lists
				.add({
					name: "All",
					list_id: "All_default",
					index: 0,
					default: true,
				})
				.then(() => console.log("list added..."))
				.catch((e) => console.log(e));
		}
	};

	const add_todo = async () => {
		const url = generateURL(switch_to_add);

		const index = JSON.parse(localStorage.getItem("todo_index"));
		const todo_index = index + 1;

		const todo = {
			desc: todo_desc_state,
			dueDate: todo_due_date_state,
			category: todo_list_selected_state,
			tag: todo_tag_selected_state.tag,
			tag_id: todo_tag_selected_state.id,
			steps: { steps: todo_steps_state },
			focustime: 0,
			index: todo_index,
			remindMe: todo_remind_timestamp_state,
			notes: { notes: todo_notes_option_state },
			todo_url: url,
			complete: todo_complete_set_state,
			repeat: todo_repeat_option_state,
			important: todo_important_set_state,
			default: "All",
			date_completed: null,
		};

		dispatch(todos(todo));
		if (todos_state.length === 0) {
			const todosToday = await todoDB.todos
				.filter((todo) => {
					return setTime(todo.dueDate) === "Today";
				})
				.toArray();

			const todos_ = await todoDB.todos
				.filter((todo) => {
					return setTime(todo.dueDate) !== "Today" && todo.complete === 0;
				})
				.toArray();

			dispatch(
				todos(
					[].concat(todosToday, todos_).sort((todoA, todoB) => {
						return todoA.dueDate - todoB.dueDate;
					})
				)
			);
		}

		if (todo_remind_timestamp_state && !todo_complete_set_state) {
			schedule_notification(
				todo_remind_timestamp_state.timestamp,
				todo_desc_state,
				todo_index,
				{
					text: todo.desc,
					focustime: 0,
					url: todo.todo_url,
					type: "task",
					steps: todo.steps.steps,
					tag: todo.tag,
					tag_id: todo.tag_id,
				}
			);
		}

		localStorage.setItem("todo_index", todo_index);

		if (todo_complete_set_state) {
			const data_1 = {
				month,
				year,
				createdAt: new Date(),
				totalFocus: 0,
				tasksFocus: 0,
				goalsFocus: 0,
				completedGoals: 0,
				completedTasks: 1,
			};
			const todo = {
				desc: todo_desc_state,
				dueDate: todo_due_date_state,
				category: todo_list_selected_state,
				date_completed: new Date(),
				tag: todo_tag_selected_state.tag,
				tag_id: todo_tag_selected_state.id,
				steps: { steps: todo_steps_state },
				focustime: 0,
				index: todo_index,
				remindMe: todo_remind_timestamp_state,
				notes: { notes: todo_notes_option_state },
				todo_url: url,
				repeat: todo_repeat_option_state,
				complete: todo_complete_set_state,
				important: todo_important_set_state,
				default: "All",
			};
			await todoDB.todos.add(todo);

			repeat(todo).then((data) => {
				if (data) {
					const dispatch_timeout = setTimeout(() => {
						dispatch(todos(data));
						clearTimeout(dispatch_timeout);
					}, 500);
				}
			});

			add_session(data_1);
			session_add({
				tasks: 0,
				goals: 0,
				total: 0,
				todos_count: 1,
				goals_count: 0,
			});
		} else {
			await todoDB.todos.add(todo);
		}

		set_all_list();
		dispatch(add_switch_add);
		dispatch(refresh_list_state);
		dispatch(list_timeout_clear);
		clearState();
	};

	const add_goal = async () => {
		const goal = {
			title: todo_desc_state,
			desc: goal_summary_state,
			steps: { steps: todo_steps_state },
			notes: { notes: todo_notes_option_state },
			focustime: 0,
			goal_url: generateURL(switch_to_add),
			complete: todo_complete_set_state,
			createdAt: new Date(),
			date_completed: null,
		};

		dispatch(goals(goal));
		dispatch(add_switch_add);

		await goalDB.goals.add(goal);

		clearState();
	};

	const delete_todo = async () => {
		const todo = { todo_url: uid };
		dispatch(todo_delete(todo));

		remove_notification(todo_index);
		dispatch(refresh_list_state);
		dispatch(list_timeout_clear);

		await todoDB.todos
			.filter((todo) => {
				return todo.todo_url === uid;
			})
			.delete()
			.then(() => {
				dispatch(add_switch_add);
			});

		if (back_index === "_list") {
			history.goBack();
		} else {
			history.replace("/");
		}
	};

	const delete_goal = async () => {
		const goal = { goal_url: uid };
		dispatch(goal_delete(goal));

		await goalDB.goals
			.filter((goal) => {
				return goal.goal_url === uid;
			})
			.delete()
			.then(() => {
				dispatch(add_switch_add);
			});

		history.goBack();
	};

	useEffect(() => {
		setTipNumber(Math.floor(Math.random() * 15));

		if (notif_state) {
			dispatch(todos_clear);
			dispatch(home_timeout_clear);
			dispatch(navStateLists);
			dispatch(clear_chart_data);
		}

		return () => {
			dispatch(handle_tip_state);
			if (switch_to_add === "add_" || switch_to_add === "goal_") {
				clearState();
			}
		};
	}, []);

	useEffect(() => {
		return () => {
			dispatch(textarea_state(false));
			if (goal_index) {
				dispatch(clear_completed_goals);
			}
		};
	}, []);

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
							if (switch_to_add === "add" || switch_to_add === "add_") {
								if (back_index === "home" || back_index === "/") {
									history.replace("/");
								} else {
									history.goBack();
								}
							} else {
								if (back_index === "home" && switch_to_add === "goal") {
									history.replace("/goals");
								} else {
									history.goBack();
								}
							}
						}}
					/>
				</span>
				{switch_to_add === "add_" ? (
					<span
						className="title"
						onClick={() => {
							if (uid.slice(0, 4) === "add_") {
								dispatch(add_switch_add_update);
							} else {
								dispatch(add_switch_add);
							}
						}}
						style={darkMode ? style.add : style.addDark}
					>
						Todo
					</span>
				) : switch_to_add === "goal_" ? (
					<span
						className="title"
						onClick={() => {
							if (uid.slice(0, 5) === "goal_") {
								dispatch(add_switch_goal_update);
							} else {
								dispatch(add_switch_goal);
							}
						}}
						style={darkMode ? style.goal : style.goalDark}
					>
						Goal
					</span>
				) : (
					<>
						<span
							className="title"
							onClick={() => {
								if (uid.slice(0, 4) === "add_") {
									dispatch(add_switch_add_update);
								} else {
									dispatch(add_switch_add);
								}
							}}
							style={darkMode ? style.add : style.addDark}
						>
							Todo
						</span>{" "}
						|{" "}
						<span
							className="title"
							onClick={() => {
								if (uid.slice(0, 5) === "goal_") {
									dispatch(add_switch_goal_update);
								} else {
									dispatch(add_switch_goal);
								}
							}}
							style={darkMode ? style.goal : style.goalDark}
						>
							Goal
						</span>{" "}
					</>
				)}

				<div id="create_todo">
					{switch_to_add === "add" || switch_to_add === "add_" ? (
						<>
							{todo_desc_state && switch_to_add === "add" ? (
								<Link to="/" onClick={add_todo}>
									Create
								</Link>
							) : (
								<>
									{switch_to_add === "add" ? (
										<span style={{ color: "grey" }}>Create</span>
									) : (
										<span onClick={delete_todo}>Delete</span>
									)}
								</>
							)}
						</>
					) : (
						<>
							{switch_to_add === "goal" ? (
								<>
									{todo_desc_state && goal_summary_state ? (
										<Link to="/goals" onClick={add_goal}>
											Create
										</Link>
									) : (
										<span style={{ color: "grey" }}>Create</span>
									)}
								</>
							) : (
								<>
									<span style={{ color: "#1395ff" }} onClick={delete_goal}>
										Delete
									</span>
								</>
							)}
						</>
					)}
				</div>
			</div>

			<div className="space"></div>

			{tip_state === 0 ? (
				<Done load={true} extra={true}>
					<div className="done_options">
						<img
							style={{
								width: "100px",
								height: "100px",
							}}
							src={tip_icon}
							alt={`Some tips to help you beat procrastination`}
						/>

						<div className="big_text">{TIPS_SECTION_1[tipNumber]}</div>
						<div className="done_text">{TIPS_SECTION_2[tipNumber]}</div>
						<div className="done_text">{TIPS_SECTION_3[tipNumber]}</div>
						<span
							className="action_button"
							style={{
								margin: "0 30px",
								color: "#1395ff",
							}}
							onClick={() => {
								dispatch(handle_tip_state);
								if (switch_to_add === "add" || switch_to_add === "goal") {
									dispatch(textarea_state(false));
								}
							}}
						>
							Thanks
						</span>
					</div>
				</Done>
			) : null}

			{switch_to_add === "add" || switch_to_add === "add_" ? (
				<span>
					<TextBar />
					<Category />
					<Tag />
					<DueDate />
					<Remind />
					<Repeat />
					<Notes />
				</span>
			) : (
				<span>
					<TextBar goal={true} />
					<Summary />
					<Notes goal={true} />
				</span>
			)}
		</div>
	);
};

export default AddFeed;
