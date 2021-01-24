import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import LazyLoad from "react-lazyload";

import "./lists.css";

import ListsFeed from "../../components/lists/ListsFeed";
import { navStateLists } from "../../actions/bottom_nav";

const Lists = () => {
    const dispatch = useDispatch();

    const [fade, setFade] = useState(false);

    useEffect(() => {
        let unmounted = false;

        setTimeout(() => {
            if (!unmounted) {
                setFade(true);
            }
        }, 50);

        dispatch(navStateLists);
        window.scrollTo(0, 0);

        return () => {
            unmounted = true;
        };
    }, [dispatch]);

    return (
        <div className="page" style={{ opacity: fade ? 1 : 0 }}>
            <LazyLoad>
                <ListsFeed />
            </LazyLoad>
        </div>
    );
};

export default Lists;
