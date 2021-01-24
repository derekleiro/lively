import Dexie from "dexie";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { schedule_notification } from "./notifications";

const db = new Dexie("LivelyTodos");
db.version(1).stores({
    todos: `todo_url,desc,dueDate,category,steps,focustime,remindMe,origin_id,notes,todo_url,complete`,
});

const generateURL = () => {
    const uuid = uuidv4();
    const url = `add_${uuid}`;

    return url;
};

const newDueDate = (repeat, data) => {
    const daily = moment(data).add(1, "days").toDate();
    const weekend_skip = moment(data).add(3, "days").toDate();
    const weekday_skip = moment(data).add(6, "days").toDate();
    const isweekday = moment(data).isoWeekday(); // 1 - 5 is counted as a weekday. 6 & 7 are weekends
    const weekly = moment(data).add(7, "days").toDate();
    const monthly = moment(data).add(1, "M").toDate();

    const twodayskip = moment(data).add(2, "days").toDate();
    const fourdayskip = moment(data).add(4, "days").toDate();
    const fivedayskip = moment(data).add(5, "days").toDate();

    if (repeat === "Daily") {
        return daily;
    } else if (repeat === "Weekdays") {
        if (isweekday >= 1 && isweekday <= 4) {
            return daily;
        } else if (isweekday === 5) {
            return weekend_skip;
        } else if (isweekday === 6) {
            return twodayskip;
        } else {
            return daily;
        }
    } else if (repeat === "Weekends") {
        if (isweekday === 5 || isweekday === 6) {
            return daily;
        } else if (isweekday === 7) {
            return weekday_skip;
        } else if (isweekday === 4) {
            return twodayskip;
        } else if (isweekday === 3) {
            return weekend_skip;
        } else if (isweekday === 2) {
            return fourdayskip;
        } else {
            return fivedayskip;
        }
    } else if (repeat === "Weekly") {
        return weekly;
    } else if (repeat === "Monthly") {
        return monthly;
    }
};

const setTime = (timestamp) => {
    if (moment(timestamp).calendar().includes("Yesterday")) {
        return "Yesterday";
    } else if (moment(timestamp).calendar().includes("Today")) {
        return "Today";
    } else if (moment(timestamp).calendar().includes("Tomorrow")) {
        return "Tomorrow";
    } else {
        return moment(timestamp).format("ddd MMM Do YYYY");
    }
};

const remindMeObject = (data, add) => {
    const remindMe = {
        timestamp_parsed: `${setTime(add)}, ${data.hour}:${data.min} ${
            data.ampm
        }`,
        hour: data.hour,
        min: data.min,
        ampm: data.ampm,
        selectedDate: add,
        timestamp: add,
    };

    return remindMe;
};

const newRemind = (data, repeat, desc, index, todo_data) => {
    const daily = moment(data.timestamp).add(1, "days").toDate();
    const weekend_skip = moment(data.timestamp).add(3, "days").toDate();
    const weekday_skip = moment(data.timestamp).add(6, "days").toDate();
    const isweekday = moment(data.timestamp).isoWeekday(); // 1 - 5 is counted as a weekday. 6 & 7 are weekends
    const weekly = moment(data.timestamp).add(7, "days").toDate();
    const monthly = moment(data.timestamp).add(1, "M").toDate();

    if (repeat === "Daily") {
        schedule_notification(daily, desc, index, todo_data);
        return remindMeObject(data, daily);
    } else if (repeat === "Weekdays") {
        if (isweekday >= 1 && isweekday <= 4) {
            schedule_notification(daily, desc, index, todo_data);
            return remindMeObject(data, daily);
        } else if (isweekday === 5) {
            schedule_notification(weekend_skip, desc, index, todo_data);
            return remindMeObject(data, weekend_skip);
        }
    } else if (repeat === "Weekends") {
        if (isweekday === 5 || isweekday === 6) {
            schedule_notification(daily, desc, index, todo_data);
            return remindMeObject(data, daily);
        } else if (isweekday === 7) {
            schedule_notification(weekday_skip, desc, index, todo_data);
            return remindMeObject(data, weekday_skip);
        }
    } else if (repeat === "Weekly") {
        schedule_notification(weekly, desc, index, todo_data);
        return remindMeObject(data, weekly);
    } else if (repeat === "Monthly") {
        schedule_notification(monthly, desc, index, todo_data);
        return remindMeObject(data, monthly);
    }
};

const repeat = async (data) => {
    const { repeat } = data;

    if (repeat !== "Never") {
        const tomorrow = newDueDate(repeat, data.dueDate);
        const tomorrow_day = moment(tomorrow).format("ddd MMM Do YYYY");

        const todo = await db.todos
            .filter(
                (todo) =>
                    (data.origin_id
                        ? todo.origin_id === data.origin_id
                        : todo.origin_id === data.todo_url) &&
                    moment(todo.dueDate).format("ddd MMM Do YYYY") ===
                        tomorrow_day
            )
            .toArray();

        if (todo.length === 0) {
            const new_set = [];

            data.steps.steps.forEach((step) => {
                new_set.push({ ...step, complete: 0 });
            });

            const url = generateURL();

            const localindex = JSON.parse(localStorage.getItem("todo_index"));
            const index = localindex + 1;
            localStorage.setItem("todo_index", index);

            const new_todo = {
                desc: data.desc,
                dueDate: newDueDate(repeat, data.dueDate),
                category: data.category,
                tag: data.tag,
                tag_id: data.tag_id,
                steps: { steps: new_set },
                focustime: data.focustime,
                index,
                remindMe: data.remindMe
                    ? newRemind(data.remindMe, repeat, data.desc, index, {
                          text: data.desc,
                          focustime: data.focustime ? data.focustime : 0,
                          url: data.todo_url,
                          type: "task",
                          steps: data.steps,
                          tag: data.tag,
                          tag_id: data.tag_id,
                      })
                    : data.remindMe,
                notes: data.notes,
                todo_url: url,
                origin_id: data.todo_url,
                complete: 0,
                repeat: data.repeat,
                important: data.important,
                default: "All",
                date_completed: null,
            };

            await db.todos.add(new_todo);

            return new_todo;
        } else {
            return null;
        }
    }
};

export default repeat;
