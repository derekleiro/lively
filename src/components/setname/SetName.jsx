import React, { useState } from "react";
import { Plugins } from "@capacitor/core";

import Done from "../done/Done";
import { useSelector, useDispatch } from "react-redux";
import { set_name } from "../../actions/home_feed";
import welcome_icon from "../../assets/icons/done.png";

const SetName = (props) => {
	const dispatch = useDispatch();
	const darkMode = useSelector((state) => state.dark_mode);
	const name_state = useSelector((state) => state.name);
	const { Storage } = Plugins;

	const [text, setText] = useState(name_state);
	const handleInput = (e) => {
		e.target.value = e.target.value.replace(/[\r\n\v]+/g, "");
		setText(e.target.value);
	};

	const style = {
		outline: "0",
		background: "transparent",
		resize: "none",
		borderRadius: "35px",
		fontSize: "14px",
		color: "#1395ff",
		fontFamily: `"Poppins", san-serif`,
		height: "40px",
		width: "100%",
		border: darkMode
			? "1px solid rgb(30, 30, 30)"
			: "1px solid rgb(240, 240, 240)",
		position: "relative",
		minHeight: "auto",
		padding: "10px 0px 0px 0px",
		textAlign: "center",
		verticalAlign: "middle",
	};

	return (
		<Done load={true} extra={true} priority={2}>
			<div className="done_options">
				<img
					style={{
						width: "100px",
						height: "100px",
					}}
					src={welcome_icon}
					alt={`Welcome to Lively!`}
				/>
				<div className="big_text">Welcome!</div>
				<div className="done_text">
					Before we continue, let's personalize your experience! As with all
					data, this is also stored locally on your phone.
				</div>

				<div
					className="done_text"
					style={{
						position: "relative",
					}}
				>
					<textarea
						placeholder="Your first name e.g. Derek"
						className="text_bar_textarea"
						style={style}
						defaultValue={name_state}
						onChange={handleInput}
					></textarea>
				</div>

				<div
					className="action_button"
					style={{
						margin: "0 30px",
						color: text
							? text.trim() !== "" && text.trim().length < 11
								? "#1395ff"
								: "grey"
							: "grey",
					}}
					onClick={async () => {
						if (text) {
							if (text.trim() !== "" && text.trim().length < 11) {
								dispatch(set_name(text));
								await Storage.set({
									key: "name",
									value: JSON.stringify(text),
								});

								props.handleFinishNameSet();
							}
						}
					}}
				>
					Set Name{" "}
					<span
						style={{ margin: `0 5px` }}
						dangerouslySetInnerHTML={{
							__html: `&#8226;`,
						}}
					></span>{" "}
					{text ? <>{10 - text.length}</> : 10}
				</div>
			</div>
		</Done>
	);
};

export default SetName;
