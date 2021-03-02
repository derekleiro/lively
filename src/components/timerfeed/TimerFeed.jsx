import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import moment from "moment";

import "./timer-feed.css";

import { mode } from "../../constants/color";
import Month from "./month/Month";
import Done from "../done/Done";

import focus_icon from "../../assets/icons/focus.png";
import loading from "../../assets/icons/loading.gif";
import toggleDown from "../../assets/icons/expand.png";
import toggleDownLight from "../../assets/icons/expand_light.png";

import toggleUp from "../../assets/icons/collapse.png";
import toggleUpLight from "../../assets/icons/collapse_light.png";

import tag from "../../assets/icons/tag.png";
import tag_light from "../../assets/icons/tag_light.png";

import { add_focus_timeout } from "../../actions/timeouts";
import Today from "./today/Today";
import Week from "./week/Week";
import {
	clear_chart_data,
	toggle_today,
	toggle_week,
} from "../../actions/timer_feed";
import { dispatch_full_report_state } from "../../actions/full_report";
import Graph from "./graph/Graph";

const TimerFeed = () => {
	const dispatch = useDispatch();
	const history = useHistory()

	const darkMode = useSelector((state) => state.dark_mode);
	const focus_timeout = useSelector((state) => state.focus_timeout);
	const timer_feed_today = useSelector((state) => state.timer_feed_today);
	const timer_feed_week = useSelector((state) => state.timer_feed_week);
	const toggle_state = useSelector((state) => state.toggle);
	const most_focused_state = useSelector((state) => state.most_focused);
	const chart_data_state = useSelector((state) => state.chart_data);

	const my_feed = useSelector((state) => state.timer_feed).sort(
		(timeA, timeB) => {
			return timeB.createdAt - timeA.createdAt;
		}
	);

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
		imgStyle: {
			width: "20px",
			height: "20px",
			marginLeft: "10px",
			verticalAlign: "middle",
		},
	};

	const toggle = () => {
		if (toggle_state) {
			dispatch(toggle_today);
		} else {
			dispatch(toggle_week);
		}
	};

	const setTime = (timestamp) => {
		if (moment(timestamp).calendar().includes("Today")) {
			return "Today";
		} else {
			return "";
		}
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

	const handleReportView = () => {
		if (toggle_state) {
			dispatch(dispatch_full_report_state({ timeframe: 1, name: "Week" }));
		} else {
			dispatch(dispatch_full_report_state({ timeframe: 0, name: "Today" }));
		}

		history.replace("/full_report");
	};

	useEffect(() => {
		if (focus_timeout === 0) {
			const timeout = setTimeout(() => {
				dispatch(add_focus_timeout);
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

	return (
		<div className="container">
			<div className="container_top_nav" style={style.topNav}>
				<div className="title" style={style.title}>
					{toggle_state ? "Last 7 days" : "Today"}
					<span>
						<img
							src={
								darkMode
									? toggle_state
										? toggleUpLight
										: toggleDownLight
									: toggle_state
									? toggleUp
									: toggleDown
							}
							style={style.imgStyle}
							alt={
								toggle_state
									? "Switch to see Today's stats"
									: "Switch to view this Week's stats"
							}
							onClick={toggle}
						/>
					</span>
					<span>
						<img
							src={
								darkMode
									? toggle_state
										? toggleUpLight
										: toggleDownLight
									: toggle_state
									? toggleUp
									: toggleDown
							}
							style={style.imgStyle}
							alt={"See full report"}
							onClick={handleReportView}
						/>
					</span>
				</div>
				<Link to="/focus">
					<div style={style.new}>+ Start Focus</div>
				</Link>
			</div>

			<div className="space" style={{ marginTop: "90px" }}></div>

			{focus_timeout === 0 ? (
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
					{toggle_state ? (
						<>
							<Week
								tasks={timer_feed_week.tasks}
								goals={timer_feed_week.goals}
								totalFocus={timer_feed_week.totalFocus}
								tasksFocus={timer_feed_week.tasksFocus}
								goalsFocus={timer_feed_week.goalsFocus}
								timestamp={timer_feed_week.timestamp}
								tag={
									most_focused_state.week ? most_focused_state.week.name : ""
								}
							/>
							{chart_data_state.week ? (
								<Graph data={chart_data_state.week} />
							) : null}
						</>
					) : (
						<>
							<Today
								tasks={timer_feed_today.tasks}
								goals={timer_feed_today.goals}
								totalFocus={timer_feed_today.totalFocus}
								tasksFocus={timer_feed_today.tasksFocus}
								goalsFocus={timer_feed_today.goalsFocus}
								timestamp={timer_feed_today.timestamp}
								tag={
									most_focused_state.today ? most_focused_state.today.name : ""
								}
							/>
							{chart_data_state.today ? (
								<Graph data={chart_data_state.today} />
							) : null}
						</>
					)}

					{toggle_state ? (
						!chart_data_state.week ? (
							<div className="tip">
								<span>Tip: To get graph data, focus on a tag </span>
								<span>
									<img src={darkMode ? tag_light : tag} alt="tag icon" />
								</span>
							</div>
						) : null
					) : !chart_data_state.today ? (
						<div className="tip">
							<span>Tip: To get graph data, focus on a tag </span>
							<span>
								<img src={darkMode ? tag_light : tag} alt="tag icon" />
							</span>
						</div>
					) : null}

					<hr
						style={{
							borderTop: 0,
							border: darkMode
								? "1px solid rgb(30, 30, 30)"
								: "1px solid rgb(240, 240, 240)",
						}}
					/>

					{my_feed.map((data, index) => {
						return (
							<div key={index}>
								<Month
									month={data.month}
									goalsFocus={data.goalsFocus}
									completedGoals={data.completedGoals}
									tasksFocus={data.tasksFocus}
									completedTasks={data.completedTasks}
									year={data.year}
									focusTime={data.totalFocus}
								/>
							</div>
						);
					})}
				</>
			)}

			{my_feed.length === 0 ? (
				<div className="done_alt">
					<div className="done_options">
						<img src={focus_icon} alt="Focus on your targets!" />

						<div className="done_text">
							Start focusing towards a better life!
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
};

export default TimerFeed;
