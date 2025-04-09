import { format } from "date-fns";

export function monthDayYear(dateTime) { 
    const date = new Date(dateTime);
    return format(date, "MMMM dd, yyyy");
}

export function hourMinute(dateTime) {
    const time = new Date(dateTime);
    return format(time, "hh:mm aa");
}