import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Plugins } from "@capacitor/core";

import "./time.css";

import { focus_timeSET } from "../../../actions/focus_feed";
import Slider from "./slider/Slider";

const Time = (props) => {
	const { Storage } = Plugins;
	const dispatch = useDispatch();
	const focus_info_state = useSelector((state) => state.focus_info);
	const name_state = useSelector((state) => state.name);

	const [selected, setSelected] = useState(3600);

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

	const handleSelect = (selected_) => {
		if (selected_) {
			props.handleSelect({
				event_time: moment(new Date()).add(selected_, "s").toDate(),
				time: selected_,
				type: focus_info_state ? focus_info_state.type || null : null,
				steps: focus_info_state ? focus_info_state.steps || [] : [],
				text: focus_info_state ? focus_info_state.text || "" : "",
				extra: focus_info_state ? focus_info_state.extra || "" : "",
				focustime: focus_info_state ? focus_info_state.focustime || 0 : 0,
				url: focus_info_state ? focus_info_state.url || null : null,
				tag: focus_info_state ? focus_info_state.tag : null,
				tag_id: focus_info_state ? focus_info_state.tag_id : null,
			});
			dispatch(focus_timeSET(selected_));
		}
	};

	useEffect(() => {
		handleSelect(selected);
	}, [selected]);

	useEffect(() => {
		const getData = async () => {
			const data_local_raw = await Storage.get({ key: "focus" });
			const data_local = JSON.parse(data_local_raw.value);

			if (!data_local) {
				handleSelect(selected);
			}
		};

		getData();
	}, []);

	return (
		<div
			className="category"
			style={{ marginTop: "35px", textAlign: "center" }}
		>
			<div
				style={{ marginBottom: "15px", marginLeft: "5px", textAlign: "left" }}
			>
				I, {name_state} will commit to:
			</div>
			<Slider current={selected} handleSelect={(value) => setSelected(value)} />
			<span style={{ color: "#1395ff" }}>{readableTime(selected)}</span>
		</div>
	);
};

export default Time;
