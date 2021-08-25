import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { Plugins } from "@capacitor/core";
import { InAppPurchase2 as Store } from "@ionic-native/in-app-purchase-2";
import { isPlatform } from "@ionic/react";

import Done from "../../components/done/Done";

import "./settings.css";

import { mode } from "../../constants/color";

import back_icon from "../../assets/icons/back.png";
import back_icon_light from "../../assets/icons/back_light.png";
import error500 from "../../assets/icons/404.png";
import donate_icon from "../../assets/icons/donate.png";
import { setLightMode, setDarkMode } from "../../actions/dark_mode";
import { remove_donation_modal } from "../../actions/home_feed";
import SetLang from "../../components/setlang/SetLang";
import SetName from "../../components/setname/SetName";
import Email from "./Email";

const Settings = () => {
	const { Share, Toast, Storage, App } = Plugins;

	const DONATION_IDS = ["2_member", "3_donation", "100_donation"];

	const dispatch = useDispatch();
	const history = useHistory();
	const donation_section = useRef(null);

	const darkMode = useSelector((state) => state.dark_mode);
	const donation_modal = useSelector((state) => state.donation_modal);
	const products = useSelector((state) => state.donation.items);
	const is_member = useSelector((state) => state.is_member);
	const lang_state = useSelector((state) => state.lang);
	const name_state = useSelector((state) => state.name);

	const [fade, setFade] = useState(false);
	const [isReporting, setIsReporting] = useState(false);
	const [alreadyMember, setAlreadyMember] = useState(false);
	const [purchaseError, setPurchaseError] = useState(false);

	const [showLanguageModal, setShowLanguageModal] = useState(false);
	const [showSetNameModal, setShowSetNameModal] = useState(false);

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

	const elemStyle = {
		background: darkMode ? "rgb(15, 15, 15)" : "rgb(240, 240, 240)",
	};

	const handleBack = () => {
		history.replace("/");
	};

	const handleSwitch = async () => {
		if (darkMode) {
			await Storage.set({ key: "darkMode", value: JSON.stringify(false) });
			dispatch(setLightMode);
		} else {
			await Storage.set({ key: "darkMode", value: JSON.stringify(true) });
			dispatch(setDarkMode);
		}
	};

	const handleShare = async () => {
		await Share.share({
			title: `Lively: Motivational to-do list & time tracker`,
			text: `The to-do list, goals list & time tracker made to motivate you to be productive!`,
			url: "https://play.google.com/store/apps/details?id=com.lively.life", // TODO Change this later to also include iOS app store id
			dialogTitle: `The to-do list, goals list & time tracker made to motivate you to be productive!`,
		});
	};

	const handleReview = () => {
		// TODO add iOS link when it's available
		window.open(
			"https://play.google.com/store/apps/details?id=com.lively.life",
			"_blank"
		);
	};

	const handleEvents = async () => {
		Store.when("product").cancelled(() => {
			setPurchaseError(true);
		});

		Store.when("product").error(() => {
			setPurchaseError(true);
		});
	};

	const handleDonation = async (id) => {
		Store.order(id).then(
			(p) => {
				// Processing donation
			},
			async (e) => {
				await Toast.show({
					text: "There was an error processing your donation....",
					duration: "long",
					position: "bottom",
				});
				setPurchaseError(true);
			}
		);
	};

	const handleLangChange = () => {
		if (showLanguageModal) {
			setShowLanguageModal(false);
		} else {
			setShowLanguageModal(true);
		}
	};

	const handleNameChange = () => {
		if (showSetNameModal) {
			setShowSetNameModal(false);
		} else {
			setShowSetNameModal(true);
		}
	};

	const handleRestore = async () => {
		Store.refresh();
		await Toast.show({
			text: "Subscription and purchases restored",
			duration: "long",
			position: "bottom",
		});
	};

	const handleKofiPage = () => {
		window.open("https://ko-fi.com/derekleiro", "_blank");
	};

	useEffect(() => {
		let unmounted = false;

		if (isPlatform("android") || isPlatform("ios")) {
			handleEvents();
		}

		setTimeout(() => {
			if (!unmounted) {
				setFade(true);
			}
		}, 50);

		return () => {
			unmounted = true;
			Store.off();
			dispatch(remove_donation_modal);
		};
	}, []);

	useEffect(() => {
		if (donation_modal && donation_section.current !== null) {
			donation_section.current.scrollIntoView({
				behavior: "smooth",
			});
		}
	}, [donation_section.current]);

	return (
		<div className="page" style={style}>
			{showLanguageModal ? (
				<SetLang handleLangSelect={handleLangChange} />
			) : null}
			{showSetNameModal ? (
				<SetName handleFinishNameSet={handleNameChange} />
			) : null}

			{isReporting && <Email close={() => setIsReporting(false)} />}

			<div className="container">
				<div
					className="container_top_nav"
					style={{
						backgroundColor: darkMode ? mode.dark : mode.light,
					}}
				>
					<span className="back_icon">
						<img
							onClick={handleBack}
							src={darkMode ? back_icon_light : back_icon}
							alt="Go back"
						/>
					</span>
					<span className="title">Settings</span>
				</div>

				<div className="space"></div>

				{alreadyMember && purchaseError === false ? (
					<Done load={true}>
						<div className="done_options">
							<img src={donate_icon} alt="Proud member" />
							<div className="done_text">
								Yaay, you're already a member 😎. I am truly grateful for all
								your support ❤
							</div>
							<div className="done_text">
								You can always{" "}
								<span
									onClick={() => Store.manageSubscriptions()}
									style={{ color: "#1395ff" }}
								>
									manage your subsription
								</span>
							</div>
							<span
								className="action_button"
								style={{
									color: "#1395ff",
								}}
								onClick={() => setAlreadyMember(false)}
							>
								Ok
							</span>
						</div>
					</Done>
				) : null}

				{purchaseError && alreadyMember === false ? (
					<Done load={true}>
						<div className="done_options">
							<img
								src={error500}
								alt="Unfortunately there was a problem processing the
                                donation."
							/>
							<div className="done_text">
								Unfortunately there was a problem processing your donation. But
								you can always try again. Thank you! ❤
							</div>
							<span
								className="action_button"
								style={{
									color: "#1395ff",
								}}
								onClick={() => setPurchaseError(false)}
							>
								Ok
							</span>
						</div>
					</Done>
				) : null}

				<div className="element" style={elemStyle}>
					<span className="text" style={{ flex: "1" }}>
						Dark mode
					</span>
					<span style={{ flex: "1", textAlign: "right" }}>
						<label className="switch">
							<input
								type="checkbox"
								checked={darkMode}
								onChange={handleSwitch}
							/>
							<span className="slider round"></span>
						</label>
					</span>
				</div>

				<div className="element" style={elemStyle}>
					<span className="text" style={{ flex: "1" }}>
						Language
					</span>
					<span
						style={{
							flex: "1",
							textAlign: "right",
							color: "#1395ff",
						}}
						// TODO : To be added back later
						// onClick={handleLangChange}
					>
						{/* {lang_state} */} Coming soon
					</span>
				</div>

				<div className="element" style={elemStyle}>
					<span className="text" style={{ flex: "1" }}>
						Display name{" "}
						<span role="img" aria-label="jsx-a11y/accessible-emoji">
							🤠
						</span>
					</span>
					<span
						style={{
							flex: "1",
							textAlign: "right",
							color: "#1395ff",
						}}
						onClick={handleNameChange}
					>
						{name_state}
					</span>
				</div>

				<div className="element" style={elemStyle}>
					<span className="text" style={{ flex: "2" }}>
						You can import this file back to recover your data{" "}
						<span role="img" aria-label="jsx-a11y/accessible-emoji">
							🛳
						</span>
					</span>
					<span
						style={{
							flex: "1",
							textAlign: "right",
							color: "#1395ff",
						}}
					>
						<Link to="/export">Export data</Link>
					</span>
				</div>

				<div className="element" style={elemStyle}>
					<span className="text" style={{ flex: "2" }}>
						Restore your data from your exported file{" "}
						<span role="img" aria-label="jsx-a11y/accessible-emoji">
							🛬
						</span>
					</span>
					<span
						style={{
							flex: "1",
							textAlign: "right",
							color: "#1395ff",
						}}
					>
						<Link to="/import">Import data</Link>
					</span>
				</div>

				<div className="element" style={elemStyle}>
					<span className="text" style={{ flex: "1" }}>
						Already a monthly supporting member?
					</span>
					<span
						style={{
							flex: "1",
							textAlign: "right",
							color: "#1395ff",
						}}
						onClick={handleRestore}
					>
						Restore subscription
					</span>
				</div>

				<div className="element" style={elemStyle}>
					<span className="text" style={{ flex: "1" }}>
						Privacy? No problem. All your data is stored locally on your phone.{" "}
						<span role="img" aria-label="jsx-a11y/accessible-emoji">
							🔒
						</span>
					</span>
				</div>

				<div className="element" style={elemStyle}>
					<span className="text" style={{ flex: "1" }}>
						Made on Earth{" "}
						<span role="img" aria-label="jsx-a11y/accessible-emoji">
							🌍
						</span>{" "}
						by a human with{" "}
						<span role="img" aria-label="jsx-a11y/accessible-emoji">
							❤
						</span>{" "}
						from Kenya 🇰🇪
					</span>
				</div>

				<div id="donate_section" ref={donation_section}>
					<div className="title">Support Development</div>

					{products.map((product, index) => {
						return (
							<div className="element" style={elemStyle} key={index}>
								<span className="text" style={{ flex: "1" }}>
									{product.title}
								</span>
								<span
									style={{
										flex: "1",
										textAlign: "right",
									}}
								>
									<span
										style={{ color: "1395ff" }}
										onClick={() => {
											if (index === 0) {
												if (is_member) {
													setAlreadyMember(true);
												} else {
													handleDonation(DONATION_IDS[index]);
												}
											} else {
												handleDonation(DONATION_IDS[index]);
											}
										}}
									>
										{index === 0 ? (
											<>
												{!is_member ? (
													<>{product.price} monthly</>
												) : (
													"Proud member 😎"
												)}
											</>
										) : (
											<>{product.price}</>
										)}
									</span>
								</span>
							</div>
						);
					})}

					<div className="element" style={elemStyle}>
						<span className="text" style={{ flex: "3" }}>
							I have an issue/suggestion
						</span>
						<span
							style={{ flex: "1", textAlign: "right", color: "#1395ff" }}
							onClick={() => setIsReporting(true)}
						>
							report/suggest
						</span>
					</div>

					<div className="element" style={elemStyle}>
						<span className="text" style={{ flex: "1" }}>
							I would love to hear from you 😊
						</span>
						<span
							style={{
								flex: "1",
								textAlign: "right",
								color: "#1395ff",
							}}
							onClick={handleReview}
						>
							Leave a review
						</span>
					</div>

					<div className="element" style={elemStyle}>
						<span className="text" style={{ flex: "3" }}>
							Know someone who might need this app? 🐱‍
						</span>
						<span
							style={{
								flex: "1",
								textAlign: "right",
								color: "#1395ff",
							}}
							onClick={handleShare}
						>
							Share
						</span>
					</div>

					<div className="element" style={elemStyle}>
						<span className="text" style={{ flex: "2" }}>
							More about me! 👦🏾
						</span>
						<span
							style={{
								flex: "1",
								textAlign: "right",
								color: "#1395ff",
							}}
							onClick={handleKofiPage}
						>
							My Ko-fi page {/* Later on, change this to my website */}
						</span>
					</div>
				</div>

				<span className="title">Thanks to</span>
				<div className="text" style={{ marginTop: "15px" }}>
					Icons by{" "}
					<a
						href="https://icons8.com"
						rel="noopener noreferrer"
						target="_blank"
					>
						icons8
					</a>
				</div>
				<div className="text">
					Ambient sound by{" "}
					<a
						href="https://www.soundjay.com/"
						rel="noopener noreferrer"
						target="_blank"
					>
						soundjay
					</a>
				</div>

				<div className="text" style={{ marginBottom: "20px" }}>
					Other sounds by{" "}
					<a
						href="https://notificationsounds.com/"
						rel="noopener noreferrer"
						target="_blank"
					>
						Notification Sounds
					</a>
				</div>

				{/* <div
						className="text"
						style={{ marginTop: "15px", marginBottom: "20px" }}
					>
						This project will be OpenSource and will be open to contibutions soon at
						Github. If you appreciate this work, consider supporting it above.
						Thank you!
					</div> */}

				<div
					className="text"
					style={{
						marginTop: "15px",
						marginBottom: "75px",
						color: "grey",
					}}
				>
					Lively v3.00 release
				</div>
			</div>
		</div>
	);
};

export default Settings;
