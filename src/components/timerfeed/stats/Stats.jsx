import React from "react";
import { useSelector } from "react-redux";

import "./stats.css";

const Stats = (props) => {
	const darkMode = useSelector((state) => state.dark_mode);

	const style = {
		smallTitle: {
			color: "#1395ff",
		},
		title: {
			fontFamily: "Poppins, san-serif",
		},
		highlight: {
			background: darkMode
				? "rgb(15, 15, 15)"
				: "rgb(240, 240, 240)",
			borderRadius: "35px",
			textAlign: "center",
			padding: "12.5px",
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

	return (
		<div className="top_highlight_contain" style={style.month}>
			<div className="top_highlights">
				<div
					className="_highlight"
					style={{ ...style.highlight, marginRight: "15px" }}
				>
					<div className="_highlight_contain">
						<div className="_value">
							{props.tasks ? `${props.tasks}` : "N/A"}
						</div>
						<div className="_title">{props.tasks > 1 ? "Tasks" : "Task"}</div>
						<div className="_title">completed</div>
					</div>
				</div>
				<div className="_highlight" style={style.highlight}>
					<div className="_highlight_contain">
						<div className="_value">
							{props.goals ? `${props.goals}` : "N/A"}
						</div>
						<div className="_title">{props.goals > 1 ? "Goals" : "Goal"}</div>
						<div className="_title">completed</div>
					</div>
				</div>
			</div>

			<div className="top_highlights">
				<div
					className="_highlight"
					style={{ ...style.highlight, marginRight: "15px" }}
				>
					<div className="_highlight_contain">
						<div className="_value">
							{props.totalFocus ? `${readableTime(props.totalFocus)}` : "N/A"}
						</div>
						<div className="_title">Total time</div>
						<div className="_title">focused</div>
					</div>
				</div>
				<div className="_highlight" style={style.highlight}>
					<div className="_highlight_contain">
						<div className="_value">{props.tag ? `"${props.tag}"` : "N/A"}</div>
						<div className="_title">Most focused</div>
						<div className="_title">tag</div>
					</div>
				</div>
			</div>

			<div className="top_highlights">
				<div
					className="_highlight"
					style={{ ...style.highlight, marginRight: "15px" }}
				>
					<div className="_highlight_contain">
						<div className="_value">
							{props.tasksFocus ? `${readableTime(props.tasksFocus)}` : "N/A"}
						</div>
						<div className="_title">Focused on</div>
						<div className="_title">tasks</div>
					</div>
				</div>

				<div className="_highlight" style={style.highlight}>
					<div className="_highlight_contain">
						<div className="_value">
							{props.goalsFocus ? `${readableTime(props.goalsFocus)}` : "N/A"}
						</div>
						<div className="_title">Focused on</div>
						<div className="_title">goals</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Stats;
