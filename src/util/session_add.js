import add_today_session from "./today_session";
import add_week_session from "./week_session";

export const session_add = (data) => {
    add_today_session(data);
    add_week_session(data);
};
