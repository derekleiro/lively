import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import LazyLoad from "react-lazyload";

import "./timer.css";

import { navStateTimer } from "../../actions/bottom_nav";
import TimerFeed from "../../components/timerfeed/TimerFeed";

const Timer = () => {
    const dispatch = useDispatch();

    const [fade, setFade] = useState(false);

    useEffect(() => {
        let unmounted = false;

        dispatch(navStateTimer);
        window.scrollTo(0, 0);

        setTimeout(() => {
            if (!unmounted) {
                setFade(true);
            }
        }, 50);

        return () => {
            unmounted = true;
        };
    }, [dispatch]);

    return (
        <div className="page" style={{ opacity: fade ? 1 : 0 }}>
            <LazyLoad>
                <TimerFeed />
            </LazyLoad>
        </div>
    );
};

export default Timer;
