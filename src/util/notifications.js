import { Plugins } from "@capacitor/core";
import moment from "moment";

export const remove_notification = async (index) => {
	const { LocalNotifications } = Plugins;

	const nots = await LocalNotifications.getPending();
	await LocalNotifications.cancel({
		notifications: nots.notifications.filter((not) => not.id === `${index}`),
	});
};

export const schedule_notification = async (
	timestamp_raw,
	desc,
	index,
	data
) => {
	const { LocalNotifications } = Plugins;

	const nots = await LocalNotifications.getPending();
	const not_exists = nots.notifications.filter((not) => not.id === `${index}`);

	if (not_exists.length !== 0) {
		remove_notification(index).then(async () => {
			await LocalNotifications.schedule({
				notifications: [
					{
						title: `${moment(timestamp_raw).format("LT")}`,
						body: `${desc}`,
						id: index,
						schedule: { at: timestamp_raw, allowWhenIdle: true },
						ongoing: true,
						sound: null,
						attachments: null,
						actionTypeId: "REMINDER",
						extra: data,
						autoCancel: true,
					},
				],
			}).then(() => console.log("notification reset"));
		});
	} else {
		await LocalNotifications.schedule({
			notifications: [
				{
					title: `${moment(timestamp_raw).format("LT")}`,
					body: `${desc}`,
					id: index,
					schedule: { at: timestamp_raw, allowWhenIdle: true },
					ongoing: true,
					sound: null,
					attachments: null,
					actionTypeId: "REMINDER",
					extra: data,
					autoCancel: true,
				},
			],
		}).then(() => console.log("notification set"));
	}
};
