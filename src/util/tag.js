import moment from "moment";
import Dexie from "dexie";

const db = new Dexie("LivelyTags");
db.version(1).stores({
    tags: `id,total_focus,today,week,month`,
});

const setTime = (timestamp) => {
    if (moment(timestamp).calendar().includes("Today")) {
        return "Today";
    } else {
        return "";
    }
};

const setTimeWeek = (timestamp) => {
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

const setTimeMonth = (timestamp) => {
    const month = moment().format("MMMM");
    const year = moment().format("YYYY");
    const dbMonth = moment(timestamp).format("MMMM");
    const dbYear = moment(timestamp).format("YYYY");

    if (month === dbMonth && year === dbYear) {
        return true;
    } else {
        return false;
    }
};

const check_date_today = (timestamp, dB_, data) => {
    if (setTime(timestamp) === "Today") {
        return dB_.today.focused + data.today.focused;
    } else {
        return data.today.focused;
    }
};

const check_date_week = (timestamp, dB_, data) => {
    if (setTimeWeek(timestamp)) {
        return dB_.week.focused + data.week.focused;
    } else {
        return data.week.focused;
    }
};

const check_date_month = (timestamp, dB_, data) => {
    if (setTimeMonth(timestamp)) {
        return dB_.month.focused + data.month.focused;
    } else {
        return data.month.focused;
    }
};

const compute = async (dB_, data, time) => {
    const data_ = {
        id: dB_.id,
        total_focus: dB_.total_focus + data.total_focus,
        name: dB_.name,
        today: {
            focused: check_date_today(time.today, dB_, data),
        },
        week: {
            focused: check_date_week(time.week, dB_, data),
        },
        month: {
            focused: check_date_month(time.month, dB_, data),
        },
    };

    await db.tags
        .where("id")
        .equals(dB_.id)
        .modify((tag) => {
            tag.total_focus = data_.total_focus;
            tag.today.focused = data_.today.focused;
            tag.week.focused = data_.week.focused;
            tag.month.focused = data_.month.focused;
        });
};

const reset_tags = async (date) => {
    await db.tags.toCollection().modify((tag) => {
        const new_timestamp = new Date();

        if (date === 0) {
            localStorage.setItem("today_timestamp", new_timestamp);
            tag.today = {
                focused: 0,
            };
        } else if (date === 1) {
            localStorage.setItem("week_timestamp", new_timestamp);
            tag.week = {
                focused: 0,
            };
        } else if (date === 2) {
            localStorage.setItem("month_timestamp", new_timestamp);
            tag.month = {
                focused: 0,
            };
        }
    });
};

const tag_ = async (data, time) => {
    const exists = await db.tags.filter((tag) => tag.id === data.id).toArray();

    if (exists.length === 0) {
        await db.tags.add(data);
    } else {
        const reset = async () => {
            if (setTime(time.today) !== "Today") {
                reset_tags(0);
            }

            if (setTimeWeek(time.week) === false) {
                reset_tags(1);
            }

            if (!setTimeMonth(time.month)) {
                reset_tags(2);
            }
        };

        reset().then(() => {
            compute(exists[0], data, time);
        });
    }
};

export default tag_;
