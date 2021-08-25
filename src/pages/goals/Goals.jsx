import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import "./goals.css";

import GoalsFeed from "../../components/goalsfeed/GoalsFeed";
import { navStateGoals } from "../../actions/bottom_nav";

const Goals = () => {
	const dispatch = useDispatch();

	const [fade, setFade] = useState(false);

	useEffect(() => {
		let unmounted = false;

		setTimeout(() => {
			if (!unmounted) {
				setFade(true);
			}
		}, 50);

		window.scrollTo(0, 0);
		dispatch(navStateGoals);

		return () => {
			unmounted = true;
		};
	}, [dispatch]);

	return (
		<div className="page" style={{ opacity: fade ? 1 : 0, margin: "25px 0 80px 0" }}>
			<GoalsFeed />
		</div>
	);
};

export default Goals;
