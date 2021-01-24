import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Howl } from "howler";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import LazyLoad from "react-lazyload";

import { mode } from "../../constants/color";

import back_icon from "../../assets/icons/back.png";
import back_icon_light from "../../assets/icons/back_light.png";
import congrats from "../../assets/icons/done.png";
import cheers from "../../assets/sounds/cheers.webm";

import Done from "../../components/done/Done";

const sound = new Howl({
    src: [cheers],
    html5: true,
    loop: true,
    preload: true,
    format: ["webm"],
});

const Fireworks = () => {
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

    const encouraging = [
        `Congratulations, you have achieved your goal!. Feels
    great huh? Science shows that we tend to be happy
    after achieving a goal. Take yourself out to dinner
    and reward yourself! You deserve it champ 🎉🚀`,

        `You are killing it! Take a moment and appreciate yourself thoroughly! Take yourself out to dinner
        and reward yourself! You deserve it champ 🎉🚀`,

        `With that go to attitude and self appreciation, you are going far, trust me! 
            Take this moment and do something fun and reward yourself! You deserve it champ 🎉🚀`,

        `Repeat after me, "I am NOT a failure"! You are soo soo much closer to achieving your dreams! 
            Take this moment and really appreaciate yourself for achieving your goal!🚀 Go and do your favorite activity 
            cause you deserve it champ 🎉`,

        `"I’ve got nothing to do today but smile." And I couldn't agree more! Reward yourself to really appreciate, the fact
        that YOU, yes YOU can achieve anything! 🎉🚀`,

        `Congratulations! You are now among the small percentage of people achieving their goals! Feels nice eh? Now go reward
        yourself, go crazy and celebrate this moment, You deserve every single moment! 🎉🚀`,

        `"Looking around, the world has so much to offer, I should just live every second of my life and achieve
        my goals and don’t think about the bad things." Hey you said it not me, and I agree! Now go reward yourself! 🎉🚀`,
    ];

    const random = () => {
        const number = Math.floor(Math.random() * encouraging.length);
        return number;
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
                            <Link to="/goals">
                                <img
                                    src={darkMode ? back_icon_light : back_icon}
                                    alt="Go back"
                                />
                            </Link>
                        </span>

                        <span className="title">Congrats</span>
                    </div>
                    <Done>
                        <div className="done_options">
                            <img
                                src={congrats}
                                alt="Congratulations on achieving your goal!"
                            />

                            <div className="done_text">
                                {encouraging[random()]}
                            </div>
                        </div>
                    </Done>
                </div>
            </div>
        </LazyLoad>
    );
};

export default Fireworks;
