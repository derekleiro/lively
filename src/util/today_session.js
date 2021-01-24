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

const add_today_session = async (data) => {
    await timerDB.times.toArray().then(async (time) => {
        const today = time.filter((time) => time.id === "Today_DB");
        const data_ = {
            ...data,
            todos_count: data.todos_count === -1 ? 0 : data.todos_count,
            goals_count: data.goals_count === -1 ? 0 : data.goals_count,
        };

        if (today.length === 0) {
            await timerDB.times.add({
                id: "Today_DB",
                today: { ...data_, timestamp: new Date() },
            });
        } else {
            if (setTime(today[0].today.timestamp) === "Today") {
                const data_ = {
                    tasks: today[0].today.tasks + data.tasks,
                    goals: today[0].today.goals + data.goals,
                    total: today[0].today.total + data.total,
                    todos_count: compute_count(
                        today[0].today.todos_count,
                        data.todos_count
                    ),
                    goals_count: compute_count(
                        today[0].today.goals_count,
                        data.goals_count
                    ),
                    timestamp: today[0].today.timestamp,
                };

                await timerDB.times
                    .where("id")
                    .equals("Today_DB")
                    .modify((time) => {
                        time.today = data_;
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
                    .equals("Today_DB")
                    .modify((time) => {
                        time.today = data_;
                    });
            }
        }
    });
};

export default add_today_session;
