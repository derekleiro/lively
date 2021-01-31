import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route, Switch, useHistory } from "react-router-dom";
import { Plugins } from "@capacitor/core";
import { isPlatform } from "@ionic/react";
import Dexie from "dexie";
import moment from "moment";
import { Howl } from "howler";
import confetti from "canvas-confetti";
import { InAppPurchase2 as Store } from "@ionic-native/in-app-purchase-2";

import "./assets/fonts/fonts.css";
import "./App.css";

import { mode } from "./constants/color";
import { setLightMode, setDarkMode } from "./actions/dark_mode";

import { focus_info, focus_timeSET } from "./actions/focus_feed";

import {
    todo_desc,
    todo_list_selected,
    todo_due_date,
    todo_remind_timestamp,
    todo_repeat_option,
    todo_complete_set,
    todo_important_set,
    textarea_state,
    handle_focustime,
    dispatch_todo_steps,
    dispatch_todo_notes,
    add_switch_add_update,
    handle_url,
    todos,
    todo_index,
    back_index,
    todo_tag_selected,
    add_switch_add,
    add_switch_goal,
    dispatch_notif,
} from "./actions/add_feed";

import Focus from "./pages/Focus/Focus";
import Settings from "./pages/settings/Settings";
import ListView from "./pages/listView/ListView";
import Add from "./pages/add/Add";
import Fireworks from "./pages/congrats/Fireworks";
import BottomNav from "./components/bottomnav/BottomNav";
import Home from "./pages/home/Home";
import Lists from "./pages/lists/Lists";
import Goals from "./pages/goals/Goals";
import Timer from "./pages/timer/Timer";
import GoalsCompleted from "./pages/goals_completed/GoalsCompleted";
import { session_add } from "./util/session_add";
import add_session from "./util/session";
import repeat from "./util/repeat";

import { set_list_complete } from "./util/new_default_lists";

import completed_sound from "./assets/sounds/for-sure.webm";
import { remove_notification } from "./util/notifications";
import { encouragements } from "./constants/encouragements";
import ThankYou from "./pages/thank_you/ThankYou";
import {
    dispatch_donation_items,
    set_donation_member,
} from "./actions/home_feed";

const sound = new Howl({
    src: [completed_sound],
    html5: true,
    preload: true,
    format: ["webm"],
});

const App = () => {
    const { LocalNotifications, Toast, NavigationBar, SplashScreen } = Plugins;

    const DONATION_IDS = [
        "1_donation",
        "3_donation",
        "10_donation",
        "30_donation",
        "100_donation",
        "2_member",
    ];

    const dispatch = useDispatch();
    const history = useHistory();

    const darkMode = useSelector((state) => state.dark_mode);
    const products = useSelector((state) => state.donation.items);

    const month = moment(new Date()).format("MMMM");
    const year = moment(new Date()).format("yyyy");

    const celebration = {
        wohoo: () => {
            var count = 100;
            var defaults = {
                origin: { y: 0.7 },
            };

            const fire = (particleRatio, opts) => {
                confetti(
                    Object.assign({}, defaults, opts, {
                        particleCount: Math.floor(count * particleRatio),
                    })
                );
            };

            fire(0.25, {
                spread: 26,
                startVelocity: 55,
            });
            fire(0.2, {
                spread: 60,
            });
            fire(0.35, {
                spread: 100,
                decay: 0.91,
                scalar: 0.8,
            });
            fire(0.1, {
                spread: 120,
                startVelocity: 25,
                decay: 0.92,
                scalar: 1.2,
            });
            fire(0.1, {
                spread: 120,
                startVelocity: 45,
            });
        },
    };

    const goalDB = new Dexie("LivelyGoals");
    goalDB.version(1).stores({
        goals: `goal_url,title,desc,steps,notes,focustime,date_completed,goal_url,complete`,
    });

    const todoDB = new Dexie("LivelyTodos");
    todoDB.version(1).stores({
        todos: `todo_url,desc,dueDate,category,tag,tag_id,steps,focustime,index,date_completed,remindMe,notes,todo_url,complete`,
    });

    const androidLightTheme = async () => {
        NavigationBar.setLightColor();
        window.RecentsControl.setOptions(mode.light, "Lively");
    };

    const androidDarkTheme = async () => {
        NavigationBar.setDarkColor();
        window.RecentsControl.setOptions(mode.dark, "Lively");
    };

    const notify = async () => {
        await LocalNotifications.schedule({
            notifications: [
                {
                    title: "Your dreams are awaiting!",
                    body: `Let's add a task or a goal to achieve today!`,
                    id: 20202019,
                    schedule: { at: new Date() },
                    sound: null,
                    attachments: null,
                    actionTypeId: "PERSNOTIF",
                    extra: null,
                    autoCancel: true,
                },
            ],
        });
    };

    const registerItems = async () => {
        Store.register({
            id: DONATION_IDS[0],
            type: Store.CONSUMABLE,
        });

        Store.register({
            id: DONATION_IDS[1],
            type: Store.CONSUMABLE,
        });

        Store.register({
            id: DONATION_IDS[2],
            type: Store.CONSUMABLE,
        });

        Store.register({
            id: DONATION_IDS[3],
            type: Store.CONSUMABLE,
        });

        Store.register({
            id: DONATION_IDS[4],
            type: Store.CONSUMABLE,
        });

        Store.register({
            id: DONATION_IDS[5],
            type: Store.PAID_SUBSCRIPTION,
        });

        Store.refresh();
    };

    useEffect(() => {
        registerItems().then(() => {
            Store.ready(() => {
                if (products.length === 0) {
                    dispatch(dispatch_donation_items(Store.products));
                }
            });
        });

        if(isPlatform("android") || isPlatform("ios")){
            Store.when(DONATION_IDS[5]).owned((p) => {
                dispatch(set_donation_member);
            });
        }

        const dispatchMode = async () => {
            const localMode = localStorage.getItem("darkMode");

            if (localMode === null) {
                await Toast.requestPermissions();

                const timestamp_intial = new Date();

                localStorage.setItem("today_timestamp", timestamp_intial);
                localStorage.setItem("new_focus", false);
                localStorage.setItem("week_timestamp", timestamp_intial);
                localStorage.setItem("new_focus_week", false);
                localStorage.setItem("month_timestamp", timestamp_intial);
                localStorage.setItem("date_installed", timestamp_intial);
                localStorage.setItem("todo_index", 0);
                localStorage.setItem("notif_warning", 0);
                localStorage.setItem("app_starts", 0);
                localStorage.setItem("donation_modal_shown", false);
                localStorage.setItem("rate_modal_shown", false);

                await LocalNotifications.requestPermission().then(async () => {
                    if (isPlatform("android") || isPlatform("ios")) {
                        LocalNotifications.registerActionTypes({
                            types: [
                                {
                                    id: "REMINDER",
                                    actions: [
                                        {
                                            id: "complete",
                                            title: "Mark as done",
                                            destructive: true,
                                        },
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

                if (isPlatform("android") || isPlatform("ios")) {
                    if (isPlatform("android")) {
                        window.darkmode.isDarkModeEnabled(
                            (res) => {
                                if (res === "true") {
                                    dispatch(setDarkMode);
                                    androidDarkTheme();
                                    localStorage.setItem("darkMode", true);
                                } else {
                                    dispatch(setLightMode);
                                    androidLightTheme();
                                    localStorage.setItem("darkMode", false);
                                }
                            },
                            (err) => {
                                console.log(err);
                            }
                        );
                    } else {
                        dispatch(setLightMode);
                        localStorage.setItem("darkMode", false);
                    }
                } else {
                    dispatch(setLightMode);
                    localStorage.setItem("darkMode", false);
                }
            } else {
                if (localMode === "true") {
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
        notify();

        const app_starts = JSON.parse(localStorage.getItem("app_starts"));
        localStorage.setItem("app_starts", app_starts ? app_starts + 1 : 1);

        const focus_ongoing = JSON.parse(localStorage.getItem("focus"));

        const fetch = async (data) => {
            dispatch(focus_info(data));
            if (data.type) {
                dispatch(focus_timeSET(data.focustime));
                setTimeout(() => history.replace(`/focus_${data.url}`), 2500);
            } else {
                setTimeout(() => history.replace(`/focus`), 2500);
            }
        };

        const dispatchTaskDetails = (todo) => {
            dispatch(add_switch_add_update);
            dispatch(todo_desc(todo.desc));
            dispatch(todo_due_date(todo.dueDate));
            dispatch(todo_list_selected(todo.category));
            dispatch(todo_tag_selected({ tag: todo.tag, id: todo.tag_id }));
            dispatch(dispatch_todo_steps(todo.steps.steps));
            dispatch(todo_remind_timestamp(todo.remindMe));
            dispatch(dispatch_todo_notes(todo.notes.notes));
            dispatch(todo_repeat_option(todo.repeat));
            dispatch(todo_complete_set(1));
            dispatch(todo_important_set(todo.important));
            dispatch(textarea_state(true));
            dispatch(handle_focustime(todo.focustime));
            dispatch(handle_url(todo.todo_url));
            dispatch(todo_index(todo.index));
            dispatch(back_index("home"));
            dispatch(dispatch_notif);
        };

        const action = () => {
            LocalNotifications.addListener(
                "localNotificationActionPerformed",
                async (data) => {
                    if (data.actionId === "complete") {
                        await todoDB.todos
                            .filter((todo) => {
                                return (
                                    todo.todo_url ===
                                    data.notification.extra.url
                                );
                            })
                            .modify(async (todo) => {
                                if (todo.complete === 0) {
                                    todo.complete = 1;
                                    todo.date_completed = new Date();

                                    const data_1 = {
                                        month,
                                        year,
                                        createdAt: new Date(),
                                        totalFocus: 0,
                                        tasksFocus: 0,
                                        goalsFocus: 0,
                                        completedGoals: 0,
                                        completedTasks: 1,
                                    };

                                    repeat({
                                        repeat: todo.repeat,
                                        todo_url: todo.todo_url,
                                        desc: todo.desc,
                                        dueDate: todo.dueDate,
                                        date_completed: todo.date_completed,
                                        category: todo.category,
                                        tag: todo.tag,
                                        tag_id: todo.tag_id,
                                        steps: { steps: todo.steps.steps },
                                        focustime: todo.focustime,
                                        index: todo.index,
                                        remindMe: todo.remindMe,
                                        notes: { notes: todo.notes.notes },
                                        complete: todo.complete,
                                        important: todo.important,
                                    }).then((data) => {
                                        if (data) {
                                            const dispatch_timeout = setTimeout(
                                                () => {
                                                    dispatch(todos(data));
                                                    clearTimeout(
                                                        dispatch_timeout
                                                    );
                                                },
                                                500
                                            );
                                        }
                                    });

                                    add_session(data_1);
                                    session_add({
                                        tasks: 0,
                                        goals: 0,
                                        total: 0,
                                        todos_count: 1,
                                        goals_count: 0,
                                    });

                                    remove_notification(todo.index);
                                    set_list_complete();
                                    dispatchTaskDetails(todo);

                                    sound.play();
                                    celebration.wohoo();

                                    await Toast.show({
                                        text:
                                            encouragements[
                                                Math.floor(
                                                    Math.random() *
                                                        encouragements.length
                                                )
                                            ],
                                        duration: "short",
                                        position: "bottom",
                                    });

                                    setTimeout(
                                        () =>
                                            history.replace(
                                                `/add_${todo.todo_url}`
                                            ),
                                        2500
                                    );
                                }
                            });
                    } else if (data.actionId === "create_task") {
                        if (!focus_ongoing) {
                            dispatch(add_switch_add);
                            history.replace("/add");
                        }
                    } else if (data.actionId === "create_goal") {
                        if (!focus_ongoing) {
                            dispatch(add_switch_goal);
                            history.replace("/add");
                        }
                    } else {
                        if (!focus_ongoing) {
                            dispatch(focus_info(data.notification.extra));
                            setTimeout(
                                () =>
                                    history.replace(
                                        `/focus_${data.notification.extra.tag_id}`
                                    ),
                                2500
                            );
                        }
                    }
                }
            );
        };

        if (focus_ongoing) {
            fetch(focus_ongoing);
        }

        action();

        SplashScreen.hide();
    }, [dispatch, darkMode]);

    return (
        <div
            id="app"
            style={{
                backgroundColor: darkMode ? mode.dark : mode.light,
                color: darkMode ? "white" : "black",
            }}
        >
            <Switch>
                <Route path="/" exact={true} component={Home} />
                <Route path="/settings" exact={true} component={Settings} />
                <Route path="/lists" exact={true} component={Lists} />
                <Route path="/add" exact={true} component={Add} />
                <Route path="/add_:id" exact={true} component={Add} />
                <Route path="/goal_:id" exact={true} component={Add} />
                <Route path="/goals" exact={true} component={Goals} />
                <Route
                    path="/goals_completed"
                    exact={true}
                    component={GoalsCompleted}
                />
                <Route path="/timer" exact={true} component={Timer} />
                <Route path="/focus" exact={true} component={Focus} />
                <Route path="/focus_:id" exact={true} component={Focus} />
                <Route path="/list_:id" exact={true} component={ListView} />
                <Route path="/congrats" exact={true} component={Fireworks} />
                <Route path="/thanks" exact={true} component={ThankYou} />
            </Switch>
            <BottomNav darkMode={darkMode} />
        </div>
    );
};

export default App;
