const bottom_nav = (state = "", action) => {
    switch (action.type) {
        case "CHANGE_TO_HOME":
            return (state = "home");
        case "CHANGE_TO_LISTS":
            return (state = "lists");
        case "CHANGE_TO_ADD":
            return (state = "add");
        case "CHANGE_TO_GOALS":
            return (state = "goals");
        case "CHANGE_TO_TIMER":
            return (state = "timer");
        case "CHANGE_TO_SETTINGS":
            return (state = "settings");
        default:
            return state;
    }
};

export default bottom_nav;
