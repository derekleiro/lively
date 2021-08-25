import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { Howl } from "howler";
import { useDispatch, useSelector } from "react-redux";

import thanks from "../../assets/icons/done.png";
import cheers from "../../assets/sounds/cheers.ogg";

import Done from "../../components/done/Done";
import { remove_thanks_modal } from "../../actions/home_feed";

const sound = new Howl({
	src: [cheers],
	loop: true,
	preload: true,
	sprite: {
		cheer: [0, 5193],
	},
	format: ["ogg"],
});
const ThankYou = (props) => {
	const dispatch = useDispatch();

	const name_state = useSelector((state) => state.name);

	const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

	const randomInRange = (min, max) => {
		return Math.random() * (max - min) + min;
	};

	useEffect(() => {
		sound.play("cheer");
		const interval = setInterval(function () {
			const particleCount = 50;
			confetti(
				Object.assign({}, defaults, {
					particleCount,
					origin: {
						x: randomInRange(0.1, 0.3),
						y: Math.random() - 0.2,
					},
				})
			);
			confetti(
				Object.assign({}, defaults, {
					particleCount,
					origin: {
						x: randomInRange(0.7, 0.9),
						y: Math.random() - 0.2,
					},
				})
			);
		}, 500);

		return () => {
			sound.stop();
			clearInterval(interval);
		};
	}, []);

	const handleClick = () => {
		dispatch(remove_thanks_modal);
	};

	return (
		<Done exit={true} load={true} handleClick={handleClick} extra={true}>
			<div className="done_options">
				<img src={thanks} alt="Thank you for your support!" />
				<div className="done_text">
					"The best way to succeed, is by helping others"
				</div>
				<div className="done_text">
					Thank You {name_state} ❤ Feel proud of your contribution today. You
					are progressing software meant to help people. Your support means a
					lot to the development of the app.
				</div>
			</div>
		</Done>
	);
};

export default ThankYou;
