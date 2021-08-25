import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import autosize from "autosize";
import { Plugins } from "@capacitor/core";
import { EmailComposer } from "@ionic-native/email-composer";
import { useHistory } from "react-router";

import Done from "../../components/done/Done";

const Email = (props) => {
	const { Device, App } = Plugins;

	const history = useHistory();
	const darkMode = useSelector((state) => state.dark_mode);

	const [option, setOption] = useState("issue");
	const [text, setText] = useState("");
	const [hasPermission, setHasPermission] = useState(false);

	const elemStyle = {
		background: darkMode ? "rgb(15, 15, 15)" : "rgb(240, 240, 240)",
	};

	const buttonStyle = {
		outline: 0,
		border: 0,
		borderRadius: "35px",
		color: text.trim() !== "" ? "white" : darkMode ? "white" : "black",
		fontFamily: "Poppins",
		background:
			text.trim() !== ""
				? "#1395ff"
				: darkMode
				? "rgb(15, 15, 15)"
				: "rgb(240, 240, 240)",
		padding: "10px 15px",
	};

	const selectStyle = {
		outline: 0,
		border: 0,
		borderRadius: "35px",
		color: "#1395ff",
		fontFamily: "Poppins",
		background: "transparent",
		padding: "15px",
	};

	const handleTextInput = (e) => {
		setText(e.target.value);
	};

	const handleCheck = () => {
		if (hasPermission) {
			setHasPermission(false);
		} else {
			setHasPermission(true);
		}
	};

	const handleSubmit = async (e) => {
		const email = {
			to: "derekleiro@pm.me",
			subject: `RE: Reporting ${
				option === "issue" ? "an issue on Lively" : "a suggestion for Lively"
			}`,
			body: `${text}<br/><br/>${
				hasPermission && "Device Information passed from your device: <br/>"
			}${hasPermission && JSON.stringify(await Device.getInfo())}`,
			isHtml: true,
		};

		EmailComposer.open(email);
	};

	const textarea = (c) => {
		if (c) {
			c.focus();
			autosize(c);
		}
	};
	
	return (
		<Done
			load={true}
			extra={true}
			exit={true}
			handleClick={() => props.close()}
		>
			<div
				className="done_options"
				style={{ width: "100%", padding: "0 15px" }}
			>
				<div className="element" style={elemStyle}>
					<span className="text" style={{ flex: "1", textAlign: "left" }}>
						<label>What are you reporting? :</label>
					</span>
					<span style={{ flex: "1", textAlign: "right" }}>
						<select
							name="options"
							id="options"
							defaultValue={option}
							style={selectStyle}
							onChange={(e) => setOption(e.target.value)}
						>
							<option value="issue">An issue</option>
							<option value="suggestion">A suggestion</option>
						</select>
					</span>
				</div>
				<div className="element" style={elemStyle}>
					<span className="text" style={{ flex: "1", textAlign: "left" }}>
						<textarea
							name="new list"
							ref={(c) => textarea(c)}
							placeholder={`What is your ${option}?`}
							onChange={handleTextInput}
							style={{
								color: darkMode ? "white" : "black",
								fontSize: "14px",
								flex: 2,
								outline: 0,
								border: 0,
								height: "20px",
								width: "100%",
								maxHeight: "250px",
								marginTop: "-2px",
								resize: "none",
								background: "transparent",
								fontFamily: `"Poppins", san-serif`,
							}}
						></textarea>
					</span>
				</div>
				<div className="element" style={elemStyle}>
					<span className="text" style={{ flex: "1", textAlign: "left" }}>
						Include device info?
					</span>
					<span style={{ flex: "1", textAlign: "right" }}>
						<label className="switch">
							<input
								type="checkbox"
								checked={hasPermission}
								onChange={handleCheck}
							/>
							<span className="slider round"></span>
						</label>
					</span>
				</div>

				<button
					type="submit"
					style={buttonStyle}
					onClick={text.trim() === "" ? null : handleSubmit}
				>
					Submit
				</button>
			</div>
		</Done>
	);
};

export default Email;
