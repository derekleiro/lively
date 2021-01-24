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

const add_week_session = async (data) => {
    await timerDB.times.toArray().then(async (time) => {
        const week = time.filter((time) => time.id === "Week_DB");
        const data_ = {
            ...data,
            todos_count: data.todos_count === -1 ? 0 : data.todos_count,
            goals_count: data.goals_count === -1 ? 0 : data.goals_count,
        };

        if (week.length === 0) {
            await timerDB.times.add({
                id: "Week_DB",
                week: { ...data_, timestamp: new Date() },
            });
        } else {
            if (setTime(week[0].week.timestamp)) {
                const data_ = {
                    tasks: week[0].week.tasks + data.tasks,
                    goals: week[0].week.goals + data.goals,
                    total: week[0].week.total + data.total,
                    todos_count: compute_count(
                        week[0].week.todos_count,
                        data.todos_count
                    ),
                    goals_count: compute_count(
                        week[0].week.goals_count,
                        data.goals_count
                    ),
                    timestamp: week[0].week.timestamp,
                };

                await timerDB.times
                    .where("id")
                    .equals("Week_DB")
                    .modify((time) => {
                        time.week = data_;
                    });
            } else {
                const data_ = {
                    tasks: data.tasks,
                    goals: data.goals,
                    total: data.total,
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
