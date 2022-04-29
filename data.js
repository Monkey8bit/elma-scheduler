const calendar = {};

const months = {
    "1": "January",
    "2": "February",
    "3": "March",
    "4": "April",
    "5": "May",
    "6": "June",
    "7": "July",
    "8": "August",
    "9": "September",
    "10": "October",
    "11": "November",
    "12": "December",
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
    let monthsNumber = 12;
    for (let mon = 1;mon <= monthsNumber;mon++) {
        let monthDays = new Date(2022, `${mon}`, 0).getDate()
        calendar[mon] = [];
        for (let day = 1;day <= monthDays;day++) {
            calendar[mon][day] = {};
        }
    }

}


buildCalendar()

export {calendar, months, weekDays}
