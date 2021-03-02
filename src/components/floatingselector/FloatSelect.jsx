import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { dispatch_selected_list } from "../../actions/float_selector";

import "./float-select.css";

import Item from "./Item/Item";

const FloatSelect = () => {
	const dispatch = useDispatch();
	const darkMode = useSelector((state) => state.dark_mode);
	const selected = useSelector((state) => state.float_selector_selected);
	const list_items = [
		{ name: "All" },
		{ name: "Studies" },
		{ name: "Lively Development" },
		{ name: "Physics" },
		{ name: "Maths" },
		{ name: "Computer Science" },
	];

	const style = {
		background: darkMode ? "#000" : "#FAFAFA",
	};

	const handleSelect = (selected) => {
		dispatch(dispatch_selected_list(selected));
	};
	const has_list_jsx = (
		<div id="float_Select" style={style}>
			{list_items.map((list, index) => {
				return (
					<div key={index}>
						<Item
							name={list.name}
							selected={selected === list.name}
							handleSelect={handleSelect}
						/>
					</div>
				);
			})}
		</div>
	);
	return <>{list_items.length !== 0 ? has_list_jsx : null}</>;
};

export default FloatSelect;
