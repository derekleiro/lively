export const DonationReducer = (state = 0, action) => {
    switch (action.type) {
        case "SHOW_DONATION_MODAL":
            return (state = state + 1);
        case "REMOVE_DONATION_MODAL":
            return (state = 0);
        default:
            return state;
    }
};
