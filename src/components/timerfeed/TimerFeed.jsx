import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Dexie from "dexie";
import moment from "moment";

import "./timer-feed.css";

import { mode } from "../../constants/color";

import toggleDown from "../../assets/icons/expand.png";
import toggleDownLight from "../../assets/icons/expand_light.png";

import tag_icon from "../../assets/icons/tag.png";
import tag_light from "../../assets/icons/tag_light.png";

import { add_focus_timeout, reset_focus_timeout } from "../../actions/timeouts";
import { reset_timer_feed, timer_feed_title } from "../../actions/timer_feed";
import Graph from "./graph/Graph";
import Loading from "../loading/Loading";
import Done from "../done/Done";
import Stats from "./stats/Stats";
import ThankYou from "../../pages/thank_you/ThankYou";

const TimerFeed = () => {
	const dispatch = useDispatch();

	const darkMode = useSelector((state) => state.dark_mode);
	const thanks_state = useSelector((state) => state.thanks);
	const focus_timeout = useSelector((state) => state.focus_timeout);
	const timer_feed_state = useSelector((state) => state.timer_feed);
	const title = useSelector((state) => state.timer_feed_title);

	const [showToggle, setShowToggle] = useState(false);
	const [tag, setTag] = useState("");
	const [showMonthsToggle, setShowMonthsToggle] = useState(false);
	const [months_list, setMonthsList] = useState([]);

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

	const logDB = new Dexie("LivelyLogs");
	logDB.version(1).stores({
		logs: "date, tasks, goals, total, todos_count, graph, goals_count",
	});

	const monthDB = new Dexie("LivelyMonths");
	monthDB.version(1).stores({
		month: "date",
	});

	const handle_months_list = async () => {
		const months = await monthDB.month.toArray();
		const sorted_months = months.sort(
			(month1, month2) => month2.date - month1.date
		);
		setMonthsList(sorted_months);
	};

	const toggle = () => {
		setShowToggle(true);
		handle_months_list();
	};

	const readableDate = (date) => {
		const month = moment(date).format("MMMM");
		const year = moment(date).format("yyyy");

		return `${month}, ${year}`;
	};

	const handleToday = async () => {
		if (title !== "Today") {
			dispatch(reset_timer_feed);
			dispatch(reset_focus_timeout);
			dispatch(timer_feed_title("Today"));
		}

		setShowToggle(false);
	};

	const handleYesterday = async () => {
		if (title !== "Yesterday") {
			dispatch(reset_timer_feed);
			dispatch(reset_focus_timeout);
			dispatch(timer_feed_title("Yesterday"));
		}

		setShowToggle(false);
	};

	const handleWeek = async () => {
		if (title !== "Past 7 days") {
			dispatch(reset_timer_feed);
			dispatch(reset_focus_timeout);
			dispatch(timer_feed_title("Past 7 days"));
		}

		setShowToggle(false);
	};

	const handleMonth = (month) => {
		if (title !== readableDate(month)) {
			dispatch(reset_timer_feed);
			dispatch(reset_focus_timeout);
			dispatch(timer_feed_title(readableDate(month)));
		}

		setShowToggle(false);
		setShowMonthsToggle(false);
	};

	useEffect(() => {
		if (focus_timeout === 0) {
			const timeout = setTimeout(() => {
				dispatch(add_focus_timeout);
				clearTimeout(timeout);
			}, 1500);
		}
	}, [focus_timeout]);

	useEffect(() => {
		let unmounted = false;
		var num = [23, 34, 56, 72, 1, 22];
		Math.max(...num);

		if (timer_feed_state.graph && !unmounted) {
			const longest_time = Math.max(...timer_feed_state.graph.times);
			const longest_time_index = timer_feed_state.graph.times.findIndex(
				(longest) => longest_time === longest
			);
			setTag(timer_feed_state.graph.labels[longest_time_index]);
		} else {
			setTag("");
		}

		return () => {
			unmounted = true;
		};
	}, [timer_feed_state]);

	return (
		<div className="container">
			<div className="container_top_nav" style={style.topNav}>
				<div className="title" style={style.title}>
					{title}
					<span>
						<img
							src={darkMode ? toggleDownLight : toggleDown}
							style={style.imgStyle}
							alt={"Your stats"}
							onClick={toggle}
						/>
					</span>
				</div>
				<Link to="/focus">
					<div style={style.new}>+ Start Focus</div>
				</Link>
			</div>

			<div className="space" style={{ marginTop: "90px" }}></div>

			{thanks_state && <ThankYou />}

			{showToggle ? (
				<Done
					exit={true}
					handleClick={() => {
						setShowMonthsToggle(false);
						setShowToggle(false);
					}}
					load={true}
					extra={true}
				>
					<div className="done_options" style={{ fontSize: "16px" }}>
						<div className="done_text" onClick={handleToday}>
							Today
						</div>
						<div className="done_text" onClick={handleYesterday}>
							Yesterday
						</div>
						<div className="done_text" onClick={handleWeek}>
							Past 7 days
						</div>
						<div
							className="done_text"
							onClick={() => {
								setShowMonthsToggle(true);
								setShowToggle(false);
							}}
						>
							Select Month
						</div>
					</div>
				</Done>
			) : null}

			{showMonthsToggle ? (
				<Done
					exit={true}
					handleClick={() => {
						setShowMonthsToggle(false);
						setShowToggle(true);
					}}
					load={true}
					extra={true}
				>
					<div className="done_options" style={{ fontSize: "16px" }}>
						{months_list.length === 0 && (
							<div className="done_text">No month data available</div>
						)}
						{months_list.map((month, index) => {
							return (
								<div
									key={index}
									className="done_text"
									onClick={() => handleMonth(month.date)}
								>
									{readableDate(month.date)}
								</div>
							);
						})}
					</div>
				</Done>
			) : null}

			{focus_timeout === 0 ? (
				<Loading />
			) : (
				<>
					<Stats
						tasks={timer_feed_state.tasks_count}
						goals={timer_feed_state.goals_count}
						totalFocus={timer_feed_state.total}
						tasksFocus={timer_feed_state.tasks}
						goalsFocus={timer_feed_state.goals}
						tag={tag}
					/>
					{timer_feed_state.graph ? (
						<>
							{timer_feed_state.graph.times.length !== 0 &&
							timer_feed_state.graph.labels.length !== 0 ? (
								<Graph data={timer_feed_state.graph} />
							) : null}
						</>
					) : null}

					{timer_feed_state.graph ? (
						<>
							{timer_feed_state.graph.times.length === 0 &&
							timer_feed_state.graph.labels.length === 0 ? (
								<div className="tip">
									<span>Tip: To get graph data, focus on a tag </span>
									<span>
										<img src={darkMode ? tag_light : tag_icon} alt="tag icon" />
									</span>
								</div>
							) : null}
						</>
					) : (
						<div className="tip">
							<span>Tip: To get graph data, focus on a tag </span>
							<span>
								<img src={darkMode ? tag_light : tag_icon} alt="tag icon" />
							</span>
						</div>
					)}
				</>
			)}
			<Link to="/log">
				<div className="log-time-btn">+ Log time</div>
			</Link>
		</div>
	);
};

export default TimerFeed;
