import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import "./lists-feed.css";

import List from "./list/List";

import { mode } from "../../constants/color";

import list_color from "../../assets/icons/list_color.png";

import Done from "../done/Done";
import { add_list_timeout } from "../../actions/timeouts";
import Loading from "../loading/Loading";
import ThankYou from "../../pages/thank_you/ThankYou";

const ListsFeed = () => {
	const dispatch = useDispatch();

	const darkMode = useSelector((state) => state.dark_mode);
	const thanks_state = useSelector((state) => state.thanks);
	const users_lists = useSelector((state) => state.users_lists);
	const list_timeout = useSelector((state) => state.list_timeout);

	const lists_feed = useSelector((state) => state.lists_feed.lists).sort(
		(todoA, todoB) => {
			return todoA.index - todoB.index;
		}
	);

	const [add, setAdd] = useState(false);
	const [user_list_count, setUserListCount] = useState(0);

	const default_ = useSelector((state) => state.default_);
	const completed_ = useSelector((state) => state.completed_);
	const important_ = useSelector((state) => state.important_);

	const style = {
		topNav: {
			top: 0,
			height: "45px",
			backgroundColor: darkMode ? mode.dark : mode.light,
			display: "flex",
			alignItems: "center",
			padding: "15px 0 10px 0",
		},
		title: {
			flex: 1,
			paddingLeft: "20px",
		},
		new: {
			flex: 1,
			textAlign: "right",
			paddingRight: "20px",
			fontSize: "14px",
			color: "#1395ff",
		},
		imgStyle: {
			width: "20px",
			height: "20px",
			marginLeft: "10px",
			verticalAlign: "middle",
		},
		style: {
			color: darkMode ? "white" : "black",
			fontFamily: `"Poppins", sans-serif`,
		},
		list: {
			borderRadius: "35px",
			textAlign: "center",
			padding: "12.5px",
			background: darkMode ? "rgb(15, 15, 15)" : "rgb(240, 240, 240)",
		},
	};

	const [lists, setLists] = useState(lists_feed);

	const generateID = () => {
		const uuid = uuidv4();
		return `list_${uuid}`;
	};

	const handleClick = () => {
		setAdd(true);
		return setLists([
			...lists,
			{
				name: null,
				todo: 0,
				completed: 0,
				list_id: generateID(),
				default: false,
			},
		]);
	};

	const handleEdit = () => {
		if (add) {
			setAdd(false);
		} else {
			setAdd(true);
		}
	};

	const handleEditBlank = () => {
		setLists(lists.filter((list) => list.name !== null));
		setAdd(false);
	};

	useEffect(() => {
		let unmounted = false;

		if (!unmounted) {
			setLists(lists_feed);
			const default_count = lists_feed.filter((list) => list.default === true);
			setUserListCount(lists_feed.length - default_count.length);
		}

		return () => {
			unmounted = true;
		};
	}, [lists_feed]);

	useEffect(() => {
		if (list_timeout === 0) {
			const timeout = setTimeout(() => {
				dispatch(add_list_timeout);
				clearTimeout(timeout);
			}, 1500);
		}
	}, []);

	return (
		<div className="container" style={{ padding: "0px 12px" }}>
			<div className="container_top_nav" style={style.topNav}>
				<span className="title" style={style.title}>
					Your Lists{" "}
					{user_list_count !== 0 ? (
						<span>
							<span
								style={{ margin: `0 5px`, ...style }}
								dangerouslySetInnerHTML={{ __html: `&#8226;` }}
							></span>
							<span style={style.style}>{user_list_count}</span>{" "}
						</span>
					) : null}
				</span>
				<div style={style.new} onClick={add ? null : handleClick}>
					+ New List
				</div>
			</div>

			<div className="space" style={{ marginTop: "82.5px" }}></div>

			{thanks_state && <ThankYou />}

			{lists.length === 0 ? (
				<Done>
					<div className="done_options">
						<img src={list_color} alt="Add a new list" />

						<div className="done_text">
							Add some organisation to your to do's
						</div>
					</div>
				</Done>
			) : null}

			{list_timeout === 0 ? (
				<Loading />
			) : (
				<div id="list-main-container">
					{lists.map((list, index) => {
						if (list.name === "All" && list.default) {
							return (
								<div className="list-container" style={style.list} key={index}>
									<List
										name={list.name}
										default={true}
										id={list.list_id}
										index={index}
										default_values={default_ || list.values}
									/>
								</div>
							);
						} else if (list.name === "Important" && list.default) {
							return (
								<div className="list-container" style={style.list} key={index}>
									<List
										name={list.name}
										default={true}
										id={list.list_id}
										index={index}
										default_values={important_ ? important_ : list.values}
									/>
								</div>
							);
						} else if (list.name === "Completed" && list.default) {
							return (
								<div className="list-container" style={style.list} key={index}>
									<List
										name={list.name}
										default={true}
										id={list.list_id}
										index={index}
										default_values={completed_ || list.values}
									/>
								</div>
							);
						}
					})}

					{lists.map((list, index) => {
						if (!list.default) {
							return (
								<div className="list-container" style={style.list} key={index}>
									<List
										name={list.name}
										handleEdit={handleEdit}
										handleEditBlank={handleEditBlank}
										default={false}
										adding={add}
										id={list.list_id}
										index={index}
										users_lists={users_lists}
									/>
								</div>
							);
						}
					})}
				</div>
			)}
		</div>
	);
};

export default ListsFeed;
