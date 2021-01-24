import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LazyLoad from "react-lazyload";

import "./home.css";

import HomeFeed from "../../components/homefeed/HomeFeed";
import { navStateHome } from "../../actions/bottom_nav";

const Home = () => {
    const dispatch = useDispatch();

    const home_height = useSelector((state) => state.home_height);
    const [fade, setFade] = useState(false);

    useEffect(() => {
        let unmounted = false;

        setTimeout(() => {
            if (!unmounted) {
                setFade(true);
            }
        }, 50);

        window.scrollTo(home_height, 0);
        dispatch(navStateHome);

        return () => {
            unmounted = true;
        };
    }, [dispatch]);

    return (
        <div className="page" style={{ opacity: fade ? 1 : 0 }}>
            <LazyLoad>
                <HomeFeed />
            </LazyLoad>
        </div>
    );
};

export default Home;
