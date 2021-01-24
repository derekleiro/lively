import Dexie from "dexie";

const timerDB = new Dexie("LivelyTime");
timerDB.version(1).stores({
    times: "id, months, today, week",
});

const compute_count = (dbData, data) => {
    if (dbData === 0 && data === -1) {
        return 0;
    } else {
        return dbData + data;
    }
};

const add_session = async (data) => {
    await timerDB.times.toArray().then(async (months) => {
        if (months.length !== 0) {
            const month_session = months[0].months.filter((time) => {
                return time.month === data.month && time.year === data.year;
            });

            const index = months[0].months.findIndex((time) => {
                return time.month === data.month && time.year === data.year;
            });

            if (month_session.length !== 0) {
                const data_ = {
                    month: month_session[0].month,
                    year: month_session[0].year,
                    createdAt: month_session[0].createdAt,
                    totalFocus: month_session[0].totalFocus + data.totalFocus,
                    tasksFocus: month_session[0].tasksFocus + data.tasksFocus,
                    goalsFocus: month_session[0].goalsFocus + data.goalsFocus,
                    completedGoals: compute_count(
                        month_session[0].completedGoals,
                        data.completedGoals
                    ),
                    completedTasks: compute_count(
                        month_session[0].completedTasks,
                        data.completedTasks
                    ),
                };

                await timerDB.times
                    .where("id")
                    .equals("Months_DB")
                    .modify((time) => {
                        time.months[index] = data_;
                    });
            } else {
                const data_ = {
                    completedGoals:
                        data.completedGoals === -1 ? 0 : data.completedGoals,
                    completedTasks:
                        data.completedTasks === -1 ? 0 : data.completedTasks,
                };

                await timerDB.times
                    .where("id")
                    .equals("Months_DB")
                    .modify((time) => time.months.push({ ...data, ...data_ }));
            }
        } else {
            const data_ = {
                completedGoals:
                    data.completedGoals === -1 ? 0 : data.completedGoals,
                completedTasks:
                    data.completedTasks === -1 ? 0 : data.completedTasks,
            };

            await timerDB.times.add({
                id: "Months_DB",
                months: [{ ...data, ...data_ }],
            });
        }
    });
};

export default add_session;
