import Dexie from "dexie";
import moment from "moment";

const logDB = new Dexie("LivelyLogs");
logDB.version(1).stores({
	logs: "date, tasks, goals, total, todos_count, graph, goals_count",
});

const checkTime = (timestamp) => {
	if (moment(timestamp).calendar().includes("Today")) {
		return "Today";
	} else if (moment(timestamp).calendar().includes("Yesterday")) {
		return "Yesterday";
	}
};

const checkWeekTime = (timestamp) => {
	const now = moment(new Date());
	return now.diff(timestamp, "days") < 8 && now.diff(timestamp, "days") >= 0;
};

const checkMonthTime = (timestamp) => {
	const month = moment(timestamp).format("MMMM");
	const year = moment(timestamp).format("yyyy");

	return `${month}, ${year}`;
};

export const get_today = async () => {
	const day = await logDB.logs
		.filter((log) => {
			return checkTime(log.date) === "Today";
		})
		.toArray();

	const new_labels = [];
	const new_times = [];

	if (day.length !== 0) {
		const sorted = day[0].graph.sort((a, b) => b.time - a.time);
		sorted.forEach((graph, index) => {
			if (index === 6) {
				new_labels.push("Others");
				new_times.push(graph.time);
			} else if (index > 6) {
				new_times[6] = new_times[6] + graph.time;
			} else {
				new_labels.push(graph.name);
				new_times.push(graph.time);
			}
		});

		const graph = {
			times: new_times,
			labels: new_labels,
		};

		return {
			goals: day[0].goals,
			goals_count: day[0].goals_count,
			tasks: day[0].tasks,
			tasks_count: day[0].todos_count,
			total: day[0].total,
			graph,
		};
	} else {
		return false;
	}
};

export const get_yesterday = async () => {
	const day = await logDB.logs
		.filter((log) => {
			return checkTime(log.date) === "Yesterday";
		})
		.toArray();

	const new_labels = [];
	const new_times = [];

	if (day.length !== 0) {
		const sorted = day[0].graph.sort((a, b) => b.time - a.time);
		sorted.forEach((graph, index) => {
			if (index === 6) {
				new_labels.push("Others");
				new_times.push(graph.time);
			} else if (index > 6) {
				new_times[6] = new_times[6] + graph.time;
			} else {
				new_labels.push(graph.name);
				new_times.push(graph.time);
			}
		});

		const graph = {
			times: new_times,
			labels: new_labels,
		};

		return {
			goals: day[0].goals,
			goals_count: day[0].goals_count,
			tasks: day[0].tasks,
			tasks_count: day[0].todos_count,
			total: day[0].total,
			graph,
		};
	} else {
		return false;
	}
};

export const get_week = async () => {
	const last_7_days = await logDB.logs
		.filter((log) => {
			return checkWeekTime(log.date);
		})
		.toArray();

	const new_goals = [];
	const new_tasks = [];
	const new_goal_count = [];
	const new_task_count = [];
	const new_total = [];
	const new_graph = [];

	if (last_7_days.length !== 0) {
		last_7_days.forEach((log) => {
			new_goals.push(log.goals);
			new_tasks.push(log.tasks);
			new_task_count.push(log.todos_count);
			new_goal_count.push(log.goals_count);
			new_total.push(log.total);
			new_graph.push(...log.graph.sort((a, b) => b.time - a.time));
		});

		const goals = new_goals.reduce((num1, num2) => num1 + num2);
		const goals_count = new_goal_count.reduce((num1, num2) => num1 + num2);
		const tasks = new_tasks.reduce((num1, num2) => num1 + num2);
		const tasks_count = new_task_count.reduce((num1, num2) => num1 + num2);
		const total = new_total.reduce((num1, num2) => num1 + num2);

		const new_labels = [];
		const new_times = [];

		const array_hashmap = new_graph.reduce((obj, item) => {
			const duplicates = new_graph.filter((log) => log.name === item.name);
			const times = [];
			duplicates.forEach((log) => {
				times.push(log.time);
			});

			obj[item.name] = {
				name: item.name,
				id: item.id,
				time: times.reduce((time, time2) => time + time2),
			};
			return obj;
		}, {});

		const mergedList = Object.values(array_hashmap);

		mergedList.forEach((graph, index) => {
			if (index === 6) {
				new_labels.push("Others");
				new_times.push(graph.time);
			} else if (index > 6) {
				new_times[6] = new_times[6] + graph.time;
			} else {
				new_labels.push(graph.name);
				new_times.push(graph.time);
			}
		});

		const graph = {
			times: new_times,
			labels: new_labels,
		};

		return {
			goals,
			goals_count,
			tasks,
			tasks_count,
			total,
			graph,
		};
	} else {
		return false;
	}
};

export const get_month = async (date) => {
	const this_month = await logDB.logs
		.filter((log) => {
			return checkMonthTime(log.date) === date;
		})
		.toArray();

	const new_goals = [];
	const new_tasks = [];
	const new_goal_count = [];
	const new_task_count = [];
	const new_total = [];
	const new_graph = [];

	if (this_month.length !== 0) {
		this_month.forEach((log) => {
			new_goals.push(log.goals);
			new_tasks.push(log.tasks);
			new_task_count.push(log.todos_count);
			new_goal_count.push(log.goals_count);
			new_total.push(log.total);
			new_graph.push(...log.graph.sort((a, b) => b.time - a.time));
		});

		const goals = new_goals.reduce((num1, num2) => num1 + num2);
		const goals_count = new_goal_count.reduce((num1, num2) => num1 + num2);
		const tasks = new_tasks.reduce((num1, num2) => num1 + num2);
		const tasks_count = new_task_count.reduce((num1, num2) => num1 + num2);
		const total = new_total.reduce((num1, num2) => num1 + num2);

		const new_labels = [];
		const new_times = [];

		const arrayHashmap = new_graph.reduce((obj, item) => {
			const duplicates = new_graph.filter((log) => log.name === item.name);
			const times = [];
			duplicates.forEach((log) => {
				times.push(log.time);
			});

			obj[item.name] = {
				name: item.name,
				id: item.id,
				time: times.reduce((time, time2) => time + time2),
			};
			return obj;
		}, {});

		const mergedList = Object.values(arrayHashmap);

		mergedList.forEach((graph, index) => {
			if (index === 6) {
				new_labels.push("Others");
				new_times.push(graph.time);
			} else if (index > 6) {
				new_times[6] = new_times[6] + graph.time;
			} else {
				new_labels.push(graph.name);
				new_times.push(graph.time);
			}
		});

		const graph = {
			times: new_times,
			labels: new_labels,
		};

		return {
			goals,
			goals_count,
			tasks,
			tasks_count,
			total,
			graph,
		};
	} else {
		return false;
	}
};
