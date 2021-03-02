import React from "react";
import { useSelector } from "react-redux";

import "./item.css";

const Item = (props) => {
	const darkMode = useSelector((state) => state.dark_mode);
	const style = {
		border: darkMode ? "solid 1px  #1A1A1A" : "solid 1px #f0f0f0",
		color: props.selected ? "white" : "auto",
		backgroundColor: props.selected ? "#1395ff" : "trasparent",
	};

	return (
		<div
			className="float_select_item"
			style={style}
			onClick={() => {
				props.handleSelect(props.name);
			}}
		>
			{props.name}
		</div>
	);
};

export default Item;
