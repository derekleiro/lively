import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Dexie from "dexie";

import "./full-report-feed.css";

import { mode } from "../../constants/color";
import back_icon from "../../assets/icons/back.png";
import back_icon_light from "../../assets/icons/back_light.png";
import Graph from "./graph/Graph";
import Review from "./review/Review";
import { dispatch_full_report } from "../../actions/full_report";

const FullReportFeed = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const darkMode = useSelector((state) => state.dark_mode);
	const full_report_state = useSelector(
		(state) => state.full_report_state.name
	);
	const report = useSelector((state) => state.report);

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

	const timerDB = new Dexie("LivelyTime");
	timerDB.version(1).stores({
		times: "id, months, today, week",
	});

	const tagDB = new Dexie("LivelyTags");
	tagDB.version(1).stores({
		tags: `id,total_focus,today,week,month`,
	});

	const readableTime = (time) => {
		const hours = Math.floor(time / 3600);
		const minutes = Math.floor(time / 60);

		if (minutes === 1) {
			return `${minutes} mins`;
		} else if (minutes < 1) {
			return `N/A`;
		} else if (minutes < 60 && minutes > 1) {
			return `${minutes} mins`;
		} else if (time % 3600 === 0) {
			if (time > 3600) {
				return `${hours} h`;
			} else if (time === 3600) {
				return `${hours} h`;
			}
		} else if (minutes > 60 && minutes < 120) {
			return `${hours} h ${minutes % 60} mins`;
		} else {
			return `${hours} h ${minutes % 60 !== 0 ? ` ${minutes % 60} mins` : ``}`;
		}
	};

	const get_today = async () => {
		const data = await timerDB.times.where("id").equals("Today_DB").toArray();

		if (data.length !== 0) {
			return {
				tasks: data[0].today.todos_count,
				goals: data[0].today.goals_count,
				totalFocus: data[0].today.total,
				tasksFocus: data[0].today.tasks,
				goalsFocus: data[0].today.goals,
				timestamp: data[0].today.timestamp,
			};
		}
	};

	const get_week = async () => {
		const data = await timerDB.times.where("id").equals("Week_DB").toArray();

		if (data.length !== 0) {
			return {
				tasks: data[0].week.todos_count,
				goals: data[0].week.goals_count,
				totalFocus: data[0].week.total,
				tasksFocus: data[0].week.tasks,
				goalsFocus: data[0].week.goals,
				timestamp: data[0].week.timestamp,
			};
		}
	};

	const chart_data = async () => {
		const tags = await tagDB.tags.toArray();
		let tags_to_use;

		if (full_report_state === "Today") {
			tags_to_use = tags.sort((tagA, tagB) => {
				return tagB.today.focused - tagA.today.focused;
			});
		} else if (full_report_state === "Week") {
			tags_to_use = tags.sort((tagA, tagB) => {
				return tagB.week.focused - tagA.week.focused;
			});
		}

		let chart_data_ = {
			labels: [],
			values: [],
			ids: [],
		};

		let for_largest = {
			labels: [],
			values: [],
			ids: [],
		};

		const dispatch_item = (tag) => {
			if (full_report_state === "Today") {
				chart_data_.labels.push(
					`${tag.name} : (${readableTime(tag.today.focused)})`
				);
				chart_data_.values.push(tag.today.focused / 60);
				chart_data_.ids.push(tag.id);
			} else if (full_report_state === "Week") {
				chart_data_.labels.push(
					`${tag.name} : (${readableTime(tag.week.focused)})`
				);
				chart_data_.values.push(tag.week.focused / 60);
				chart_data_.ids.push(tag.id);
			}
		};

		for (let i = 0; i < tags_to_use.length; i++) {
			if (tags_to_use.length < 6) {
				dispatch_item(tags_to_use[i]);
			} else {
				if (i < 5) {
					dispatch_item(tags_to_use[i]);
				} else {
					chart_data_.labels.push("Others");

					const new_list = tags_to_use.slice(5, tags_to_use.length + 1);
					chart_data_.values.push(
						new_list.reduce((a, b) => a + b.today.focused / 60, 0)
					);
					chart_data_.ids.push("others");
					break;
				}
			}
		}

		tags.forEach((tag) => {
			if (full_report_state === "Today") {
				for_largest.values.push(tag.today.focused / 60);
			} else if (full_report_state === "Week") {
				for_largest.values.push(tag.week.focused / 60);
			}
			for_largest.labels.push(tag.name);
			for_largest.ids.push(tag.id);
		});

		const get_largest = () => {
			const largest = Math.max(...for_largest.values);
			const index = for_largest.values.findIndex((val) => val === largest);

			return {
				name: for_largest.labels[index],
				id: for_largest.ids[index],
			};
		};

		const most_focused = get_largest();

		return {
			data: chart_data_,
			most_focused: {
				name: most_focused.name,
				id: most_focused.id,
			},
		};
	};

	const fetch_items = async () => {
		if (full_report_state === "Today") {
			const data = await get_today();
			chart_data().then((graphdata) => {
				dispatch(
					dispatch_full_report({
						data,
						graphdata,
					})
				);
			});
		} else if (full_report_state === "Week") {
			const data = await get_week();
			chart_data().then((graphdata) => {
				dispatch(
					dispatch_full_report({
						data,
						graphdata,
					})
				);
			});
		}
	};

	useEffect(() => {
		fetch_items();
	}, []);

	return (
		<div className="container">
			<div className="container_top_nav" style={style.topNav}>
				<span className="back_icon">
					<img
						src={darkMode ? back_icon_light : back_icon}
						alt="Go back"
						onClick={() => history.replace("/timer")}
					/>
				</span>
				<span className="title" style={style.title}>
					{full_report_state === "Today" ? "Today" : "Week"}
				</span>
			</div>

			<div style={{ marginTop: "60px" }}></div>

			<Review
				tasks={report.data.tasks}
				goals={report.data.goals}
				totalFocus={report.data.totalFocus}
				tasksFocus={report.data.tasksFocus}
				goalsFocus={report.data.goalsFocus}
				tag={report.graphdata.most_focused.name}
			/>
			<Graph data={report.graphdata.data} />
		</div>
	);
};

export default FullReportFeed;
