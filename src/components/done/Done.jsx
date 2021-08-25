import React from "react";
import { useSelector } from "react-redux";

import "./done.css";
import { mode } from "../../constants/color";

import back_icon from "../../assets/icons/back.png";
import back_icon_light from "../../assets/icons/back_light.png";

const Done = (props) => {
	const dark_mode = useSelector((state) => state.dark_mode);

	const style = {
		background: dark_mode ? mode.dark : mode.light,
		zIndex: props.extra ? (props.priority ? 15 + props.priority : 15) : 2,
		overflow: "auto",
	};

	return (
		<div className="done" style={props.load ? style : null}>
			{props.exit ? (
				<div
					className="container_top_nav"
					style={{
						backgroundColor: dark_mode ? mode.dark : mode.light,
					}}
				>
					<span className="back_icon">
						<img
							onClick={props.handleClick}
							src={dark_mode ? back_icon_light : back_icon}
							alt="Go back"
						/>
					</span>
				</div>
			) : null}
			{props.children}
		</div>
	);
};

export default Done;
