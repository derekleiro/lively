import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import "./slider.css";

import plus_icon from "../../../../assets/icons/plus.png";
import plus_icon_light from "../../../../assets/icons/plus_light.png";

import minus_icon from "../../../../assets/icons/minus.png";
import minus_icon_light from "../../../../assets/icons/minus_light.png";

const Slider = (props) => {
	const darkMode = useSelector((state) => state.dark_mode);

	const [slide, setSlide] = useState((props.current / 7200) * 100);

	const style = {
		slider: {
			border: darkMode
				? "1px solid rgb(26, 26, 26)"
				: "1px solid rgb(240, 240, 240)",
		},
		filler: {
			width: `${slide}%`,
		},
	};

	useEffect(() => {
		setSlide((props.current / 7200) * 100);
	}, [props]);

	return (
		<div id="time_slider_container">
			<div className="time_slider_controls">
				<img
					src={darkMode ? minus_icon_light : minus_icon}
					alt="Reduce Focus time"
					onClick={() => {
						if(props.current > 300){
							props.handleSelect(props.current - 300);
						}
					}}
				/>
			</div>
			<div id="time_slider" style={style.slider}>
				<div id="time_slider_filler" style={style.filler}></div>
			</div>
			<div className="time_slider_controls">
				<img
					src={darkMode ? plus_icon_light : plus_icon}
					alt="Reduce Focus time"
					onClick={() => {
						if (props.current < 7200) {
							props.handleSelect(props.current + 300);
						}
					}}
				/>
			</div>
		</div>
	);
};

export default Slider;
