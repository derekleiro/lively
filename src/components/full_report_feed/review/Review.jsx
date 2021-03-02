import React from "react";

import "./review.css";

const Review = (props) => {
	const style = {
		smallTitle: {
			color: "#1395ff",
		},
		title: {
			fontFamily: "Poppins, san-serif",
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

	return (
		<div className="top_highlight_contain" style={style.month}>
			<div className="top_highlights">
				<div className="_highlight">
					<div className="_value">
						{props.tasks ? `${props.tasks} Tasks` : "N/A"}
					</div>
					<div className="_title">Completed</div>
				</div>
				<div className="_highlight">
					<div className="_value">
						{props.goals ? `${props.goals} Goals` : "N/A"}
					</div>
					<div className="_title">Completed</div>
				</div>
			</div>

			<div className="top_highlights">
				<div className="_highlight">
					<div className="_value">
						{props.totalFocus ? `${readableTime(props.totalFocus)}` : "N/A"}
					</div>
					<div className="_title">Total Focused</div>
				</div>
				<div className="_highlight">
					<div className="_value">{props.tag ? `"${props.tag}"` : "N/A"}</div>
					<div className="_title">Most Focused Tag</div>
				</div>
			</div>

			<div className="top_highlights">
				<div className="_highlight">
					<div className="_value">
						{props.tasksFocus ? `${readableTime(props.tasksFocus)}` : "N/A"}
					</div>
					<div className="_title">Focused on Tasks</div>
				</div>

				<div className="_highlight">
					<div className="_value">
						{props.goalsFocus ? `${readableTime(props.goalsFocus)}` : "N/A"}
					</div>
					<div className="_title">Focused on Goals</div>
				</div>
			</div>
		</div>
	);
};

export default Review;
