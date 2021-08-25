import React from "react";
import { Plugins } from "@capacitor/core";

import Done from "../done/Done";
import { useDispatch } from "react-redux";
import { set_lang } from "../../actions/home_feed";

const SetLang = (props) => {
	const dispatch = useDispatch();
	const { Storage } = Plugins;

	const handleLangSelect = async (lang) => {
		await Storage.set({
			key: "lang",
			value: JSON.stringify(lang),
		});

		dispatch(set_lang(lang));
		props.handleLangSelect();
	};

	return (
		<Done load={true} extra={true}>
			<div className="done_options">
				<div id="language_select" style={{ fontSize: "16px" }}>
					<div
						className="done_text"
						onClick={handleLangSelect.bind(this, "English")}
					>
						English
					</div>
					<div
						className="done_text"
						onClick={handleLangSelect.bind(this, "French")}
					>
						French
					</div>
					<div
						className="done_text"
						onClick={handleLangSelect.bind(this, "Spanish")}
					>
						Spanish
					</div>
					<div
						className="done_text"
						onClick={handleLangSelect.bind(this, "Japanese")}
					>
						Japanese
					</div>
					<div
						className="done_text"
						onClick={handleLangSelect.bind(this, "German")}
					>
						German
					</div>
					<div
						className="done_text"
						onClick={handleLangSelect.bind(this, "Korean")}
					>
						Korean
					</div>
				</div>
			</div>
		</Done>
	);
};

export default SetLang;
