import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route, Switch, useHistory } from "react-router-dom";
import { Plugins } from "@capacitor/core";
import { isPlatform } from "@ionic/react";
import Dexie from "dexie";
import { InAppPurchase2 as Store } from "@ionic-native/in-app-purchase-2";
import loadable from "@loadable/component";

import "./assets/fonts/fonts.css";
import "./App.css";

import { mode } from "./constants/color";
import { setLightMode, setDarkMode } from "./actions/dark_mode";

import { focus_info, focus_timeSET } from "./actions/focus_feed";

import {
	back_index,
	add_switch_add,
	add_switch_goal,
	add_switch_add_update,
	todo_desc,
	todo_due_date,
	todo_list_selected,
	todo_tag_selected,
	dispatch_todo_steps,
	todo_remind_timestamp,
	dispatch_todo_notes,
	todo_repeat_option,
	todo_complete_set,
	todo_important_set,
	textarea_state,
	handle_focustime,
	todo_index,
	handle_url,
	handle_date_completed,
	set_urgency,
} from "./actions/add_feed";

import {
	dispatch_donation_items,
	set_donation_member,
	reset_donation_member,
	activate_bnav_limit,
	reset_bnav_limit,
	set_name,
	set_lang,
	show_thanks_modal,
} from "./actions/home_feed";
import Loading from "./components/loading/Loading";
import { stats_add } from "./util/stats_add";
import add_month from "./util/add_month";

const App = () => {
	const { LocalNotifications, Toast, SplashScreen, Storage, NavigationBar } =
		Plugins;

	const Home = loadable(async () => import("./pages/home/Home"));
	const BottomNav = loadable(async () =>
		import("./components/bottomnav/BottomNav")
	);
	const Settings = loadable(async () => import("./pages/settings/Settings"));
	const ThankYou = loadable(async () => import("./pages/thank_you/ThankYou"));
	const Import = loadable(async () => import("./pages/settings/Import"));
	const Export = loadable(async () => import("./pages/settings/Export"));
	const Fireworks = loadable(async () => import("./pages/congrats/Fireworks"));
	const Lists = loadable(async () => import("./pages/lists/Lists"));
	const Add = loadable(async () => import("./pages/add/Add"));
	const Goals = loadable(async () => import("./pages/goals/Goals"));
	const GoalsCompleted = loadable(async () =>
		import("./pages/goals_completed/GoalsCompleted")
	);
	const Timer = loadable(async () => import("./pages/timer/Timer"));
	const Focus = loadable(async () => import("./pages/Focus/Focus"));
	const ListView = loadable(async () => import("./pages/listView/ListView"));
	const LogTime = loadable(async () => import("./pages/log_time/LogTime"));

	const DONATION_IDS = ["2_member", "3_donation", "100_donation"];

	const dispatch = useDispatch();
	const history = useHistory();

	const darkMode = useSelector((state) => state.dark_mode);

	const goalDB = new Dexie("LivelyGoals");
	goalDB.version(1).stores({
		goals: `goal_url,title,desc,steps,notes,focustime,tag,tag_id,deadline,date_completed,goal_url,complete`,
	});

	const todoDB = new Dexie("LivelyTodos");
	todoDB.version(1).stores({
		todos: `todo_url,desc,dueDate,category,tag,tag_id,steps,focustime,urgent,index,date_completed,remindMe,notes,todo_url,complete`,
	});

	const timerDB = new Dexie("LivelyTime");
	timerDB.version(1).stores({
		times: "id, months, today, week",
	});

	const androidLightTheme = async () => {
		NavigationBar.setLightColor();
		window.RecentsControl.setOptions(mode.light, "Lively");
	};

	const androidDarkTheme = async () => {
		NavigationBar.setDarkColor();
		window.RecentsControl.setOptions(mode.dark, "Lively");
	};

	const handleEvents = async () => {
		Store.when("product").initiated(async () => {
			await Toast.show({
				text: "Processing donation...",
				duration: "long",
				position: "bottom",
			});
		});

		Store.when("product")
			.approved(async (product) => {
				await Storage.set({
					key: "donation_modal_shown",
					value: JSON.stringify(true),
				});
				await Toast.show({
					text: "Thank you for all your support ❤",
					duration: "long",
					position: "bottom",
				});
				product.verify();
				// dispatch(show_thanks_modal);
			})
			.verified((product) => {
				product.finish();
			});

		Store.when("subscription").updated((product) => {
			if (product.owned) {
				dispatch(set_donation_member);
			} else {
				dispatch(reset_donation_member);
			}
		});
	};

	const notify = async (name) => {
		const ENCOURAGEMENT = ["fun", "simple", "exciting", "easy"];
		const random = Math.floor(Math.random() * ENCOURAGEMENT.length);
		await LocalNotifications.schedule({
			notifications: [
				{
					title: `Hey ${name ? name : ""}`,
					body: `Let's get something ${ENCOURAGEMENT[random]} done today!`,
					id: 20202019,
					sound: null,
					ongoing: true,
					attachments: null,
					actionTypeId: "PERSNOTIF",
					extra: null,
					autoCancel: false,
				},
			],
		});
	};

	const registerItems = async () => {
		Store.register({
			id: DONATION_IDS[0],
			type: Store.PAID_SUBSCRIPTION,
		});

		Store.register({
			id: DONATION_IDS[1],
			type: Store.CONSUMABLE,
		});

		Store.register({
			id: DONATION_IDS[2],
			type: Store.CONSUMABLE,
		});

		Store.refresh();
	};

	const registerAppStart = async () => {
		const app_starts_raw = await Storage.get({ key: "app_starts" });
		const app_starts = JSON.parse(app_starts_raw.value);
		const value = app_starts ? app_starts + 1 : 1;
		await Storage.set({
			key: "app_starts",
			value: JSON.stringify(value),
		});
	};

	const addDays = (date, days) => {
		let result = new Date(date);
		result.setDate(result.getDate() + days);
		return result;
	};

	const dispatchLangAndName = async () => {
		const name_raw = await Storage.get({ key: "name" });
		const name_value = JSON.parse(name_raw.value);
		dispatch(set_name(name_value));

		const lang_raw = await Storage.get({ key: "lang" });
		const lang_value = JSON.parse(lang_raw.value);
		dispatch(set_lang(lang_value));

		return { name: name_value, lang: lang_value };
	};

	useEffect(() => {
		registerItems().then(() => {
			Store.ready(() => {
				dispatch(dispatch_donation_items(Store.products));
			});
		});

		if (isPlatform("android") || isPlatform("ios")) {
			handleEvents();
		}

		dispatchLangAndName().then((response) => {
			notify(response.name);
		});

		registerAppStart();
	}, []);

	const persist = async () => {
		return (await navigator.storage) && navigator.storage.persist
			? navigator.storage.persist()
			: undefined;
	};

	const registerNotifActions = async () => {
		await LocalNotifications.requestPermission().then(async () => {
			if (isPlatform("android") || isPlatform("ios")) {
				LocalNotifications.registerActionTypes({
					types: [
						{
							id: "REMINDER",
							actions: [
								{
									id: "focus",
									title: "Start focus",
								},
							],
						},
						{
							id: "PERSNOTIF",
							actions: [
								{
									id: "create_task",
									title: "Add task",
								},
								{
									id: "create_goal",
									title: "Add goal",
								},
							],
						},
					],
				});
			}
		});
	};

	// ! To be removed on version 3.01
	const handleTransfer = async () => {
		const months = await timerDB.times
			.where("id")
			.equals("Months_DB")
			.toArray();

		if (months.length !== 0) {
			months[0].months.forEach((month) => {
				add_month(month.createdAt);
				stats_add({
					date: month.createdAt,
					tasks: month.tasksFocus,
					goals: month.goalsFocus,
					total: month.totalFocus,
					todos_count: month.completedTasks,
					goals_count: month.completedGoals,
					tag: null,
				});
			});
		}

		timerDB.delete();
	};

	useEffect(() => {
		const dispatchMode = async () => {
			const localModeRaw = await Storage.get({ key: "darkMode" });
			const localMode = JSON.parse(localModeRaw.value);
			persist();
			handleTransfer(); // ! To be removed on version 3.01
			registerNotifActions();

			if (localMode === null) {
				if (isPlatform("android") || isPlatform("ios")) {
					await Toast.requestPermissions();
				}
				const timestamp_intial = new Date();

				await Storage.set({
					key: "date_installed",
					value: JSON.stringify(timestamp_intial),
				});

				await Storage.set({
					key: "todo_index",
					value: JSON.stringify(0),
				});

				await Storage.set({
					key: "notif_warning",
					value: JSON.stringify(0),
				});

				await Storage.set({
					key: "app_starts",
					value: JSON.stringify(0),
				});

				await Storage.set({
					key: "donation_modal_shown",
					value: JSON.stringify(false),
				});

				await Storage.set({
					key: "rate_modal_shown",
					value: JSON.stringify(false),
				});

				await Storage.set({
					key: "good_with_modal_show",
					value: JSON.stringify(false),
				});

				await Storage.set({
					key: "next_donation_reminder_date",
					value: JSON.stringify(addDays(new Date(), 3)),
				});

				if (isPlatform("android") || isPlatform("ios")) {
					if (isPlatform("android")) {
						androidDarkTheme();
					}
					dispatch(setDarkMode);
					await Storage.set({
						key: "darkMode",
						value: JSON.stringify(true),
					});
				} else {
					dispatch(setDarkMode);
					await Storage.set({
						key: "darkMode",
						value: JSON.stringify(true),
					});
				}
			} else {
				if (localMode) {
					dispatch(setDarkMode);
					if (isPlatform("android")) {
						androidDarkTheme();
					}
				} else {
					dispatch(setLightMode);
					if (isPlatform("android")) {
						androidLightTheme();
					}
				}
			}
		};

		dispatchMode();

		const fetch = async (data) => {
			dispatch(focus_info(data));
			if (data.type) {
				dispatch(focus_timeSET(data.focustime));
				history.replace(`/focus_${data.url}`);
			} else {
				history.replace(`/focus`);
			}
		};

		const action = () => {
			LocalNotifications.addListener(
				"localNotificationActionPerformed",
				async (data) => {
					const focus_ongoing_raw = await Storage.get({
						key: "focus",
					});

					const focus_ongoing = JSON.parse(focus_ongoing_raw.value);

					if (data.actionId === "create_task") {
						if (!focus_ongoing) {
							dispatch(add_switch_add);
							dispatch(back_index("home"));
							history.replace("/add");
						}
					} else if (data.actionId === "create_goal") {
						if (!focus_ongoing) {
							dispatch(add_switch_goal);
							dispatch(back_index("home"));
							history.replace("/add");
						}
					} else if (data.actionId === "focus") {
						if (!focus_ongoing) {
							dispatch(activate_bnav_limit);
							dispatch(focus_info(data.notification.extra));
							dispatch(reset_bnav_limit);
							history.replace(`/focus_${data.notification.extra.tag_id}`);
						}
					} else {
						if (data.notification.extra) {
							dispatch(activate_bnav_limit);

							const todo = await todoDB.todos
								.filter(
									(todo_) => todo_.todo_url === data.notification.extra.url
								)
								.toArray();

							if (todo.length !== 0) {
								dispatch(add_switch_add_update);
								dispatch(todo_desc(todo[0].desc));
								dispatch(todo_due_date(todo[0].dueDate));
								dispatch(todo_list_selected(todo[0].category));
								dispatch(
									todo_tag_selected({ tag: todo[0].tag, id: todo[0].tag_id })
								);
								dispatch(dispatch_todo_steps(todo[0].steps.steps));
								dispatch(todo_remind_timestamp(todo[0].remindMe));
								dispatch(dispatch_todo_notes(todo[0].notes.notes));
								dispatch(todo_repeat_option(todo[0].repeat));
								dispatch(todo_complete_set(todo[0].complete));
								dispatch(todo_important_set(todo[0].important));
								dispatch(textarea_state(true));
								dispatch(handle_focustime(todo[0].focustime));
								dispatch(handle_url(todo[0].todo_url));
								dispatch(todo_index(todo[0].index));
								dispatch(back_index("home"));
								dispatch(handle_date_completed(todo[0].date_completed));
								dispatch(set_urgency(todo[0].urgent ? todo[0].urgent : "No"));
								history.replace(`/add_${todo[0].todo_url}`);
							}

							dispatch(reset_bnav_limit);
						}
					}
				}
			);
		};

		const checkFocusOngoing = async () => {
			const focus_ongoing_raw = await Storage.get({
				key: "focus",
			});
			const focus_ongoing = JSON.parse(focus_ongoing_raw.value);

			if (focus_ongoing) {
				fetch(focus_ongoing);
			}
		};

		checkFocusOngoing();
		action();
		SplashScreen.hide();
	}, [darkMode]);

	return (
		<div
			id="app"
			style={{
				backgroundColor: darkMode ? mode.dark : mode.light,
				color: darkMode ? "white" : "black",
			}}
		>
			<Switch>
				<Route
					path="/"
					exact={true}
					component={() => <Home fallback={<Loading />} />}
				/>
				<Route
					path="/settings"
					exact={true}
					component={() => <Settings fallback={<Loading />} />}
				/>
				<Route
					path="/lists"
					exact={true}
					component={() => <Lists fallback={<Loading />} />}
				/>
				<Route
					path="/add"
					exact={true}
					component={() => <Add fallback={<Loading />} />}
				/>
				<Route
					path="/add_:id"
					exact={true}
					component={() => <Add fallback={<Loading />} />}
				/>
				<Route
					path="/goal_:id"
					exact={true}
					component={() => <Add fallback={<Loading />} />}
				/>
				<Route
					path="/goals"
					exact={true}
					component={() => <Goals fallback={<Loading />} />}
				/>
				<Route
					path="/goals_completed"
					exact={true}
					component={() => <GoalsCompleted fallback={<Loading />} />}
				/>
				<Route
					path="/timer"
					exact={true}
					component={() => <Timer fallback={<Loading />} />}
				/>
				<Route
					path="/focus"
					exact={true}
					component={() => <Focus fallback={<Loading />} />}
				/>
				<Route
					path="/focus_:id"
					exact={true}
					component={() => <Focus fallback={<Loading />} />}
				/>
				<Route
					path="/list_:id"
					exact={true}
					component={() => <ListView fallback={<Loading />} />}
				/>
				<Route
					path="/congrats"
					exact={true}
					component={() => <Fireworks fallback={<Loading />} />}
				/>
				<Route
					path="/export"
					exact={true}
					component={() => <Export fallback={<Loading />} />}
				/>
				<Route
					path="/import"
					exact={true}
					component={() => <Import fallback={<Loading />} />}
				/>
				<Route
					path="/log"
					exact={true}
					component={() => <LogTime fallback={<Loading />} />}
				/>
			</Switch>
			<BottomNav fallback={<Loading />} darkMode={darkMode} />
		</div>
	);
};

export default App;
