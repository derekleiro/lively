import React from "react";
import { useSelector } from "react-redux";

import "./option.css";

import edit_complete from "../../../../assets/icons/edit_complete.png";
import edit_complete_light from "../../../../assets/icons/edit_complete_light.png";

const Option = (props) => {
	const darkMode = useSelector((state) => state.dark_mode);

	const readableTime = (time) => {
		const hours = Math.floor(time / 3600);
		const minutes = Math.floor(time / 60);

		if (minutes === 1) {
			return `${minutes} minute`;
		} else if (minutes < 1) {
			return `Less than a minute`;
		} else if (minutes < 60 && minutes > 1) {
			return `${minutes} minutes`;
		} else if (time % 3600 === 0) {
			if (time > 3600) {
				return `${hours} hours`;
			} else if (time === 3600) {
				return `${hours} hour`;
			}
		} else if (minutes > 60 && minutes < 120) {
            return `${hours} hours ${minutes % 60} minutes`;
        } else{
            return `${hours} hours ${minutes % 60 !== 0 ? ` ${minutes % 60} minutes` : ``}`;
        }
	};

	return (
		<div
			className="option"
			onClick={props.handleSelect.bind(this, props.value)}
		>
			<div
				className="option_name"
				style={{
					color:
						props.selected === props.value
							? "#1395ff"
							: darkMode
							? "white"
							: "black",
				}}
			>
				{readableTime(props.value)}
			</div>
			{props.selected === props.value ? (
				<img
					className="option_image"
					src={darkMode ? edit_complete_light : edit_complete}
					alt="selected category"
				></img>
			) : null}
		</div>
	);
};

export default Option;
