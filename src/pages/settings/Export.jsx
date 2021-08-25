import React, { useEffect, useState } from "react";
import {
	Plugins,
	FilesystemDirectory as Directory,
	FilesystemEncoding as Encoding,
} from "@capacitor/core";
import Dexie from "dexie";
import { exportDB } from "dexie-export-import";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

import back_icon from "../../assets/icons/back.png";
import back_icon_light from "../../assets/icons/back_light.png";
import tip_icon from "../../assets/icons/tip.png";

import { mode } from "../../constants/color";
import Done from "../../components/done/Done";

const Export = () => {
	const { Filesystem, App, Toast, Storage } = Plugins;

	const history = useHistory();
	const darkMode = useSelector((state) => state.dark_mode);

	const [modal, setModal] = useState(false);
	const [fade, setFade] = useState(false);

	const types = [
		"LivelyTodos",
		"LivelyGoals",
		"LivelyLists",
		"LivelyLogs",
		"LivelyMonths",
		"LivelyEntries",
		"LivelyTags",
	];

	const todos = new Dexie("LivelyTodos");
	todos.version(1).stores({
		todos: `todo_url,desc,dueDate,category,tag,tag_id,steps,focustime,urgent,index,date_completed,remindMe,notes,todo_url,complete`,
	});

	const goals = new Dexie("LivelyGoals");
	goals.version(1).stores({
		goals: `goal_url,title,desc,steps,notes,focustime,tag,tag_id,deadline,date_completed,goal_url,complete`,
	});

	const lists = new Dexie("LivelyLists");
	lists.version(1).stores({
		lists: `list_id,name,todo,completed,list_id,index`,
	});

	const logs = new Dexie("LivelyLogs");
	logs.version(1).stores({
		logs: "date, tasks, goals, total, todos_count, graph, goals_count",
	});

	const months = new Dexie("LivelyMonths");
	months.version(1).stores({
		month: "date",
	});

	const entries = new Dexie("LivelyEntries");
	entries.version(1).stores({
		entries: "date, type, time_start, tag",
	});

	const tags = new Dexie("LivelyTags");
	tags.version(1).stores({
		tags: `id,total_focus,today,week,month`,
	});

	const style = {
		position: "fixed",
		height: "100%",
		width: "100%",
		top: "0",
		zIndex: "10",
		backgroundColor: darkMode ? mode.dark : mode.light,
		overflow: "auto",
		opacity: fade ? 1 : 0,
	};

	const writeFile = async ({ jsonString, type }) => {
		await Filesystem.writeFile({
			path: `lively_backups/${type}.json`,
			data: jsonString,
			recursive: true,
			directory: Directory.Documents,
			encoding: Encoding.UTF8,
		}).catch((e) => {
			console.log(e);
		});
	};

	const handleBack = () => {
		history.replace("/settings");
	};

	const blobToBase64 = (blob) => {
		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.readAsDataURL(blob);
			reader.onloadend = function () {
				resolve(reader.result);
			};
		});
	};

	const handleExport = () => {
		Filesystem.requestPermissions().then(
			async () => {
				setModal(false);
				types.forEach(async (type) => {
					let blob;

					if (type === "LivelyTodos") {
						blob = await exportDB(todos);
					} else if (type === "LivelyGoals") {
						blob = await exportDB(goals);
					} else if (type === "LivelyLists") {
						blob = await exportDB(lists);
					} else if (type === "LivelyLogs") {
						blob = await exportDB(logs);
					} else if (type === "LivelyMonths") {
						blob = await exportDB(months);
					} else if (type === "LivelyEntries") {
						blob = await exportDB(entries);
					} else {
						blob = await exportDB(tags);
					}

					const b64 = await blobToBase64(blob);
					const jsonString = JSON.stringify({ blob: b64 });

					if (jsonString) {
						writeFile({ jsonString, type });
					}
				});

				await Toast.show({
					duration: "short",
					text: "Backup complete",
					position: "bottom",
				});

				handleBack();
			},
			() => {
				setModal(true);
			}
		);
	};

	useEffect(() => {
		let unmounted = false;

		setTimeout(() => {
			if (!unmounted) {
				setFade(true);
			}
		}, 50);

		return () => {
			unmounted = true;
		};
	}, []);

	return (
		<div className="page" style={style}>
			<div className="container">
				<div
					className="container_top_nav"
					style={{
						backgroundColor: darkMode ? mode.dark : mode.light,
					}}
				>
					<span className="back_icon">
						<img
							onClick={handleBack}
							src={darkMode ? back_icon_light : back_icon}
							alt="Go back"
						/>
					</span>
					<span className="title">Export</span>
				</div>

				<div className="space"></div>

				<Done load={true}>
					<div className="done_options">
						<img
							style={{ width: "100px", height: "100px" }}
							src={tip_icon}
							alt={`Pro tip`}
						/>
						
						<div className="done_text">
							The backup will be stored in the documents folder under
							lively_backups. Do NOT delete that folder as you may lose your
							files. You will have to backup manually, so remember to come back
							here once in a while.
						</div>

						<span
							className="action_button"
							style={{
								color: "#1395ff",
							}}
							onClick={handleExport}
						>
							I understand, backup my data
						</span>
					</div>
				</Done>

				{modal && (
					<Done
						load={true}
						extra={true}
						exit={true}
						handleClick={() => setModal(false)}
					>
						<div className="done_options">
							<img
								style={{ width: "100px", height: "100px" }}
								src={tip_icon}
								alt={`We need your permission in order to back up your data`}
							/>
							<div className="done_text">
								In order to backup your files, we need your permission to save
								it to your phone's storage. Everything on Lively is done locally
								as it is a fully offline app
							</div>

							<div
								className="action_button"
								style={{
									color: "#1395ff",
								}}
								onClick={handleExport}
							>
								I understand, backup my data
							</div>
							<div
								className="action_button"
								style={{
									color: "#1395ff",
								}}
								onClick={() => setModal(false)}
							>
								go back
							</div>
						</div>
					</Done>
				)}
			</div>
		</div>
	);
};

export default Export;
