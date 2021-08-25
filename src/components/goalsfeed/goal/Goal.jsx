import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Dexie from "dexie";
import { Howl } from "howler";
import moment from "moment";

import "./goal.css";

import checked_icon from "../../../assets/icons/edit_complete.png";
import checked_light from "../../../assets/icons/edit_complete_light.png";
import todo_incomplete from "../../../assets/icons/todo_incomplete.png";
import todo_incomplete_light from "../../../assets/icons/todo_incomplete_light.png";
import todo_complete_icon from "../../../assets/icons/todo_complete.png";
import tag_icon from "../../../assets/icons/tag.png";
import tag_light from "../../../assets/icons/tag_light.png";
import remind_icon from "../../../assets/icons/remind.png";
import remind_light from "../../../assets/icons/remind_light.png";
import focused_for_icon from "../../../assets/icons/timer.png";
import focused_for_icon_light from "../../../assets/icons/timer_light.png";

import {
	todo_desc,
	goal_summary,
	goal_complete,
	textarea_state,
	completed_goals,
	handle_focustime,
	dispatch_todo_steps,
	dispatch_todo_notes,
	add_switch_goal_update,
	handle_url,
	goals,
	remove_goal_complete,
	goal_index_completed,
	goal_index_home,
	handle_date_completed,
	todo_tag_selected,
	goal_deadline,
	back_index,
} from "../../../actions/add_feed";
import { focus_info } from "../../../actions/focus_feed";

import completed_sound from "../../../assets/sounds/for-sure.ogg";
import add_month from "../../../util/add_month";
import { reset_timer_feed } from "../../../actions/timer_feed";
import {
	goal_complete_timeout,
	goal_complete_timeout_reset,
} from "../../../actions/timeouts";
import { stats_add } from "../../../util/stats_add";

const sound = new Howl({
	src: [completed_sound],
	html5: true,
	preload: true,
	format: ["ogg"],
});

const Goal = (props) => {
	const dispatch = useDispatch();
	const darkMode = useSelector((state) => state.dark_mode);
	const goal_complete_state = useSelector((state) => state.goal_complete);

	const checked = props.complete;
	const stepsDone = props.steps.filter((step) => step.complete === 1).length;

	const style = {
		color: "grey",
		marginTop: "10px",
		paddingTop: "0px",
		lineHeight: "normal",
	};

	const db = new Dexie("LivelyGoals");
	db.version(1).stores({
		goals: `goal_url,title,desc,steps,notes,focustime,tag,tag_id,deadline,date_completed,goal_url,complete`,
	});

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

	const handleCompletedClick = async () => {
		dispatch(goal_complete_timeout);
		if (checked) {
			const goal = {
				goal_url: props.URL,
				complete: 0,
			};

			if (props.completedView) {
				dispatch(goals({ ...props.goal, complete: 0, date_completed: null }));
				dispatch(remove_goal_complete(goal));
			} else {
				dispatch(goal_complete(goal));
			}

			await db.goals
				.filter((goal) => {
					return goal.goal_url === props.URL;
				})
				.modify({ complete: 0, date_completed: null });

			add_month(new Date());
			dispatch(reset_timer_feed);

			stats_add({
				date: new Date(),
				tasks: 0,
				goals: 0,
				total: 0,
				todos_count: 0,
				goals_count: -1,
				tag: null,
			});
		} else {
			const goal = {
				goal_url: props.URL,
				complete: 1,
			};

			dispatch(goal_complete(goal));

			dispatch(
				completed_goals({
					title: props.goal_title,
					desc: props.goal_desc,
					steps: { steps: props.steps },
					notes: { notes: props.notes },
					focustime: props.focustime,
					goal_url: props.URL,
					complete: 1,
					date_completed: new Date(),
				})
			);

			sound.play();

			add_month(new Date());

			stats_add({
				date: new Date(),
				tasks: 0,
				goals: 0,
				total: 0,
				todos_count: 0,
				goals_count: 1,
				tag: null,
			});

			dispatch(reset_timer_feed);

			await db.goals
				.filter((goal) => {
					return goal.goal_url === props.URL;
				})
				.modify({ complete: 1, date_completed: new Date() });
		}

		const goal_timeout = setTimeout(() => {
			dispatch(goal_complete_timeout_reset);
			clearTimeout(goal_timeout);
		}, 800);
	};

	const dispatchGoalDetails = () => {
		dispatch(add_switch_goal_update);
		dispatch(todo_desc(props.goal_title));
		dispatch(goal_summary(props.goal_desc));
		dispatch(dispatch_todo_steps(props.steps));
		dispatch(dispatch_todo_notes(props.notes));
		dispatch(textarea_state(true));
		dispatch(handle_focustime(props.focustime ? props.focustime : 0));
		dispatch(handle_url(props.URL));
		dispatch(handle_date_completed(props.date_completed));
		dispatch(todo_tag_selected({ tag: props.tag, id: props.tag_id }));
		dispatch(goal_deadline(props.deadline ? props.deadline : null));
		if (props.completedView) {
			dispatch(back_index("g_completed"));
			dispatch(goal_index_completed);
		} else {
			dispatch(goal_index_home);
		}
	};

	const dispatchFocusDetails = () => {
		dispatch(
			focus_info({
				text: props.goal_title,
				focustime: props.focustime,
				url: props.URL,
				type: "goal",
				extra: props.goal_desc,
				steps: props.steps,
				tag: props.tag,
				tag_id: props.tag_id,
			})
		);
	};

	return (
		<div
			className="card"
			style={{ margin: props.completedView ? "12.5px 0" : "35px 0" }}
		>
			<div className="card-completed">
				<span onClick={goal_complete_state ? null : handleCompletedClick}>
					{checked ? (
						<img
							src={
								checked
									? todo_complete_icon
									: darkMode
									? todo_incomplete_light
									: todo_incomplete
							}
							alt="complete"
							style={{ width: "22.5px", height: "22.5px" }}
						/>
					) : (
						<Link to="/congrats">
							<img
								src={
									checked
										? todo_complete_icon
										: darkMode
										? todo_incomplete_light
										: todo_incomplete
								}
								alt="completed"
								style={{ width: "22.5px", height: "22.5px" }}
							/>
						</Link>
					)}
				</span>
			</div>
			<div className="card-content">
				<Link to={props.URL} onClick={dispatchGoalDetails}>
					<div
						className="card-desc"
						style={{
							textDecoration: checked ? "line-through" : "none",
							color: darkMode ? "white" : "black",
						}}
					>
						{props.goal_title}
					</div>
					<div className="card-due-date" style={style}>
						{props.goal_desc}
					</div>
				</Link>
				{props.deadline && props.complete === 0 ? (
					<div
						className="card-desc"
						style={{
							color: "#1395ff",
							marginTop: "15px",
							lineHeight: "1.8em",
						}}
					>
						<img
							src={darkMode ? remind_light : remind_icon}
							alt="Start focus"
							style={{
								width: "20px",
								height: "20px",
								verticalAlign: "middle",
								marginRight: "5px",
							}}
						/>
						{moment(props.deadline).fromNow()}
					</div>
				) : null}

				<div
					className="card-desc"
					style={{
						color: "grey",
						marginTop: "15px",
						lineHeight: "1.8em",
					}}
				>
					{checked ? null : (
						<span>
							<Link to={`/focus_${props.URL}`} onClick={dispatchFocusDetails}>
								<span className="start_focus">
									Start focus
									<img
										src={darkMode ? checked_light : checked_icon}
										alt="Start focus"
									/>
								</span>
							</Link>

							{props.notes.length !== 0 || props.focustime || props.tag || props.steps.length !== 0 ? (
								<span
									style={{ margin: `0 5px` }}
									dangerouslySetInnerHTML={{
										__html: `&#8226;`,
									}}
								></span>
							) : null}
						</span>
					)}

					{props.focustime ? (
						<span className="start_focus">
							<img
								src={darkMode ? focused_for_icon_light : focused_for_icon}
								alt="Start focus"
							/>{" "}
							{readableTime(props.focustime)}
						</span>
					) : null}
					
					{props.tag ? (
						<span className="card-due-section" style={{ paddingTop: "0px" }}>
							{props.focustime ? (
								<span
									style={{ margin: `0 5px` }}
									dangerouslySetInnerHTML={{
										__html: `&#8226;`,
									}}
								></span>
							) : null}
							<span>
								<img
									className="card-info-img"
									src={darkMode ? tag_light : tag_icon}
									alt={`Has the tag "${props.tag}"`}
								/>
								{props.tag}
							</span>
						</span>
					) : null}

					{props.steps.length !== 0 ? (
						<>
							{props.tag || props.focustime ? (
								<span
									style={{ margin: `0 5px` }}
									dangerouslySetInnerHTML={{
										__html: `&#8226;`,
									}}
								></span>
							) : null}
							{stepsDone} of {props.steps.length}{" "}
							{props.steps.length > 1 ? "Steps" : "Step"}
						</>
					) : null}

					{props.notes.length !== 0 ? (
						<>
							{props.steps.length !== 0 || props.tag || props.focustime? (
								<span
									style={{ margin: `0 5px` }}
									dangerouslySetInnerHTML={{
										__html: `&#8226;`,
									}}
								></span>
							) : null}
							{props.notes.length} {props.notes.length > 1 ? "Notes" : "Note"}
						</>
					) : null}
				</div>
			</div>
		</div>
	);
};

export default Goal;
