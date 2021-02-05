import { Plugins } from "@capacitor/core";
import moment from "moment";

export const remove_notification = async (index) => {
    const { LocalNotifications } = Plugins;

    const nots = await LocalNotifications.getPending();
    await LocalNotifications.cancel({
        notifications: nots.notifications.filter(
            (not) => not.id === `${index}`
        ),
    });
};

export const schedule_notification = async (
    timestamp_raw,
    desc,
    index,
    data
) => {
    const { LocalNotifications } = Plugins;

    const MS_PER_MINUTE = 60000;
    const timestamp = new Date(timestamp_raw - 5 * MS_PER_MINUTE);

    const nots = await LocalNotifications.getPending();
    const not_exists = nots.notifications.filter(
        (not) => not.id === `${index}`
    );

    if (not_exists.length !== 0) {
        remove_notification(index).then(async () => {
            await LocalNotifications.schedule({
                notifications: [
                    {
                        title: `Due ${moment(timestamp).format("LT")}`,
                        body: `${desc}`,
                        id: index,
                        schedule: { at: timestamp },
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
                    title: `Due ${moment(timestamp).format("LT")}`,
                    body: `${desc}`,
                    id: index,
                    schedule: { at: timestamp },
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
