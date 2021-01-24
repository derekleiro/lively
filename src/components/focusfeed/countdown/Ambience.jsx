import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Howl } from "howler";

import playing_sound from "../../../assets/icons/playing.png";
import playing_sound_light from "../../../assets/icons/playing_light.png";

import pause_sound from "../../../assets/icons/paused.png";
import pause_sound_light from "../../../assets/icons/paused_light.png";

import ambient_sound from "../../../assets/sounds/rain.ogg";

const sound = new Howl({
    src: [ambient_sound],
    loop: true,
    preload: true,
    html5: true,
    sprite: {
        rain: [0, 7000],
    },
    format: ["ogg"],
});

const Ambience = () => {
    const [playing, setPlaying] = useState(false);

    const darkMode = useSelector((state) => state.dark_mode);

    const play = () => {
        sound.play("rain");
        setPlaying(true);
    };

    const pause = () => {
        sound.pause();
        setPlaying(false);
    };

    useEffect(() => {
        return () => {
            sound.stop();
        };
    }, []);

    return (
        <div
            id="ambience"
            style={{
                border: darkMode
                    ? "1px solid rgb(30, 30, 30)"
                    : "1px solid rgb(240, 240, 240)",
            }}
        >
            <span id="ambience_photo">
                {playing ? (
                    <img
                        src={darkMode ? playing_sound_light : playing_sound}
                        alt="Stoping playing ambient music"
                        onClick={pause}
                    />
                ) : (
                    <img
                        src={darkMode ? pause_sound_light : pause_sound}
                        alt="Start playing ambient music"
                        onClick={play}
                    />
                )}
            </span>
            <span id="ambient_text">Rain Ambience</span>
        </div>
    );
};

export default Ambience;
