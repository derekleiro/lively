import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Pie, defaults } from "react-chartjs-2";
import { merge } from "lodash";

import "./graph.css";

const Graph = (props) => {
	const darkMode = useSelector((state) => state.dark_mode);

	const toggle_state = useSelector((state) => state.toggle);
	const focus_timeout = useSelector((state) => state.focus_timeout);

	const [data, setData] = useState({ data: { values: [], labels: [] } });

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

	const show_valid_data = (times_list, labels_list) => {
		const new_labels_list = [];
		const temp_time_list = [];

		const final_labels = [];
		const final_times = [];

		labels_list.forEach((item, index) => {
			new_labels_list.push(`${item}: [ ${readableTime(times_list[index])} ]`);
		});

		times_list.forEach((time, index) => {
			temp_time_list.push({ time, index });
		});

		const sorted_temp_time_list = temp_time_list.sort((a, b) => b.time - a.time);
		sorted_temp_time_list.forEach((item, index) => {
			if(labels_list[item.index] !== "Others"){
				final_times.push(item.time)
				final_labels.push(new_labels_list[item.index])
			}
		});

		if(new_labels_list[new_labels_list.length - 1] === "Others"){
			final_labels.push(new_labels_list[new_labels_list.length - 1]);
			final_times.push(times_list[times_list.length - 1]);
		}

		return { labels: final_labels, times: final_times };
	};

	merge(defaults, {
		global: {
			defaultFontFamily: "Poppins",
			defaultFontSize: 14,
			defaultFontColor: darkMode ? "white" : "black",
		},
	});
	const graphdata = {
		labels: props.data !== null ? data.labels : [],
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
					"#03be71",
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
				data: props.data !== null ? data.times : [],
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

	useEffect(() => {
		let unmounted = false;
		const data_ = show_valid_data(props.data.times, props.data.labels);

		if (!unmounted) {
			setData(data_);
		}

		return () => {
			unmounted = true;
		};
	}, [toggle_state, focus_timeout]);

	return (
		<div className="pie">
			<Pie
				data={graphdata}
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
