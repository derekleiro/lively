import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import LazyLoad from "react-lazyload";

import "./list-view.css";

import { navStateLists } from "../../actions/bottom_nav";
import ListViewFeed from "../../components/listView/ListView";
import { mode } from "../../constants/color";

const ListView = () => {
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
        }, 0);

        dispatch(navStateLists);
        window.scrollTo(0, 0);

        return () => {
            unmounted = true;
        };
    }, [dispatch]);

    return (
        <div className="page" style={style}>
            <LazyLoad>
                <ListViewFeed />
            </LazyLoad>
        </div>
    );
};

export default ListView;
