import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LazyLoad from "react-lazyload";

import "./add.css";

import { mode } from "../../constants/color";
import AddFeed from "../../components/addfeed/AddFeed";

const Add = () => {
    const darkMode = useSelector((state) => state.dark_mode);

    const [fade, setFade] = useState(false);

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
        let unmounted = false;

        window.scrollTo(0, 0);

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
            <LazyLoad>
                <AddFeed />
            </LazyLoad>
        </div>
    );
};

export default Add;
