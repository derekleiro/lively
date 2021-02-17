import Dexie from "dexie";
import moment from "moment";

const timerDB = new Dexie("LivelyTime");
timerDB.version(1).stores({
	times: "id, months, today, week",
});

const setTime = (timestamp) => {
	const now = moment();
	const days_passed = now.diff(timestamp, "days");

	if (days_passed > 7) {
		return false;
	} else if (days_passed < 0) {
		return false;
	} else if (days_passed >= 0 && days_passed <= 7) {
		return true;
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

const add_week_session = async (data) => {
	await timerDB.times.toArray().then(async (time) => {
		const week = time.find((time) => time.id === "Week_DB");
		const data_ = {
			...data,
			todos_count: data.todos_count === -1 ? 0 : data.todos_count,
			goals_count: data.goals_count === -1 ? 0 : data.goals_count,
		};

		if (!week) {
			await timerDB.times.add({
				id: "Week_DB",
				week: { ...data_, timestamp: new Date() },
			});
		} else {
			if (setTime(week.week.timestamp)) {
				const data_ = {
					tasks: add_count(week.week.tasks, data.tasks),
					goals: add_count(week.week.goals, data.goals),
					total: add_count(week.week.total, data.total),
					todos_count: compute_count(
						week.week.todos_count,
						data.todos_count
					),
					goals_count: compute_count(
						week.week.goals_count,
						data.goals_count
					),
					timestamp: week.week.timestamp,
				};

				await timerDB.times
					.where("id")
					.equals("Week_DB")
					.modify((time) => {
						time.week = data_;
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
					.equals("Week_DB")
					.modify((time) => {
						time.week = data_;
					});
			}
		}
	});
};

export default add_week_session;
