import Dexie from "dexie";
import moment from "moment";

const entryDB = new Dexie("LivelyEntries");
entryDB.version(1).stores({
	entries: "date, type, time_start, tag",
});

export const handleEntry = async ({ date, type, time, tag }) => {
	await entryDB.entries.add({
		date: moment(date).toDate(),
		type,
		time_start: moment(date).subtract(time, "seconds").toDate(),
		tag,
	});
};
