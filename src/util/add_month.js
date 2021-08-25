import Dexie from "dexie";
import moment from "moment";

const monthDB = new Dexie("LivelyMonths");
monthDB.version(1).stores({
	month: "date",
});

const checkDate = (date) => {
	const month = moment(date).format("MMMM");
	const year = moment(date).format("yyyy");

	return `${month}, ${year}`;
};

const add_month = async (date) => {
	const exists = await monthDB.month
		.filter((dbDate) => checkDate(dbDate.date) === checkDate(date))
		.toArray();

	if (exists.length === 0) {
		// Does not exists
		await monthDB.month.add({
			date: new Date(date),
		});
	}
};

export default add_month;
