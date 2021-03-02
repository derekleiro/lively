import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import "./goals-feed.css";

import { mode } from "../../constants/color";
import Goal from "./goal/Goal";
import Done from "../done/Done";

import goal from "../../assets/icons/goal_color.png";
import loading from "../../assets/icons/loading.gif";

import { add_switch_goal, textarea_state } from "../../actions/add_feed";
import { add_goal_timeout } from "../../actions/timeouts";

const GoalsFeed = () => {
	const dispatch = useDispatch();
	const darkMode = useSelector((state) => state.dark_mode);
	const goal_timeout = useSelector((state) => state.goal_timeout);
	const my_goals = useSelector((state) => state.goals.goals).sort(
		(goalA, goalB) => {
			return goalB.createdAt - goalA.createdAt;
		}
	);
	const tip_state = useSelector((state) => state.tip_state);

	const completed_goals = useSelector(
		(state) => state.completed_goals.completed
	).sort((goalA, goalB) => {
		return goalB.createdAt - goalA.createdAt;
	});

	const style = {
		topNav: {
			top: 0,
			height: "45px",
			backgroundColor: darkMode ? mode.dark : mode.light,
			display: "flex",
			alignItems: "center",
			padding: "15px 0 10px 0",
		},
		title: {
			flex: 1,
			paddingLeft: "20px",
		},
		new: {
			flex: 1,
			textAlign: "right",
			paddingRight: "20px",
			fontSize: "14px",
			color: "#1395ff",
		},
		style: {
			color: darkMode ? "white" : "black",
			fontFamily: `"Poppins", sans-serif`,
		},
	};

	useEffect(() => {
		if (goal_timeout === 0) {
			const timeout = setTimeout(() => {
				dispatch(add_goal_timeout);
				clearTimeout(timeout);
			}, 1500);
		}
	}, []);

	return (
		<div className="container">
			<div className="container_top_nav" style={style.topNav}>
				<span className="title" style={style.title}>
					Your Goals{" "}
					{my_goals.length !== 0 ? (
						<span>
							<span
								style={{ margin: `0 5px`, ...style }}
								dangerouslySetInnerHTML={{ __html: `&#8226;` }}
							></span>
							<span style={style.style}>{my_goals.length}</span>{" "}
						</span>
					) : null}
				</span>
				{completed_goals.length === 0 ? (
					<Link
						to="/add"
						onClick={() => {
							dispatch(add_switch_goal);
							if (tip_state === 0) {
								dispatch(textarea_state(true));
							}
						}}
					>
						<div style={style.new}>+ New Goal</div>
					</Link>
				) : (
					<Link to="/goals_completed">
						<div style={style.new}>Completed</div>
					</Link>
				)}
			</div>

			<div className="space" style={{ marginTop: "100px" }}></div>

			{my_goals.length === 0 ? (
				<Done>
					<div className="done_options">
						<img src={goal} alt="Add a new goal" />

						<div className="done_text">
							Time to focus on your goals! Add one now
						</div>
					</div>
				</Done>
			) : null}

			{goal_timeout === 0 ? (
				<Done load={true}>
					<div className="done_options">
						<img
							style={{ width: "35px", height: "35px" }}
							src={loading}
							alt="Loading your goals"
						/>
					</div>
				</Done>
			) : (
				<>
					{my_goals.map((goal, index) => {
						return (
							<div key={index}>
								<Goal
									goal_title={goal.title}
									goal_desc={goal.desc}
									notes={goal.notes.notes ? goal.notes.notes : []}
									focustime={goal.focustime}
									steps={goal.steps.steps ? goal.steps.steps : []}
									URL={goal.goal_url}
									complete={goal.complete}
									completedView={false}
									date_completed={goal.date_completed}
									tag={goal.tag ? goal.tag : null}
									tag_id={goal.tag_id ? goal.tag_id : null}
								/>
							</div>
						);
					})}
				</>
			)}
		</div>
	);
};

export default GoalsFeed;
