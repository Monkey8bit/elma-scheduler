const calendar = {};

const months = {
    "0": "January",
    "1": "February",
    "2": "March",
    "3": "April",
    "4": "May",
    "5": "June",
    "6": "July",
    "7": "August",
    "8": "September",
    "9": "October",
    "10": "November",
    "11": "December",
}

const weekDays = {
    "0": "Sunday",
    "1": "Monday",
    "2": "Tuesday",
    "3": "Wednesday",
    "4": "Thursday",
    "5": "Friday",
    "6": "Saturday"
}


function buildCalendar () {
    let monthsNumber = 11;
    for (let mon = 0;mon <= monthsNumber;mon++) {
        let monthDays = new Date(2022, `${mon}`, 0).getDate()
        calendar[mon] = {};
        for (let day = 1;day <= monthDays;day++) {
            calendar[mon][day] = {};
        }
    }

}


buildCalendar()

export {calendar, months, weekDays}
