import Dexie from "dexie";
import moment from "moment";

const timerDB = new Dexie("LivelyTime");
timerDB.version(1).stores({
	times: "id, months, today, week",
});

const setTime = (timestamp) => {
	if (moment(timestamp).calendar().includes("Today")) {
		return "Today";
	} else {
		return "";
	}
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
		return  dbData + data;
	} else {
		return dbData;
	}
};

const add_today_session = async (data) => {
	await timerDB.times.toArray().then(async (time) => {
		const today = time.find((time) => time.id === "Today_DB");
		const data_ = {
			...data,
			todos_count: data.todos_count === -1 ? 0 : data.todos_count,
			goals_count: data.goals_count === -1 ? 0 : data.goals_count,
		};

		if (!today) {
			await timerDB.times.add({
				id: "Today_DB",
				today: { ...data_, timestamp: new Date() },
			});
		} else {
			if (setTime(today.today.timestamp) === "Today") {
				const data_ = {
					tasks: add_count(today.today.tasks, data.tasks),
					goals: add_count(today.today.goals, data.goals),
					total: add_count(today.today.total, data.total),
					todos_count: compute_count(
						today.today.todos_count,
						data.todos_count
					),
					goals_count: compute_count(
						today.today.goals_count,
						data.goals_count
					),
					timestamp: today.today.timestamp,
				};

				await timerDB.times
					.where("id")
					.equals("Today_DB")
					.modify((time) => {
						time.today = data_;
					});
			} else {
				const data_ = {
					tasks: data ? data.tasks : 0,
					goals: data ? data.goals : 0,
					total: data ? data.total : 0,
					todos_count: data.todos_count === -1 ? 0 : data.todos_count,
					goals_count: data.goals_count === -1 ? 0 : data.goals_count,
					timestamp: new Date(),
				};

				await timerDB.times
					.where("id")
					.equals("Today_DB")
					.modify((time) => {
						time.today = data_;
					});
			}
		}
	});
};

export default add_today_session;
