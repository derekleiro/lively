import Dexie from "dexie";
import moment from "moment";

const logDB = new Dexie("LivelyLogs");
logDB.version(1).stores({
	logs: "date, tasks, goals, total, todos_count, graph, goals_count",
});

const checkDate = (timestamp) => {
	return moment(timestamp).format("L");
};

const compute_count = (dbData, data) => {
	if (dbData <= 0 && data === -1) {
		return 0;
	} else {
		return dbData + data;
	}
};

const add_count = (dbData, data) => {
	if (data) {
		return dbData + data;
	} else {
		return dbData;
	}
};

export const stats_add = async (data) => {
	const exists = await logDB.logs
		.filter((log) => checkDate(log.date) === checkDate(data.date))
		.toArray();

	if (exists.length !== 0) {
		await logDB.logs
			.filter((log) => checkDate(log.date) === checkDate(data.date))
			.modify((log) => {
				log.tasks = add_count(log.tasks, data.tasks);
				log.goals = add_count(log.goals, data.goals);
				log.total = add_count(log.total, data.total);
				log.todos_count = compute_count(log.todos_count, data.todos_count);
				log.goals_count = compute_count(log.goals_count, data.goals_count);

				if (data.tag) {
					const tag = log.graph.filter((tag) => tag.id === data.tag.id);
					if (tag.length !== 0) {
						tag[0].time = tag[0].time + data.tag.time;
					} else {
						const new_tag = {
							name: data.tag.name,
							id: data.tag.id,
							time: data.tag.time,
						};
						log.graph.push(new_tag);
					}
				}
			});
	} else {
		if (data.tag) {
			await logDB.logs.add({
				date: data.date,
				tasks: data.tasks,
				goals: data.goals,
				total: data.total,
				todos_count: data.todos_count,
				goals_count: data.goals_count,
				graph: [
					{
						name: data.tag.name,
						id: data.tag.id,
						time: data.tag.time,
					},
				],
			});
		} else {
			await logDB.logs.add({
				date: data.date,
				tasks: data.tasks,
				goals: data.goals,
				total: data.total,
				todos_count: data.todos_count,
				goals_count: data.goals_count,
				graph: [],
			});
		}
	}
};
