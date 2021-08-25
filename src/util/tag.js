import Dexie from "dexie";

const db = new Dexie("LivelyTags");
db.version(1).stores({
	tags: `id,total_focus,today,week,month`,
});

const compute = async (dB_, data) => {
	const data_ = {
		id: dB_.id,
		total_focus: dB_.total_focus + data.total_focus,
		name: dB_.name,
	};

	await db.tags
		.where("id")
		.equals(dB_.id)
		.modify((tag) => {
			tag.total_focus = data_.total_focus;
		});
};

const tag_ = async (data) => {
	const exists = await db.tags.filter((tag) => tag.id === data.id).toArray();

	if (exists.length === 0) {
		await db.tags.add(data);
	} else {
		compute(exists[0], data);
	}
};

export default tag_;
