const dark_mode = (state = true, action) => {
    switch (action.type) {
        case "CHANGE_TO_LIGHT":
            return state = false;
        case "CHANGE_TO_DARK":
            return state = true;
        default:
            return state;
    }
};

export default dark_mode;
