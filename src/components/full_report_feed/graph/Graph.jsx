import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Pie, defaults } from "react-chartjs-2";
import { merge } from "lodash";

import "./graph.css";

const Graph = (props) => {
	const darkMode = useSelector((state) => state.dark_mode);

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

	useEffect(() => {
		let unmounted = false;

		if (props.data) {
			const data_ = show_valid_data(props.data.values, props.data.labels);

			if (!unmounted) {
				setData({ data: { values: data_.values, labels: data_.labels } });
			}
		}

		return () => {
			unmounted = true;
		};
	}, []);

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
