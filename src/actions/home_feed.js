export const show_donation_modal = {
    type: "SHOW_DONATION_MODAL",
};

export const remove_donation_modal = {
    type: "REMOVE_DONATION_MODAL",
};

export const dispatch_donation_items = (data) => {
    return {
        type: "DISPATCH_DONATION_ITEMS",
        payload: data,
    };
};

export const clear_donation_items = {
    type: "REMOVE_DONATION_ITEMS",
};

export const set_donation_member = {
    type: "SET_DONATION_MEMBER",
};

export const reset_donation_member = {
    type: "RESET_DONATION_MEMBER",
};

export const set_battery_opt = {
    type: "SET_BATTERY_OPT",
};

export const reset_battery_opt = {
    type: "RESET_BATTERY_OPT",
};

export const activate_bnav_limit = {
    type: "ACTIVATE_LIMIT",
};

export const reset_bnav_limit = {
    type: "RESET_LIMIT",
};
