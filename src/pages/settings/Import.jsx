import React, { useEffect, useState } from "react";
import {
	Plugins,
	FilesystemDirectory as Directory,
	FilesystemEncoding as Encoding,
} from "@capacitor/core";
import { importDB } from "dexie-export-import";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import Dexie from "dexie";

import back_icon from "../../assets/icons/back.png";
import back_icon_light from "../../assets/icons/back_light.png";
import tip_icon from "../../assets/icons/tip.png";

import { mode } from "../../constants/color";
import Done from "../../components/done/Done";
import { navStateGoals } from "../../actions/bottom_nav";
import { clear_list } from "../../actions/list_feed";
import { goals_clear, todos_clear } from "../../actions/add_feed";
import { reset_timer_feed } from "../../actions/timer_feed";
import { goal_timeout_clear, home_timeout_clear, list_timeout_clear, reset_focus_timeout } from "../../actions/timeouts";

const Export = () => {
	const { Filesystem, App, Toast } = Plugins;

	const dispatch = useDispatch();

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

	const handleDBDelete = async ({ blob, type }) => {
		Dexie.delete(type).then(async () => {
			await importDB(blob);
		});
	};

	const readFile = async ({ type }) => {
		const file = await Filesystem.readFile({
			path: `lively_backups/${type}.json`,
			directory: Directory.Documents,
			encoding: Encoding.UTF8,
		});
		const parsedFile = JSON.parse(file.data);
		const blob = await fetch(parsedFile.blob).then((res) => res.blob());

		if (blob) {
			await handleDBDelete({ blob, type });
		} else {
			await Toast.show({
				duration: "short",
				text: `We can't find the ${type} backup`,
				position: "bottom",
			});
		}
	};

	const handleBack = () => {
		history.replace("/settings");
	};

	const handleImport = () => {
		dispatch(navStateGoals);
		dispatch(clear_list);
		dispatch(todos_clear);
		dispatch(reset_timer_feed);
		dispatch(goals_clear);

		dispatch(home_timeout_clear)
		dispatch(list_timeout_clear)
		dispatch(goal_timeout_clear)
		dispatch(reset_focus_timeout)

		Filesystem.requestPermissions().then(
			async () => {
				await Toast.show({
					duration: "short",
					text: "Please wait...",
					position: "bottom",
				});

				types.forEach(async (type) => {
					readFile({ type });
				});

				await Toast.show({
					duration: "short",
					text: "Restoration complete!",
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
					<span className="title">Import</span>
				</div>

				<div className="space"></div>

				<Done load={true}>
					<div className="done_options">
						<img
							style={{ width: "100px", height: "100px" }}
							src={tip_icon}
							alt={`Caution`}
						/>

						<div className="done_text">
							Keep in mind that the backups are stored in the documents folder
							under the lively_backups folder. If you deleted this folder, we
							may not be able to retrieve your backups. Restoring data, will
							REPLACE ALL the current data, with the backed up data. Do proceed
							with CAUTION.
						</div>

						<div className="done_text">
							You may have to restart the app if all data is not present
						</div>

						<div
							className="action_button"
							style={{
								margin: "15px 30px",
								color: "#1395ff",
							}}
							onClick={handleImport}
						>
							I understand, restore my data
						</div>
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
								In order to restore your files, we need your permission to
								access your phone's storage to retrieve previously saved
								backups. Everything on Lively is done locally as it is a fully
								offline app
							</div>

							<div
								className="action_button"
								style={{
									color: "#1395ff",
								}}
								onClick={handleImport}
							>
								I understand, retrieve my data
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
