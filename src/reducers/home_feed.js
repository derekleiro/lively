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

export const DonationItemsReducer = (state = { items: [] }, action) => {
    switch (action.type) {
        case "DISPATCH_DONATION_ITEMS":
            return (state = {
                ...state,
                items: action.payload,
            });
        case "REMOVE_DONATION_ITEMS":
            return (state = { items: [] });
        default:
            return state;
    }
};

export const DonationMemberReducer = (state = 0, action) => {
    switch (action.type) {
        case "SET_DONATION_MEMBER":
            return (state = state + 1);
        case "RESET_DONATION_MEMBER":
            return (state = 0);
        default:
            return state;
    }
};
