import Dexie from "dexie";

const listDB = new Dexie("LivelyLists");
listDB.version(1).stores({
    lists: `list_id,name,todo,completed,list_id,index`,
});

export const set_list_complete = async () => {
    const list = await listDB.lists
        .filter((list) => {
            return (
                list.list_id === "Completed_default" && list.default === true
            );
        })
        .toArray();

    if (list.length === 0) {
        const new_list = {
            name: "Completed",
            list_id: "Completed_default",
            index: 2,
            default: true,
        };

        await listDB.lists
            .add(new_list)
            .then(() => console.log("list addedd..."))
            .catch((e) => console.log(e));
    }
};

export const set_list_important = async () => {
    const list = await listDB.lists
        .filter((list) => {
            return (
                list.list_id === "Important_default" && list.default === true
            );
        })
        .toArray();

    if (list.length === 0) {
        const new_list = {
            name: "Important",
            list_id: "Important_default",
            index: 1,
            default: true,
        };

        await listDB.lists
            .add(new_list)
            .then(() => console.log("list addedd..."))
            .catch((e) => console.log(e));
    }
};
