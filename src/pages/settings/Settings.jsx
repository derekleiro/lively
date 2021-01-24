import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Plugins } from "@capacitor/core";
import { InAppPurchase2 as Store } from "@ionic-native/in-app-purchase-2";
import { useHistory } from "react-router-dom";
import LazyLoad from "react-lazyload";
import { AppRate } from "@ionic-native/app-rate";

import Done from "../../components/done/Done";

import "./settings.css";

import { mode } from "../../constants/color";

import back_icon from "../../assets/icons/back.png";
import back_icon_light from "../../assets/icons/back_light.png";
import error500 from "../../assets/icons/404.png";
import { setLightMode, setDarkMode } from "../../actions/dark_mode";
import { remove_doantion_modal } from "../../actions/home_feed";

const Settings = () => {
    const { Share } = Plugins;

    const dispatch = useDispatch();
    const history = useHistory();
    const donation_section = useRef(null);

    const darkMode = useSelector((state) => state.dark_mode);
    const donation_modal = useSelector((state) => state.donation_modal);

    const [fade, setFade] = useState(false);
    const [purchaseError, setPurchaseError] = useState(false);

    const style = {
        position: "fixed",
        height: "100%",
        top: "0",
        zIndex: "10",
        backgroundColor: darkMode ? mode.dark : mode.light,
        overflow: "auto",
        opacity: fade ? 1 : 0,
    };

    const handleSwitch = () => {
        if (darkMode) {
            localStorage.setItem("darkMode", false);
            dispatch(setLightMode);
        } else {
            localStorage.setItem("darkMode", true);
            dispatch(setDarkMode);
        }
    };

    const handleShare = async () => {
        await Share.share({
            title: "Lively - Todo, Goals, Focus & Productivity Tracker",
            text:
                "Lively is an Ad-free Opensource, Todo & Goals list, Focus & Productivity app",
            url:
                "https://play.google.com/store/apps/details?id=com.lively.life",
            dialogTitle: "Take charge of your life today!",
        });
    };

    const handleReview = () => {
        AppRate.setPreferences = {
            displayAppName: "Lively",
            storeAppURL: {
                // ios: "<app_id>", Coming soon
                android: "market://details?id=com.lively.life",
            },
            customLocale: {
                title: "Did you find %@ useful?",
                message: "I would love to here from you 😊",
                cancelButton: "Not today",
                laterButtonLabel: "Remind me later",
                rateButtonLabel: "Let's goo!",
            },
        };

        AppRate.promptForRating();
    };

    const registerItems = async () => {
        Store.register({
            id: "4636879632684710377",
            type: Store.NON_CONSUMABLE,
        });

        Store.register({
            id: "4637282709189258831",
            type: Store.NON_CONSUMABLE,
        });

        Store.register({
            id: "4636871259449741312",
            type: Store.NON_CONSUMABLE,
        });

        Store.register({
            id: "4637540462936000632",
            type: Store.NON_CONSUMABLE,
        });

        Store.register({
            id: "4636639358133357006",
            type: Store.NON_CONSUMABLE,
        });

        Store.refresh();
    };

    const handleOrder = (id) => {
        Store.order(id).then(
            (p) => {
                // Purchase in progress
            },
            (e) => {
                setPurchaseError(true);
            }
        );
    };

    const handleDonation = async (id) => {
        Store.when("product")
            .approved((product) => {
                product.verify();
                return history.replace("/thanks");
            })
            .verified((product) => {
                product.finish();
            });

        handleOrder(id);
    };

    useEffect(() => {
        let unmounted = false;
        registerItems();

        setTimeout(() => {
            if (!unmounted) {
                setFade(true);
            }
        }, 50);

        return () => {
            unmounted = true;
            dispatch(remove_doantion_modal);
        };
    }, []);

    return (
        <LazyLoad>
            <div
                className="page"
                style={style}
                onLoad={() => {
                    if (donation_modal) {
                        donation_section.current.scrollIntoView({
                            behavior: "smooth",
                        });
                    }
                }}
            >
                <div className="container">
                    <div
                        className="container_top_nav"
                        style={{
                            backgroundColor: darkMode ? mode.dark : mode.light,
                        }}
                    >
                        <span className="back_icon">
                            <Link to="/">
                                <img
                                    src={darkMode ? back_icon_light : back_icon}
                                    alt="Go back"
                                />
                            </Link>
                        </span>
                        <span className="title">Settings</span>
                    </div>

                    <div className="space"></div>

                    {purchaseError ? (
                        <Done load={true}>
                            <div className="done_options">
                                <img
                                    src={error500}
                                    alt="Unfortunately there was a problem processing the
                                donation."
                                />
                                <div className="done_text">
                                    Unfortunately there was a problem processing
                                    your donation. But you can always try again.
                                    Thank You! ❤
                                </div>
                                <span
                                    className="action_button"
                                    style={{
                                        color: "#1395ff",
                                    }}
                                    onClick={() => setPurchaseError(false)}
                                >
                                    Ok
                                </span>
                            </div>
                        </Done>
                    ) : null}

                    <div className="element">
                        <span className="text" style={{ flex: "1" }}>
                            Dark mode
                        </span>
                        <span style={{ flex: "1", textAlign: "right" }}>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={darkMode}
                                    onChange={handleSwitch}
                                />
                                <span className="slider round"></span>
                            </label>
                        </span>
                    </div>
                    {/* <div className="element">
                    <span className="text" style={{ flex: "1" }}>
                        Backup
                    </span>
                    <span style={{ flex: "1", textAlign: "right" }}>
                        <a
                            href="https://paypal.me/derekleiro/1"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Sign in to Google
                        </a>
                    </span>
                </div> */}

                    <div className="element">
                        <span className="text" style={{ flex: "1" }}>
                            Know someone who might need this app? 🐱‍🏍
                        </span>
                        <span
                            style={{
                                flex: "1",
                                textAlign: "right",
                                color: "#1395ff",
                            }}
                            onClick={handleShare}
                        >
                            Share
                        </span>
                    </div>

                    <div className="element">
                        <span className="text" style={{ flex: "1" }}>
                            I would love to hear from you 😊
                        </span>
                        <span
                            style={{
                                flex: "1",
                                textAlign: "right",
                                color: "#1395ff",
                            }}
                            onClick={handleReview}
                        >
                            Leave a review 😋
                        </span>
                    </div>

                    <div className="title">Turn your life around!</div>

                    <div
                        className="text"
                        style={{ marginTop: "15px", marginBottom: "20px" }}
                    >
                        This app goes best with the{" "}
                        <a
                            href="https://play.google.com/store/apps/details?id=com.mindefy.phoneaddiction.mobilepe&hl=en&gl=US"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Your Hour
                        </a>{" "}
                        or{" "}
                        <a
                            href="https://play.google.com/store/apps/details?id=com.stayfocused&hl=en&gl=US"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Stay Focused
                        </a>{" "}
                        apps. I don't own the any of the apps, but I think it
                        will help alot of you. It limits app usage on your phone
                        (like those addictive apps). I believe YOU can turn your
                        life around and be who you want to be and you should
                        believe in yourself too! All the best ❤
                    </div>

                    <div id="donate_section" ref={donation_section}>
                        <div className="title">About Lively</div>
                        <div
                            className="text"
                            style={{ marginTop: "15px", marginBottom: "20px" }}
                        >
                            Lively is a completely free (and ad-free) todo list,
                            goals and productivity tracker with postive
                            reinforcement. Hello, my name is Derek Leiro, an 18
                            year old kid from Kenya. I hope this app has really
                            helped you be productive. I intend to make this app
                            free and ad-free forever. If this app has helped you
                            out, consider donating below It would mean alot.
                            Thank you for using this app. If you are
                            experiencing issues or have suggestions on
                            improvements, click on the report/suggest button
                            below (I read every single email and I will try my
                            best to implement any request. Just bare in mind
                            that I am alone, also have school, so just hang in
                            there! I will try my best)
                        </div>
                        <div className="element">
                            <span className="text" style={{ flex: "1" }}>
                                1 Fries{" "}
                                <span
                                    role="img"
                                    aria-label="jsx-a11y/accessible-emoji"
                                >
                                    🍟
                                </span>
                            </span>
                            <span style={{ flex: "1", textAlign: "right" }}>
                                <span
                                    style={{ color: "1395ff" }}
                                    onClick={() =>
                                        handleDonation("4636879632684710377")
                                    }
                                >
                                    Donate $ 0.99
                                </span>
                            </span>
                        </div>
                        <div className="element">
                            <span className="text" style={{ flex: "1" }}>
                                Cup of coffee{" "}
                                <span
                                    role="img"
                                    aria-label="jsx-a11y/accessible-emoji"
                                >
                                    ☕
                                </span>
                            </span>
                            <span style={{ flex: "1", textAlign: "right" }}>
                                <span
                                    style={{ color: "1395ff" }}
                                    onClick={() =>
                                        handleDonation("4637282709189258831")
                                    }
                                >
                                    Donate $ 2.99
                                </span>
                            </span>
                        </div>
                        <div className="element">
                            <span className="text" style={{ flex: "1" }}>
                                Fancy lunch here in Kenya{" "}
                                <span
                                    role="img"
                                    aria-label="jsx-a11y/accessible-emoji"
                                >
                                    🥙
                                </span>
                            </span>
                            <span style={{ flex: "1", textAlign: "right" }}>
                                <span
                                    style={{ color: "1395ff" }}
                                    onClick={() =>
                                        handleDonation("4636871259449741312")
                                    }
                                >
                                    Donate $ 9.99
                                </span>
                            </span>
                        </div>
                        <div className="element">
                            <span className="text" style={{ flex: "1" }}>
                                A gracious thank you{" "}
                                <span
                                    role="img"
                                    aria-label="jsx-a11y/accessible-emoji"
                                >
                                    ❤
                                </span>
                            </span>
                            <span style={{ flex: "1", textAlign: "right" }}>
                                <span
                                    style={{ color: "1395ff" }}
                                    onClick={() =>
                                        handleDonation("4637540462936000632")
                                    }
                                >
                                    Donate $ 29.99
                                </span>
                            </span>
                        </div>
                        <div className="element">
                            <span className="text" style={{ flex: "1" }}>
                                Keep project going!{" "}
                                <span
                                    role="img"
                                    aria-label="jsx-a11y/accessible-emoji"
                                >
                                    🚀
                                </span>
                            </span>
                            <span style={{ flex: "1", textAlign: "right" }}>
                                <span
                                    style={{ color: "1395ff" }}
                                    onClick={() =>
                                        handleDonation("4636639358133357006")
                                    }
                                >
                                    Donate $ 99
                                </span>
                            </span>
                        </div>
                        <div className="element">
                            <span className="text" style={{ flex: "2" }}>
                                Member{" "}
                                <span
                                    role="img"
                                    aria-label="jsx-a11y/accessible-emoji"
                                >
                                    🦾
                                </span>
                            </span>
                            <span style={{ flex: "1", textAlign: "right" }}>
                                <span style={{ color: "1395ff" }}>
                                    Donate $ 1.99 monthly
                                </span>
                            </span>
                        </div>
                        <div className="element">
                            <span className="text" style={{ flex: "3" }}>
                                I have an issue/suggestion
                            </span>
                            <span style={{ flex: "1", textAlign: "right" }}>
                                <a
                                    href="mailto://lively@random-ly.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    report/suggest
                                </a>
                            </span>
                        </div>
                    </div>

                    <span className="title">Privacy</span>
                    <div
                        className="text"
                        style={{ marginTop: "15px", marginBottom: "20px" }}
                    >
                        Lively does not collect personal information. All the
                        data (todos, productivity time & todo lists) is stored
                        on your phone, I do not have ad networks as Lively is
                        and will be ad-free & OpenSource. If you choose to back
                        up your data, it is stored in your Google account
                        (Google Drive) -- Coming soon!
                    </div>

                    <span className="title">Technical</span>
                    <div
                        className="text"
                        style={{ marginTop: "15px", marginBottom: "20px" }}
                    >
                        Made on Earth{" "}
                        <span role="img" aria-label="jsx-a11y/accessible-emoji">
                            🌍
                        </span>{" "}
                        by a human with
                        <span role="img" aria-label="jsx-a11y/accessible-emoji">
                            ❤
                        </span>{" "}
                        from Kenya 🇰🇪
                    </div>

                    <div
                        className="text"
                        style={{ marginTop: "15px", marginBottom: "20px" }}
                    >
                        Languages used to make this app: Java, Swift,
                        JavaScript, React and packaged using Capacitor
                    </div>
                    <div className="text" style={{ marginTop: "15px" }}>
                        Icons by{" "}
                        <a
                            href="https://icons8.com"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            icons8
                        </a>
                    </div>
                    <div className="text">
                        Ambient sound by{" "}
                        <a
                            href="https://www.soundjay.com/"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            soundjay
                        </a>
                    </div>

                    <div className="text" style={{ marginBottom: "20px" }}>
                        Other sounds by{" "}
                        <a
                            href="https://notificationsounds.com/"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            Notification Sounds
                        </a>
                    </div>

                    <div
                        className="text"
                        style={{ marginTop: "15px", marginBottom: "20px" }}
                    >
                        This project is OpenSource on{" "}
                        {/* TODO: Add Github link here when project is deployed  */}
                        Github . You can contribute to it. If you appreciate
                        this work, consider donating above. Thank you!
                    </div>

                    <div
                        className="text"
                        style={{
                            marginTop: "15px",
                            marginBottom: "75px",
                            color: "grey",
                        }}
                    >
                        Lively v1.06 build #6
                    </div>
                </div>
            </div>
        </LazyLoad>
    );
};

export default Settings;
