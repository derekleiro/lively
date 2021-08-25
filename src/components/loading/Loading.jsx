import React from "react";

import Done from "../done/Done";
import loading from "../../assets/icons/loading.gif";

const Loading = () => {
	return (
		<Done load={true}>
			<div className="done_options">
				<img
					style={{ width: "35px", height: "35px" }}
					src={loading}
					alt="Loading your tasks"
				/>
			</div>
		</Done>
	);
};

export default Loading;
