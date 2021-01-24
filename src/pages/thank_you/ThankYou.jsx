import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Howl } from "howler";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import LazyLoad from "react-lazyload";

import { mode } from "../../constants/color";

import back_icon from "../../assets/icons/back.png";
import back_icon_light from "../../assets/icons/back_light.png";
import thanks from "../../assets/icons/done.png";
import cheers from "../../assets/sounds/cheers.webm";

import Done from "../../components/done/Done";

const sound = new Howl({
    src: [cheers],
    html5: true,
    loop: true,
    preload: true,
    format: ["webm"],
});

const ThankYou = () => {
    const darkMode = useSelector((state) => state.dark_mode);

    const [fade, setFade] = useState(false);

    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => {
        return Math.random() * (max - min) + min;
    };

    let interval;

    const style = {
        position: "fixed",
        width: "100%",
        height: "100%",
        top: "0",
        zIndex: "10",
        backgroundColor: darkMode ? mode.dark : mode.light,
        overflow: "auto",
        opacity: fade ? 1 : 0,
    };

    useEffect(() => {
        sound.play();
        interval = setInterval(function () {
            const particleCount = 50;
            confetti(
                Object.assign({}, defaults, {
                    particleCount,
                    origin: {
                        x: randomInRange(0.1, 0.3),
                        y: Math.random() - 0.2,
                    },
                })
            );
            confetti(
                Object.assign({}, defaults, {
                    particleCount,
                    origin: {
                        x: randomInRange(0.7, 0.9),
                        y: Math.random() - 0.2,
                    },
                })
            );
        }, 500);

        let unmounted = false;
        window.scrollTo(0, 0);

        setTimeout(() => {
            if (!unmounted) {
                setFade(true);
            }
        }, 50);

        return () => {
            sound.stop();
            clearInterval(interval);
        };
    }, []);
    return (
        <LazyLoad>
            <div className="page" style={style}>
                <div className="container" style={{ marginBottom: "125px" }}>
                    <div
                        className="container_top_nav"
                        style={{
                            backgroundColor: darkMode ? mode.dark : mode.light,
                        }}
                    >
                        <span className="back_icon">
                            <Link to="/settings">
                                <img
                                    src={darkMode ? back_icon_light : back_icon}
                                    alt="Go back"
                                />
                            </Link>
                        </span>

                        <span className="title">Thank You</span>
                    </div>
                    <Done>
                        <div className="done_options">
                            <img
                                src={thanks}
                                alt="Congratulations on achieving your goal!"
                            />
                            <div className="done_text">
                                "The best way to succeed, is by helping others"
                            </div>
                            <div className="done_text">
                                Thank you so much! You are progressing
                                OpenSource software meant to help people. I am
                                truly greatful for you using the app, donating
                                and believing in positive reinforcement
                                learning.
                            </div>
                        </div>
                    </Done>
                </div>
            </div>
        </LazyLoad>
    );
};

export default ThankYou;
