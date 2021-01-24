import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LazyLoad from "react-lazyload";

import "./goals-completed.css";

import GoalsCompletedFeed from "../../components/goals_completed/GoalsCompletedFeed";
import { navStateGoals } from "../../actions/bottom_nav";
import { mode } from "../../constants/color";

const GoalsCompleted = () => {
    const dispatch = useDispatch();
    const darkMode = useSelector((state) => state.dark_mode);

    const [fade, setFade] = useState(false);
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

    useEffect(() => {
        let unmounted = false;

        setTimeout(() => {
            if (!unmounted) {
                setFade(true);
            }
        }, 50);

        window.scrollTo(0, 0);
        dispatch(navStateGoals);

        return () => {
            unmounted = true;
        };
    }, [dispatch]);

    return (
        <div className="page" style={style}>
            <LazyLoad>
                <GoalsCompletedFeed />
            </LazyLoad>
        </div>
    );
};

export default GoalsCompleted;
