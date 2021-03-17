import React, { useState, useEffect } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { Pie, defaults } from "react-chartjs-2";
import { merge } from "lodash";

import "./graph.css";

const Graph = (props) => {
	const darkMode = useSelector((state) => state.dark_mode);

	const today_timestamp = Date.parse(localStorage.getItem("today_timestamp"));
	const week_timestamp = Date.parse(localStorage.getItem("week_timestamp"));
	const toggle_state = useSelector((state) => state.toggle);

	const new_focus = JSON.parse(localStorage.getItem("new_focus"));
	const new_focus_week = JSON.parse(localStorage.getItem("new_focus_week"));
	const focus_timeout = useSelector((state) => state.focus_timeout);

	const [show_state, setShowState] = useState(false);
	const [graph, setData] = useState({ data: { values: [], labels: [] } });

	const show_valid_data = (data_list, labels_list) => {
		const new_data_list = [];
		const new_labels_list = [];
		const index_list = [];

		data_list.map((item, index) => {
			if (item > 0) {
				new_data_list.push(item);
				index_list.push(index);
			}
		});

		index_list.map((index) => {
			new_labels_list.push(labels_list[index]);
		});

		return { values: new_data_list, labels: new_labels_list };
	};

	merge(defaults, {
		global: {
			defaultFontFamily: "Poppins",
			defaultFontSize: 14,
			defaultFontColor: darkMode ? "white" : "black",
		},
	});
	const graphdata = {
		labels: props.data !== null ? [...graph.data.labels] : [],
		datasets: [
			{
				label: "Focused time: tags (minutes)",
				fill: false,
				lineTension: 0.1,
				backgroundColor: [
					"#1395ff",
					"#19A8EC",
					"#1FBCDA",
					"#24CFC7",
					"#2AE2B5",
					"#30F5A2",
				],
				borderColor: darkMode ? "#000" : "#fafafa",
				borderCapStyle: "butt",
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: "miter",
				pointBorderColor: "rgba(75,192,192,1)",
				pointBackgroundColor: "#fff",
				pointBorderWidth: 1,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: "rgba(75,192,192,1)",
				pointHoverBorderColor: "rgba(220,220,220,1)",
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 10,
				data: props.data !== null ? [...graph.data.values] : [],
			},
		],
		options: {
			legend: {
				labels: {
					padding: 20,
				},
			},
		},
	};

	const blank_graph = {
		labels: props.data !== null ? [...graph.data.labels] : [],
		datasets: [
			{
				label: "Focused time: tags (minutes)",
				fill: false,
				lineTension: 0.1,
				backgroundColor: "#1395ff",
				borderColor: "#1395ff",
				borderCapStyle: "butt",
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: "miter",
				pointBorderColor: "rgba(75,192,192,1)",
				pointBackgroundColor: "#fff",
				pointBorderWidth: 1,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: "rgba(75,192,192,1)",
				pointHoverBorderColor: "rgba(220,220,220,1)",
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 10,
				data: [],
			},
		],
	};

	useEffect(() => {
		let unmounted = false;
		const data_ = show_valid_data(props.data.values, props.data.labels);

		if (!unmounted) {
			setData({ data: { values: data_.values, labels: data_.labels } });
		}

		return () => {
			unmounted = true;
		};
	}, [toggle_state, focus_timeout]);

	useEffect(() => {
		let unmounted = false;

		if (toggle_state) {
			const now = moment();
			const days_passed = now.diff(week_timestamp, "days");

			if (days_passed >= 0 && days_passed <= 7 && new_focus_week) {
				if (!unmounted) {
					setShowState(true);
				}
			} else {
				setShowState(false);
			}
		} else {
			if (moment(today_timestamp).calendar().includes("Today") && new_focus) {
				if (!unmounted) {
					setShowState(true);
				}
			} else {
				setShowState(false);
			}
		}

		return () => {
			unmounted = true;
		};
	}, [toggle_state, new_focus, new_focus_week, focus_timeout]);

	return (
		<div className="pie">
			<Pie
				data={show_state ? graphdata : blank_graph}
				height={400}
				options={{
					maintainAspectRatio: true,
					scales: {
						yAxes: [
							{
								ticks: {
									beginAtZero: true,
									min: 0,
									userCallback: function (label, index, labels) {
										if (Math.floor(label) === label) {
											return null;
										}
									},
								},
							},
						],
					},
				}}
				legend={{
					align: "start",
					position: "bottom",
					labels: { boxWidth: 50, padding: 15 },
				}}
			/>
		</div>
	);
};

export default Graph;
